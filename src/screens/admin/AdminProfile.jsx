import { useNavigate } from 'react-router-dom'
import { LogOut, ShieldCheck, Mail } from 'lucide-react'
import Header from '../../components/Header.jsx'
import { useApp } from '../../context/AppContext.jsx'

export default function AdminProfile() {
  const { user, signOut } = useApp()
  const navigate = useNavigate()
  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      <Header title="Profile" />
      <div className="screen">
        <div className="card" style={{ textAlign: 'center', paddingTop: 24 }}>
          <div className="avatar" style={{ margin: '0 auto 14px', background: 'linear-gradient(135deg,#3b6fe0,#36c2b4)' }}>
            {initials}
          </div>
          <h2 style={{ margin: '0 0 4px' }}>{user.name}</h2>
          <span className="pill blue">
            <ShieldCheck size={14} /> Event Admin
          </span>
        </div>

        <div className="card">
          <div className="list-row" style={{ paddingTop: 0 }}>
            <div className="row">
              <Mail size={18} className="muted" />
              <span className="muted">Email</span>
            </div>
            <strong style={{ fontSize: 13 }}>{user.email}</strong>
          </div>
          <div className="list-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="row">
              <ShieldCheck size={18} className="muted" />
              <span className="muted">Role</span>
            </div>
            <strong>Admin · Event host</strong>
          </div>
        </div>

        <div className="card muted" style={{ fontSize: 13 }}>
          As an admin, every event you create is time/date-boxed and manned by you —
          volunteers can only check in during the scheduled window, and hours are only
          awarded after you verify the before/after photos.
        </div>

        <button
          className="btn outline"
          onClick={() => {
            signOut()
            navigate('/')
          }}
        >
          <LogOut size={18} /> Log out
        </button>
      </div>
    </>
  )
}
