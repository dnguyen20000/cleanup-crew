import { createContext, useContext, useEffect, useState } from 'react'
import { View, Text, ActivityIndicator } from 'react-native'
import { auth, db, storage } from '../firebase.js'
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth'
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  onSnapshot, 
  updateDoc, 
  addDoc,
  deleteDoc
} from 'firebase/firestore'
import { ref, uploadString, getDownloadURL } from 'firebase/storage'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('volunteer')
  const [listings, setListings] = useState([])
  const [signups, setSignups] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  // --- Auth & User profile ---
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({ 
          uid: firebaseUser.uid, 
          email: firebaseUser.email, 
          role: 'volunteer',
          name: 'Volunteer',
          points: 0,
          totalHours: 0,
          cleanups: 0,
          lbsCollected: 0,
          hometown: 'Loading...'
        })
        setRole('volunteer')
      } else {
        setUser(null)
        setRole('volunteer')
      }
      setLoading(false)
    })
    return () => unsub()
  }, [])

  // --- Real-time Listeners ---
  useEffect(() => {
    if (!user) return

    // Listen to user profile
    const unsubUser = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const profile = docSnap.data()
        setUser(prev => ({ ...prev, ...profile }))
        setRole(profile.role || 'volunteer')
      }
    })

    const unsubListings = onSnapshot(collection(db, 'listings'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setListings(data)
    })

    const unsubSignups = onSnapshot(collection(db, 'signups'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setSignups(data)
    })

    return () => {
      unsubUser()
      unsubListings()
      unsubSignups()
    }
  }, [user?.uid])

  // --- Auth Actions ---
  const signIn = async (profile, asRole) => {
    try {
      if (profile.isSignup) {
        const cred = await createUserWithEmailAndPassword(auth, profile.email, profile.password)
        await setDoc(doc(db, 'users', cred.user.uid), {
          name: profile.name || 'Volunteer',
          email: profile.email,
          role: asRole,
          points: 0,
          totalHours: 0,
          cleanups: 0,
          hometown: profile.hometown || 'Local Community',
          team: 'Earth Defenders'
        })
      } else {
        await signInWithEmailAndPassword(auth, profile.email, profile.password)
      }
      return true
    } catch (err) {
      console.error(err)
      showToast(err.message.replace('Firebase: ', ''))
      return false
    }
  }

  const signOut = () => {
    firebaseSignOut(auth)
  }

  // --- Volunteer: sign up for an event ---
  const signUpForEvent = async (listing) => {
    if (signups.some((s) => s.listingId === listing.id && s.uid === user.uid)) {
      showToast('Already signed up')
      return
    }
    try {
      await addDoc(collection(db, 'signups'), {
        listingId: listing.id,
        uid: user.uid,
        title: listing.title,
        eventDate: listing.eventDate,
        startTime: listing.startTime,
        endTime: listing.endTime,
        estimatedHours: listing.estimatedHours,
        status: 'registered',
        beforePhotoURL: null,
        afterPhotoURL: null
      })
      await updateDoc(doc(db, 'listings', listing.id), {
        signupCount: listing.signupCount + 1
      })
      showToast('You’re signed up! 🎉')
    } catch (err) {
      console.error(err)
      showToast('Failed to sign up')
    }
  }

  const cancelSignup = async (signupId) => {
    try {
      const signup = signups.find(s => s.id === signupId)
      if (!signup) return
      
      const listing = listings.find(l => l.id === signup.listingId)
      
      // Delete signup document
      await deleteDoc(doc(db, 'signups', signupId))
      
      // Decrement listing count
      if (listing) {
        await updateDoc(doc(db, 'listings', listing.id), {
          signupCount: Math.max(0, listing.signupCount - 1)
        })
      }
      
      showToast('Signup cancelled')
    } catch (err) {
      console.error(err)
      showToast('Failed to cancel signup')
    }
  }

  const checkIn = async (signupId) => {
    try {
      await updateDoc(doc(db, 'signups', signupId), { 
        checkedIn: true,
        checkInTime: Date.now()
      })
      showToast('Checked in successfully!')
    } catch (err) {
      console.error(err)
      showToast('Failed to check in')
    }
  }

  // --- Photo upload + completion ---
  const setPhoto = async (signupId, kind, fileOrDataUrl) => {
    try {
      const field = kind === 'before' ? 'beforePhotoURL' : 'afterPhotoURL'
      await updateDoc(doc(db, 'signups', signupId), {
        [field]: fileOrDataUrl
      })
    } catch (err) {
      console.error(err)
      showToast('Failed to save photo')
    }
  }

  const submitForReview = async (signupId, actualHours) => {
    try {
      await updateDoc(doc(db, 'signups', signupId), { 
        status: 'pending',
        actualHours: actualHours
      })
      showToast('Submitted for admin review')
    } catch (err) {
      console.error('Submit for review failed:', err)
      showToast('Failed to submit: ' + err.message)
      throw err
    }
  }

  // --- Admin: approve completion, award hours/points ---
  const approveCompletion = async (signupId) => {
    const su = signups.find((s) => s.id === signupId)
    if (!su) return
    const hours = su.actualHours || su.estimatedHours
    const pts = Math.round(hours * 50)
    try {
      await updateDoc(doc(db, 'signups', signupId), {
        status: 'completed',
        hoursAwarded: hours,
        pointsAwarded: pts
      })
      const userRef = doc(db, 'users', su.uid)
      const userSnap = await getDoc(userRef)
      if (userSnap.exists()) {
        const u = userSnap.data()
        await updateDoc(userRef, {
          points: (u.points || 0) + pts,
          totalHours: +(((u.totalHours || 0) + hours).toFixed(1)),
          cleanups: (u.cleanups || 0) + 1
        })
      }
      showToast(`Approved! +${hours}h, +${pts} pts`)
    } catch (err) {
      showToast('Error approving')
    }
  }

  // --- Admin: create a listing ---
  const addListing = async (data) => {
    try {
      let photoUrl = data.photoURL || 'https://images.unsplash.com/photo-1618477461853-cf6ed80fbfc9?auto=format&fit=crop&q=80&w=800'

      
      await addDoc(collection(db, 'listings'), {
        signupCount: 0,
        status: 'open',
        adminId: user.uid,
        adminName: `${user.name} (Admin)`,
        location: data.location || { lat: 33.92 + Math.random() * 0.06, lng: -84.36 + Math.random() * 0.06 },
        ...data,
        photoURL: photoUrl
      })
      showToast('Listing published')
    } catch (err) {
      console.error(err)
      showToast('Error publishing listing')
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2fae7a" />
        <Text style={{ marginTop: 20, color: '#9a9aa2' }}>Loading Ripple...</Text>
      </View>
    )
  }

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        listings,
        signups,
        toast,
        showToast,
        signIn,
        signOut,
        signUpForEvent,
        cancelSignup,
        checkIn,
        setPhoto,
        submitForReview,
        approveCompletion,
        addListing
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
