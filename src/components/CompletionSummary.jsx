import { CheckCircle2, Recycle, Clock, Award, TrendingUp, Sparkles } from 'lucide-react'
import { rankFor, nextRank } from '../data/mockData.js'

// Shown right after a volunteer finishes a cleanup and submits proof.
// Celebratory "job complete" impact summary.
export default function CompletionSummary({ signup, user, onClose }) {
  if (!signup) return null

  const hours = signup.actualHours || signup.estimatedHours
  const points = Math.round(hours * 50)

  const projectedPoints = (user.points || 0) + points
  const rank = rankFor(projectedPoints)
  const next = nextRank(projectedPoints)
  const toNext = next ? next.min - projectedPoints : 0

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="grab" />

        <div style={{ textAlign: 'center', padding: '6px 0 4px' }}>
          <div style={{ fontSize: 56, lineHeight: 1 }}>🎉</div>
          <h2 style={{ margin: '12px 0 4px', fontSize: 24 }}>Cleanup complete!</h2>
          <p className="muted" style={{ margin: 0, fontSize: 14 }}>
            Thanks for cleaning up <strong style={{ color: 'var(--text)' }}>{signup.title}</strong>
          </p>
        </div>

        {/* Before / after */}
        {(signup.beforePhotoURL || signup.afterPhotoURL) && (
          <div className="beforeafter" style={{ marginTop: 18 }}>
            <div>
              <div className="ba-label">Before</div>
              <img src={signup.beforePhotoURL} alt="before" />
            </div>
            <div>
              <div className="ba-label">After</div>
              <img src={signup.afterPhotoURL} alt="after" />
            </div>
          </div>
        )}

        {/* Impact stats */}
        <div className="stat-grid" style={{ marginTop: 18 }}>
          <div className="stat">
            <div className="num">{hours}h</div>
            <div className="lbl">
              <Clock size={12} style={{ verticalAlign: -1 }} /> hours logged
            </div>
          </div>
          <div className="stat">
            <div className="num" style={{ color: 'var(--gold)' }}>+{points}</div>
            <div className="lbl">
              <Sparkles size={12} style={{ verticalAlign: -1 }} /> points earned
            </div>
          </div>
        </div>

        {/* Rank progress */}
        {next && (
          <div className="card" style={{ marginTop: 14, marginBottom: 0 }}>
            <div className="row between" style={{ marginBottom: 8 }}>
              <span className="row" style={{ gap: 6 }}>
                <TrendingUp size={16} color="var(--teal)" /> Almost there
              </span>
              <span className="faint" style={{ fontSize: 12 }}>
                {toNext} pts to {next.name} {next.emoji}
              </span>
            </div>
            <div className="progress">
              <span
                style={{
                  width:
                    Math.min(
                      100,
                      Math.round(((projectedPoints - rank.min) / (next.min - rank.min)) * 100)
                    ) + '%'
                }}
              />
            </div>
          </div>
        )}

        <div
          className="row"
          style={{ gap: 8, justifyContent: 'center', color: 'var(--text-dim)', fontSize: 13, margin: '16px 0 4px' }}
        >
          <CheckCircle2 size={16} color="var(--green)" />
          Sent to admin — points &amp; hours confirm after verification
        </div>

        <button className="btn primary" style={{ marginTop: 10 }} onClick={onClose}>
          Done
        </button>
      </div>
    </div>
  )
}
