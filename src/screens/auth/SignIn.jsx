import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

export default function SignIn() {
  const { signIn } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState('volunteer')
  const [name, setName] = useState('Ryleigh J')
  const [hometown, setHometown] = useState('Sandy Springs, GA')
  const [email, setEmail] = useState('')
  const [gps, setGps] = useState(false)

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

  const submit = () => {
    signIn(
      {
        name: name || (tab === 'admin' ? 'Marcus T' : 'Volunteer'),
        hometown,
        email: email || `${(name || 'user').toLowerCase().replace(/\s+/g, '')}@cleanupcrew.app`
      },
      tab
    )
    navigate(tab === 'admin' ? '/admin/dashboard' : '/app/home')
  }

  return (
    <div className="phone">
      <div className="phone-body no-tabs">
        <div className="auth">
          <div className="logo">🌱</div>
          <h1>CleanUp Crew</h1>
          <p className="tag">Pick up litter. Earn rewards. Build community.</p>

          <div className="role-toggle">
            <button className={tab === 'volunteer' ? 'on' : ''} onClick={() => setTab('volunteer')}>
              Volunteer
            </button>
            <button className={tab === 'admin' ? 'on' : ''} onClick={() => setTab('admin')}>
              Admin
            </button>
          </div>

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
          <div className="field">
            <label>Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              type="email"
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

          <button className="btn primary" style={{ marginTop: 8 }} onClick={submit}>
            {tab === 'admin' ? 'Continue as Admin' : 'Get started'}
          </button>

          <p className="faint" style={{ textAlign: 'center', fontSize: 12, marginTop: 8 }}>
            Demo build · no real account needed
          </p>
        </div>
      </div>
    </div>
  )
}
