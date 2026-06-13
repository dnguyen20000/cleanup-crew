import { MapPin, Clock, Calendar, Users, Shield, Sparkles } from 'lucide-react'
import { SEVERITY } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'

function fmtDate(d) {
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return d
  }
}

export default function SlideUpModal({ listing, onClose }) {
  const { signUpForEvent, signups } = useApp()
  if (!listing) return null
  const sev = SEVERITY[listing.severity]
  const already = signups.some((s) => s.listingId === listing.id)
  const full = listing.signupCount >= listing.capacity

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="grab" />
        <img className="modal-photo" src={listing.photoURL} alt={listing.title} />
        <div className="row between" style={{ marginBottom: 6 }}>
          <span className={'pill ' + sev.pill}>{sev.label} hot spot</span>
          <span className="pill blue">
            {listing.signupCount}/{listing.capacity} joined
          </span>
        </div>
        <h2 style={{ margin: '8px 0 2px', fontSize: 22 }}>{listing.title}</h2>

        <div className="info-row">
          <MapPin size={18} />
          <div>{listing.address}</div>
        </div>
        <div className="info-row">
          <Calendar size={18} />
          <div>
            {fmtDate(listing.eventDate)} · {listing.startTime}–{listing.endTime}
          </div>
        </div>
        <div className="info-row">
          <Clock size={18} />
          <div>
            <span className="row" style={{ gap: 6 }}>
              Est. {listing.estimatedHours} hrs
              <span className="pill gold" style={{ padding: '2px 8px' }}>
                <Sparkles size={11} /> AI
              </span>
            </span>
          </div>
        </div>
        <div className="info-row">
          <Shield size={18} />
          <div>Hosted by {listing.adminName}</div>
        </div>
        <div className="info-row" style={{ borderBottom: 'none' }}>
          <Users size={18} />
          <div className="muted">Earn ~{Math.round(listing.estimatedHours * 50)} points + verified hours</div>
        </div>

        <button
          className={'btn ' + (already ? 'outline' : 'primary')}
          style={{ marginTop: 14 }}
          disabled={already || full}
          onClick={() => {
            signUpForEvent(listing)
            onClose()
          }}
        >
          {already ? 'Already signed up' : full ? 'Event full' : 'Sign up to volunteer'}
        </button>
      </div>
    </div>
  )
}
