import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export default function SignIn() {
  const { signIn } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('volunteer')
  const [isSignup, setIsSignup] = useState(true)
  const [name, setName] = useState('')
  const [hometown, setHometown] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [gps, setGps] = useState(false)
  const [loading, setLoading] = useState(false)

  const requestGps = () => {
    if (!navigator.geolocation) {
      setGps(true)
      return
    }
    navigator.geolocation.getCurrentPosition(
      () => setGps(true),
      () => setGps(true)
    )
  }

  const submit = async () => {
    if (!email || !password) return
    setLoading(true)
    const success = await signIn(
      {
        name: name || (tab === 'admin' ? 'Admin User' : 'Volunteer'),
        hometown,
        email,
        password,
        isSignup
      },
      tab
    )
    setLoading(false)
    if (success) {
      navigate(tab === 'admin' ? '/admin/dashboard' : '/app/home')
    }
  }

  return (
    <div className="phone">
      <div className="phone-body no-tabs">
        <div className="auth">
          <div className="logo">🌱</div>
          <h1>Ripple</h1>
          <p className="tag">Pick up litter. Earn rewards. Build community.</p>

          <div className="role-toggle">
            <button className={tab === 'volunteer' ? 'on' : ''} onClick={() => setTab('volunteer')}>
              Volunteer
            </button>
            <button className={tab === 'admin' ? 'on' : ''} onClick={() => setTab('admin')}>
              Admin
            </button>
          </div>

          <div className="row" style={{ gap: 10, marginBottom: 12, justifyContent: 'center' }}>
            <label style={{ fontSize: 13, cursor: 'pointer' }}>
              <input type="radio" checked={isSignup} onChange={() => setIsSignup(true)} /> Sign Up
            </label>
            <label style={{ fontSize: 13, cursor: 'pointer' }}>
              <input type="radio" checked={!isSignup} onChange={() => setIsSignup(false)} /> Log In
            </label>
          </div>

          {isSignup && (
            <>
              <div className="field">
                <label>Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              {tab === 'volunteer' && (
                <div className="field">
                  <label>Hometown</label>
                  <input
                    value={hometown}
                    onChange={(e) => setHometown(e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              )}
            </>
          )}

          <div className="field">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              type="email"
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              type="password"
            />
          </div>

          <button
            className="btn outline"
            style={{ marginTop: 6 }}
            onClick={requestGps}
          >
            <MapPin size={18} />
            {gps ? 'Location enabled ✓' : 'Enable location services'}
          </button>

          <button className="btn primary" style={{ marginTop: 8 }} onClick={submit} disabled={loading}>
            {loading ? 'Processing...' : isSignup ? 'Create Account' : 'Log In'}
          </button>
        </div>
      </div>
    </div>
  )
}
