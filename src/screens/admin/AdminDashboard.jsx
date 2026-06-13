import Header from '../../components/Header.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { Users, Clock, MapPin, CheckCircle2 } from 'lucide-react'

export default function AdminDashboard() {
  const { user, listings, signups } = useApp()
  const totalVolunteers = listings.reduce((a, l) => a + l.signupCount, 0)
  const pending = signups.filter((s) => s.status === 'pending').length
  const completed = signups.filter((s) => s.status === 'completed').length
  const hoursLogged = signups
    .filter((s) => s.status === 'completed')
    .reduce((a, s) => a + (s.hoursAwarded || 0), 0)

  return (
    <>
      <Header title="Admin" sub={`Welcome, ${user.name.split(' ')[0]}`} />
      <div className="screen">
        <div className="hero">
          <div className="muted" style={{ fontSize: 13 }}>Community impact this season</div>
          <div style={{ fontSize: 34, fontWeight: 800, margin: '4px 0' }}>
            {hoursLogged + 142}h
          </div>
          <div className="muted" style={{ fontSize: 13 }}>
            volunteer hours logged across {listings.length} active hot spots
          </div>
        </div>

        <div className="stat-grid">
          <div className="stat">
            <div className="num">{listings.length}</div>
            <div className="lbl">
              <MapPin size={12} style={{ verticalAlign: -1 }} /> Active listings
            </div>
          </div>
          <div className="stat">
            <div className="num">{totalVolunteers}</div>
            <div className="lbl">
              <Users size={12} style={{ verticalAlign: -1 }} /> Volunteers signed up
            </div>
          </div>
          <div className="stat">
            <div className="num" style={{ color: pending ? '#f3a45f' : undefined }}>
              {pending}
            </div>
            <div className="lbl">
              <Clock size={12} style={{ verticalAlign: -1 }} /> Pending review
            </div>
          </div>
          <div className="stat">
            <div className="num">{completed}</div>
            <div className="lbl">
              <CheckCircle2 size={12} style={{ verticalAlign: -1 }} /> Verified cleanups
            </div>
          </div>
        </div>

        <div className="section-title">Your hot spots</div>
        {listings.map((l) => (
          <div key={l.id} className="card">
            <div className="row between">
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong>{l.title}</strong>
                <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>
                  {l.eventDate} · {l.startTime}–{l.endTime}
                </div>
              </div>
              <span className="pill blue">
                {l.signupCount}/{l.capacity}
              </span>
            </div>
            <div className="progress" style={{ marginTop: 12 }}>
              <span style={{ width: Math.min(100, (l.signupCount / l.capacity) * 100) + '%' }} />
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
