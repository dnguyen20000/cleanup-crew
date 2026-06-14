import Header from '../../components/Header.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { CheckCircle2, Clock } from 'lucide-react'

export default function Verify() {
  const { signups, approveCompletion } = useApp()
  const pending = signups.filter((s) => s.status === 'pending')
  const done = signups.filter((s) => s.status === 'completed')

  return (
    <>
      <Header title="Verify" sub="Approve before/after proof" />
      <div className="screen">
        <div className="section-title" style={{ marginTop: 0 }}>
          Pending review ({pending.length})
        </div>

        {pending.length === 0 && (
          <div className="empty">
            No submissions waiting.
            <br />
            Approved cleanups award volunteer hours + points.
          </div>
        )}

        {pending.map((s) => (
          <div key={s.id} className="card">
            <div className="row between" style={{ marginBottom: 12 }}>
              <strong>{s.title}</strong>
              <span className="pill orange">
                <Clock size={12} /> Pending
              </span>
            </div>
            <div className="beforeafter">
              <div>
                <div className="ba-label">Before</div>
                <img src={s.beforePhotoURL} alt="before" />
              </div>
              <div>
                <div className="ba-label">After</div>
                <img src={s.afterPhotoURL} alt="after" />
              </div>
            </div>
            <div className="muted" style={{ fontSize: 13, margin: '12px 0' }}>
              Will award {s.actualHours || s.estimatedHours}h + {Math.round((s.actualHours || s.estimatedHours) * 50)} pts on approval
            </div>
            <button className="btn primary" onClick={() => approveCompletion(s.id)}>
              <CheckCircle2 size={18} /> Approve & award hours
            </button>
          </div>
        ))}

        {done.length > 0 && (
          <>
            <div className="section-title">Verified ({done.length})</div>
            {done.map((s) => (
              <div key={s.id} className="card">
                <div className="row between">
                  <div>
                    <strong>{s.title}</strong>
                    <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>
                      {s.eventDate}
                    </div>
                  </div>
                  <span className="pill green">
                    +{s.hoursAwarded}h · +{s.pointsAwarded} pts
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  )
}
