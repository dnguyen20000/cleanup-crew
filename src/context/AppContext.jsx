import { createContext, useContext, useEffect, useState } from 'react'
import { MOCK_USER, MOCK_LISTINGS } from '../data/mockData.js'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

const load = (key, fallback) => {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch {
    return fallback
  }
}

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => load('cc_user', null))
  const [role, setRole] = useState(() => load('cc_role', 'volunteer'))
  const [listings, setListings] = useState(() => load('cc_listings', MOCK_LISTINGS))
  const [signups, setSignups] = useState(() => load('cc_signups', []))
  const [toast, setToast] = useState(null)

  useEffect(() => localStorage.setItem('cc_user', JSON.stringify(user)), [user])
  useEffect(() => localStorage.setItem('cc_role', JSON.stringify(role)), [role])
  useEffect(() => localStorage.setItem('cc_listings', JSON.stringify(listings)), [listings])
  useEffect(() => localStorage.setItem('cc_signups', JSON.stringify(signups)), [signups])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2200)
  }

  // --- Auth (mock) ---
  const signIn = (profile, asRole) => {
    const base = asRole === 'admin'
      ? { ...MOCK_USER, role: 'admin', name: profile.name || 'Marcus T', points: 0 }
      : { ...MOCK_USER, ...profile, role: 'volunteer' }
    setUser({ ...base, ...profile, role: asRole })
    setRole(asRole)
  }
  const signOut = () => {
    setUser(null)
  }

  // --- Volunteer: sign up for an event ---
  const signUpForEvent = (listing) => {
    if (signups.some((s) => s.listingId === listing.id)) {
      showToast('Already signed up')
      return
    }
    const su = {
      id: 's' + Date.now(),
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
    }
    setSignups((p) => [...p, su])
    setListings((p) =>
      p.map((l) => (l.id === listing.id ? { ...l, signupCount: l.signupCount + 1 } : l))
    )
    showToast('You’re signed up! 🎉')
  }

  const cancelSignup = (signupId) => {
    const su = signups.find((s) => s.id === signupId)
    setSignups((p) => p.filter((s) => s.id !== signupId))
    if (su) {
      setListings((p) =>
        p.map((l) =>
          l.id === su.listingId ? { ...l, signupCount: Math.max(0, l.signupCount - 1) } : l
        )
      )
    }
  }

  // --- Photo upload + completion ---
  const setPhoto = (signupId, kind, dataUrl) => {
    setSignups((p) =>
      p.map((s) =>
        s.id === signupId
          ? { ...s, [kind === 'before' ? 'beforePhotoURL' : 'afterPhotoURL']: dataUrl }
          : s
      )
    )
  }

  const submitForReview = (signupId) => {
    setSignups((p) => p.map((s) => (s.id === signupId ? { ...s, status: 'pending' } : s)))
    showToast('Submitted for admin review')
  }

  // --- Admin: approve completion, award hours/points ---
  const approveCompletion = (signupId) => {
    const su = signups.find((s) => s.id === signupId)
    if (!su) return
    const hours = su.estimatedHours
    const pts = Math.round(hours * 50)
    setSignups((p) =>
      p.map((s) =>
        s.id === signupId
          ? { ...s, status: 'completed', hoursAwarded: hours, pointsAwarded: pts }
          : s
      )
    )
    setUser((u) => ({
      ...u,
      points: (u.points || 0) + pts,
      totalHours: +(((u.totalHours || 0) + hours).toFixed(1)),
      cleanups: (u.cleanups || 0) + 1
    }))
    showToast(`Approved! +${hours}h, +${pts} pts`)
  }

  // --- Admin: create a listing ---
  const addListing = (data) => {
    const listing = {
      id: 'l' + Date.now(),
      signupCount: 0,
      status: 'open',
      adminId: user.uid,
      adminName: `${user.name} (Admin)`,
      location: data.location || { lat: 33.92 + Math.random() * 0.06, lng: -84.36 + Math.random() * 0.06 },
      ...data
    }
    setListings((p) => [listing, ...p])
    showToast('Listing published')
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
