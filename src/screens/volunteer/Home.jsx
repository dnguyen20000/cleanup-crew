import { useNavigate } from 'react-router-dom'
import { Bell, TrendingUp, Leaf, Clock, Award, ChevronRight, Users } from 'lucide-react'
import Header from '../../components/Header.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { rankFor, nextRank, MOCK_LEADERBOARD } from '../../data/mockData.js'

export default function Home() {
  const { user, listings, signups } = useApp()
  const navigate = useNavigate()
  const rank = rankFor(user.points)
  const next = nextRank(user.points)
  const pct = next
    ? Math.min(100, Math.round(((user.points - rank.min) / (next.min - rank.min)) * 100))
    : 100

  const upcoming = signups
    .filter((s) => s.status !== 'completed')
    .slice(0, 3)

  return (
    <>
      <Header
        title={`Hi, ${user.name.split(' ')[0]}`}
        sub="Let’s make an impact today"
        right={
          <div className="icon-btn">
            <Bell size={20} />
          </div>
        }
      />
      <div className="screen">
        {/* Rank / progress hero */}
        <div className="rank-badge" style={{ marginBottom: 14 }}>
          <div className="rank-emoji">{rank.emoji}</div>
          <div style={{ flex: 1 }}>
            <div className="row between">
              <strong style={{ fontSize: 17 }}>{rank.name}</strong>
              <span className="pill green">{user.points} pts</span>
            </div>
            <div className="progress" style={{ marginTop: 10 }}>
              <span style={{ width: pct + '%' }} />
            </div>
            <div className="faint" style={{ fontSize: 12, marginTop: 6 }}>
              {next ? `${next.min - user.points} pts to ${next.name} ${next.emoji}` : 'Max rank reached 🎉'}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="stat-grid">
          <div className="stat">
            <div className="num">{user.totalHours}h</div>
            <div className="lbl">
              <Clock size={12} style={{ verticalAlign: -1 }} /> Volunteer hours
            </div>
          </div>
          <div className="stat">
            <div className="num">{rank.emoji}</div>
            <div className="lbl">
              <Award size={12} style={{ verticalAlign: -1 }} /> {rank.name}
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="row between" style={{ marginTop: 8 }}>
          <div className="section-title" style={{ margin: '14px 0 10px' }}>
            Your upcoming events
          </div>
        </div>
        {upcoming.length === 0 ? (
          <div className="card">
            <div className="muted" style={{ marginBottom: 12 }}>
              No events yet — find a hot spot near you.
            </div>
            <button className="btn primary" onClick={() => navigate('/app/map')}>
              Find a cleanup
            </button>
          </div>
        ) : (
          upcoming.map((s) => (
            <div key={s.id} className="card" onClick={() => navigate('/app/calendar')}>
              <div className="row between">
                <div>
                  <strong>{s.title}</strong>
                  <div className="muted" style={{ fontSize: 13, marginTop: 3 }}>
                    {s.eventDate} · {s.startTime}–{s.endTime}
                  </div>
                </div>
                <span className={'pill ' + (s.status === 'pending' ? 'orange' : 'green')}>
                  {s.status === 'pending' ? 'In review' : 'Registered'}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Team leaderboard */}
        <div className="section-title">
          <Users size={18} style={{ verticalAlign: -3, marginRight: 6 }} />
          Team leaderboard
        </div>
        <div className="card" style={{ padding: 6 }}>
          {MOCK_LEADERBOARD.map((t, i) => (
            <div
              key={t.name}
              className="list-row"
              style={{ padding: '14px 12px', borderBottom: i === MOCK_LEADERBOARD.length - 1 ? 'none' : undefined }}
            >
              <div className="row">
                <span style={{ width: 22, fontWeight: 800, color: i === 0 ? '#e0b341' : '#6b6b73' }}>
                  {i + 1}
                </span>
                <div>
                  <strong>{t.name}</strong>
                  <div className="faint" style={{ fontSize: 12 }}>
                    {t.members} members
                  </div>
                </div>
              </div>
              <span className="pill green">{t.points.toLocaleString()}</span>
            </div>
          ))}
        </div>

        <button className="btn outline" onClick={() => navigate('/app/map')}>
          <TrendingUp size={18} /> See cleanup hot spots
          <ChevronRight size={18} />
        </button>
      </div>
    </>
  )
}
