import { useState } from 'react'
import { Clock, AlertCircle, CheckCircle2, X } from 'lucide-react'
import Header from '../../components/Header.jsx'
import PhotoUpload from '../../components/PhotoUpload.jsx'
import CompletionSummary from '../../components/CompletionSummary.jsx'
import { useApp } from '../../context/AppContext.jsx'

// Anti-cheat: check-in only allowed within the event's date/time window.
function withinWindow(s, now) {
  try {
    const start = new Date(`${s.eventDate}T${s.startTime}:00`)
    const end = new Date(`${s.eventDate}T${s.endTime}:00`)
    return now >= start && now <= end
  } catch {
    return false
  }
}

function buildWeek() {
  const today = new Date('2026-06-13T12:00:00')
  const days = []
  const start = new Date(today)
  start.setDate(start.getDate())
  for (let i = 0; i < 7; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(d)
  }
  return days
}

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function Calendar() {
  const { signups, cancelSignup, setPhoto, submitForReview, user } = useApp()
  const [openId, setOpenId] = useState(null)
  const [celebrate, setCelebrate] = useState(null)
  const now = new Date()
  const week = buildWeek()
  const datesWithEvents = new Set(signups.map((s) => s.eventDate))

  return (
    <>
      <Header title="Schedule" sub="Your signed-up cleanups" />
      <div className="screen">
        <div className="week-strip">
          {week.map((d, i) => {
            const iso = d.toISOString().slice(0, 10)
            const has = datesWithEvents.has(iso)
            const isToday = i === 0
            return (
              <div key={i} className={'day' + (isToday ? ' active' : '')}>
                <span className="dow">{DOW[d.getDay()]}</span>
                <span className="dnum">{d.getDate()}</span>
                <span className="marker" style={{ visibility: has ? 'visible' : 'hidden' }} />
              </div>
            )
          })}
        </div>

        {signups.length === 0 && (
          <div className="empty">
            No events scheduled yet.
            <br />
            Head to the Map to sign up for a cleanup.
          </div>
        )}

        {signups.map((s) => {
          const open = openId === s.id
          const canCheckIn = withinWindow(s, now)
          const done = s.status === 'completed'
          const pending = s.status === 'pending'
          return (
            <div key={s.id} className="card">
              <div className="row between">
                <div style={{ flex: 1 }}>
                  <strong style={{ fontSize: 16 }}>{s.title}</strong>
                  <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
                    {s.eventDate} · {s.startTime}–{s.endTime}
                  </div>
                </div>
                <span
                  className={
                    'pill ' + (done ? 'green' : pending ? 'orange' : 'blue')
                  }
                >
                  {done ? 'Completed' : pending ? 'In review' : 'Registered'}
                </span>
              </div>

              {!done && (
                <>
                  <div className="divider" />
                  {!canCheckIn && !pending ? (
                    <div className="row" style={{ gap: 8, color: 'var(--text-dim)', fontSize: 13 }}>
                      <Clock size={16} />
                      Check-in opens at {s.startTime} on event day (anti-cheat window)
                    </div>
                  ) : pending ? (
                    <div className="row" style={{ gap: 8, color: '#f3a45f', fontSize: 13 }}>
                      <AlertCircle size={16} />
                      Submitted — waiting for admin to verify your before/after photos
                    </div>
                  ) : (
                    <>
                      {!open ? (
                        <button className="btn primary" onClick={() => setOpenId(s.id)}>
                          Check in & log proof
                        </button>
                      ) : (
                        <div>
                          <div className="beforeafter" style={{ marginBottom: 12 }}>
                            <PhotoUpload
                              label="Before"
                              value={s.beforePhotoURL}
                              onChange={(d) => setPhoto(s.id, 'before', d)}
                            />
                            <PhotoUpload
                              label="After"
                              value={s.afterPhotoURL}
                              onChange={(d) => setPhoto(s.id, 'after', d)}
                            />
                          </div>
                          <button
                            className="btn primary"
                            disabled={!s.beforePhotoURL || !s.afterPhotoURL}
                            onClick={() => {
                              submitForReview(s.id)
                              setOpenId(null)
                              setCelebrate(s)
                            }}
                          >
                            <CheckCircle2 size={18} /> Submit for review
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {!pending && (
                    <button
                      className="btn outline sm"
                      style={{ width: '100%', marginTop: 8 }}
                      onClick={() => cancelSignup(s.id)}
                    >
                      <X size={16} /> Cancel signup
                    </button>
                  )}
                </>
              )}

              {done && (
                <>
                  <div className="divider" />
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
                  <div className="row between" style={{ marginTop: 12 }}>
                    <span className="pill green">+{s.hoursAwarded}h verified</span>
                    <span className="pill gold">+{s.pointsAwarded} pts</span>
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>

      <CompletionSummary signup={celebrate} user={user} onClose={() => setCelebrate(null)} />
    </>
  )
}
