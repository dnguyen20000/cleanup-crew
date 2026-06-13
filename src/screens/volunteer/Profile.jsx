import { useNavigate } from 'react-router-dom'
import { Download, MapPin, Mail, Users, LogOut, Award, ShieldCheck } from 'lucide-react'
import Header from '../../components/Header.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { rankFor } from '../../data/mockData.js'
import { downloadCertificate } from '../../utils/cert.js'

export default function Profile() {
  const { user, signOut, signups } = useApp()
  const navigate = useNavigate()
  const rank = rankFor(user.points)
  const completed = signups.filter((s) => s.status === 'completed').length
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
          <div className="avatar" style={{ margin: '0 auto 14px' }}>
            {initials}
          </div>
          <h2 style={{ margin: '0 0 4px' }}>{user.name}</h2>
          <div className="row" style={{ justifyContent: 'center', gap: 8 }}>
            <span className="pill green">
              {rank.emoji} {rank.name}
            </span>
            <span className="pill gold">{user.points} pts</span>
          </div>
        </div>

        <div className="card">
          <div className="list-row" style={{ paddingTop: 0 }}>
            <div className="row">
              <MapPin size={18} className="muted" />
              <span className="muted">Hometown</span>
            </div>
            <strong>{user.hometown}</strong>
          </div>
          <div className="list-row">
            <div className="row">
              <Mail size={18} className="muted" />
              <span className="muted">Email</span>
            </div>
            <strong style={{ fontSize: 13 }}>{user.email}</strong>
          </div>
          <div className="list-row">
            <div className="row">
              <Users size={18} className="muted" />
              <span className="muted">Team</span>
            </div>
            <strong>{user.team}</strong>
          </div>
          <div className="list-row" style={{ borderBottom: 'none', paddingBottom: 0 }}>
            <div className="row">
              <ShieldCheck size={18} className="muted" />
              <span className="muted">Location services</span>
            </div>
            <span className="pill green">On</span>
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat">
            <div className="num">{user.totalHours}h</div>
            <div className="lbl">Verified hours</div>
          </div>
          <div className="stat">
            <div className="num">{completed || user.cleanups}</div>
            <div className="lbl">Cleanups done</div>
          </div>
        </div>

        <div className="hero">
          <div className="row" style={{ gap: 10, marginBottom: 8 }}>
            <Award size={22} color="#e0b341" />
            <strong style={{ fontSize: 17 }}>Volunteer hours certificate</strong>
          </div>
          <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
            Download a verified PDF of your {user.totalHours} hours — great for school,
            scholarships, or service requirements.
          </div>
          <button className="btn primary" onClick={() => downloadCertificate({ ...user, rank: rank.name })}>
            <Download size={18} /> Download certificate
          </button>
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
        <p className="faint" style={{ textAlign: 'center', fontSize: 12 }}>
          CleanUp Crew · Demo build v0.1
        </p>
      </div>
    </>
  )
}
