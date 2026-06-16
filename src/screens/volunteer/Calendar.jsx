import { useState, useEffect } from 'react'
import { Clock, AlertCircle, CheckCircle2, X } from 'lucide-react'
import Header from '../../components/Header.jsx'
import PhotoUpload from '../../components/PhotoUpload.jsx'
import CompletionSummary from '../../components/CompletionSummary.jsx'
import { useApp } from '../../context/AppContext.jsx'

// Anti-cheat: check-in only allowed within the event's date/time window.
// Temporarily bypassed for demo/testing purposes
function withinWindow(s, now) {
  return true
}

function toIsoDate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function buildMonthWeeks(baseDate = new Date()) {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  
  const startDate = new Date(firstDayOfMonth)
  startDate.setDate(startDate.getDate() - startDate.getDay()) // Go back to Sunday
  
  const endDate = new Date(lastDayOfMonth)
  if (endDate.getDay() !== 6) {
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay())) // Go forward to Saturday
  }

  const weeks = []
  let currentWeek = []
  let curr = new Date(startDate)

  while (curr <= endDate) {
    currentWeek.push(new Date(curr))
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
    curr.setDate(curr.getDate() + 1)
  }

  return weeks
}

function buildWeekFromStart(startIso) {
  const [y, m, d] = startIso.split('-')
  const start = new Date(y, m - 1, d)
  const days = []
  for (let i = 0; i < 7; i++) {
    const day = new Date(start)
    day.setDate(start.getDate() + i)
    days.push(day)
  }
  return days
}

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function Calendar() {
  const { signups, cancelSignup, checkIn, setPhoto, submitForReview, user } = useApp()
  const mySignups = signups.filter((s) => s.uid === user?.uid)
  
  const [openId, setOpenId] = useState(null)
  const [celebrate, setCelebrate] = useState(null)
  
  const [activeWeekStart, setActiveWeekStart] = useState(null)
  const [activeDay, setActiveDay] = useState(null)

  const now = new Date()
  const monthWeeks = buildMonthWeeks(now)
  const datesWithEvents = new Set(mySignups.map((s) => s.eventDate))

  const [nowMs, setNowMs] = useState(Date.now())
  useEffect(() => {
    if (openId) {
      const interval = setInterval(() => setNowMs(Date.now()), 1000)
      return () => clearInterval(interval)
    }
  }, [openId])

  const renderCard = (s) => {
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
                {!s.checkedIn ? (
                  <button className="btn primary" onClick={() => checkIn(s.id)}>
                    Check in
                  </button>
                ) : !open ? (
                  <button className="btn primary" onClick={() => setOpenId(s.id)}>
                    Log proof
                  </button>
                ) : (
                  <div>
                    {s.checkInTime && (
                      <div className="card" style={{ marginBottom: 12, padding: '10px 14px', background: 'var(--bg)', border: '1px solid var(--border)' }}>
                        <div className="row between">
                          <strong>Hours logged</strong>
                          <span className="pill gold" style={{ fontSize: 14 }}>
                            {Math.max(0.1, Number(((nowMs - s.checkInTime) / 3600000).toFixed(1)))}h
                          </span>
                        </div>
                      </div>
                    )}
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
                      onClick={async () => {
                        try {
                          const hours = s.checkInTime ? Math.max(0.1, Number(((Date.now() - s.checkInTime) / 3600000).toFixed(1))) : s.estimatedHours
                          await submitForReview(s.id, hours)
                          setOpenId(null)
                          setCelebrate({ ...s, actualHours: hours })
                        } catch (e) {
                          alert("Submission failed: " + e.message)
                        }
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
  }

  const activeDaySignups = activeDay ? mySignups.filter((s) => s.eventDate === activeDay) : []

  return (
    <>
      <Header title="Schedule" sub="Your signed-up cleanups" />
      <div className="screen">
        
        <h2 style={{ fontSize: 18, margin: '0 0 16px', fontWeight: 700 }}>
          {MONTH_NAMES[now.getMonth()]} {now.getFullYear()}
        </h2>

        <div className="month-grid">
          <div className="month-header">
            {DOW.map(d => <span key={d}>{d}</span>)}
          </div>
          {monthWeeks.map((week, wIdx) => (
            <div key={wIdx} className="week-row" onClick={() => {
              setActiveWeekStart(toIsoDate(week[0]))
              setActiveDay(null)
            }}>
              {week.map((d, dIdx) => {
                const iso = toIsoDate(d)
                const has = datesWithEvents.has(iso)
                const isToday = iso === toIsoDate(now)
                const isDim = d.getMonth() !== now.getMonth()
                return (
                  <div key={dIdx} className={'month-day' + (isDim ? ' dim' : '') + (isToday ? ' today' : '')}>
                    {d.getDate()}
                    {has && <span className="marker" />}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 24, paddingBottom: 40 }}>
          <h2 style={{ fontSize: 18, margin: '0 0 16px', fontWeight: 700 }}>Your scheduled cleanups</h2>
          {mySignups.length === 0 ? (
            <div className="empty">
              No events scheduled yet.
              <br />
              Head to the Map to sign up for a cleanup.
            </div>
          ) : (
            mySignups.map(s => renderCard(s))
          )}
        </div>

        {/* Weekly / Daily View Modal */}
        {activeWeekStart && (
          <div className="modal-overlay" onClick={() => setActiveWeekStart(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} style={{ paddingBottom: 40, minHeight: '50vh' }}>
              <div className="grab" onClick={() => setActiveWeekStart(null)} />
              
              <div className="week-strip">
                {buildWeekFromStart(activeWeekStart).map((d, i) => {
                  const iso = toIsoDate(d)
                  const has = datesWithEvents.has(iso)
                  const isActive = activeDay === iso
                  return (
                    <div key={i} className={'day' + (isActive ? ' active' : '')} onClick={() => setActiveDay(iso)}>
                      <span className="dow">{DOW[d.getDay()]}</span>
                      <span className="dnum">{d.getDate()}</span>
                      <span className="marker" style={{ visibility: has ? 'visible' : 'hidden' }} />
                    </div>
                  )
                })}
              </div>

              {activeDay ? (
                <div style={{ marginTop: 16 }}>
                  {activeDaySignups.length === 0 ? (
                    <div className="empty">No events scheduled on this day.</div>
                  ) : (
                    activeDaySignups.map(s => renderCard(s))
                  )}
                </div>
              ) : (
                <div className="empty" style={{ marginTop: 32 }}>
                  Tap a day to view your scheduled cleanups.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <CompletionSummary signup={celebrate} user={user} onClose={() => setCelebrate(null)} />
    </>
  )
}
