import { useState, useMemo } from 'react'
import { MapPin } from 'lucide-react'
import Header from '../../components/Header.jsx'
import MapView from '../../components/MapView.jsx'
import SlideUpModal from '../../components/SlideUpModal.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { SEVERITY } from '../../data/mockData.js'
import { distanceMiles } from '../../utils/estimateHours.js'

export default function MapScreen() {
  const { user, listings } = useApp()
  const [selected, setSelected] = useState(null)

  // DoorDash-style: sort listings by proximity to the volunteer's home location.
  const sorted = useMemo(
    () =>
      [...listings]
        .map((l) => ({ ...l, dist: distanceMiles(user.homeLocation, l.location) }))
        .sort((a, b) => a.dist - b.dist),
    [listings, user.homeLocation]
  )

  return (
    <>
      <Header title="Hot spots" sub="Nearby cleanups, sorted by distance" />
      <div className="map-wrap">
        <MapView listings={listings} center={user.homeLocation} onSelect={setSelected} />
        <div className="map-legend">
          {Object.entries(SEVERITY).map(([k, v]) => (
            <div className="legend-row" key={k}>
              <span className="dot" style={{ background: v.color }} />
              {v.label}
            </div>
          ))}
        </div>
      </div>

      <div className="screen" style={{ paddingTop: 16 }}>
        <div className="section-title" style={{ marginTop: 0 }}>
          {sorted.length} cleanups near you
        </div>
        {sorted.map((l) => {
          const sev = SEVERITY[l.severity]
          return (
            <div key={l.id} className="listing" onClick={() => setSelected(l)}>
              <img src={l.photoURL} alt={l.title} />
              <div className="body">
                <div className="row between">
                  <span className="title">{l.title}</span>
                </div>
                <div className="addr">
                  <MapPin size={12} style={{ verticalAlign: -1 }} /> {l.address}
                </div>
                <div className="row" style={{ gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className={'pill ' + sev.pill}>{sev.label}</span>
                  <span className="pill blue">{l.dist.toFixed(1)} mi</span>
                  <span className="faint" style={{ fontSize: 12 }}>
                    ~{l.estimatedHours}h
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <SlideUpModal listing={selected} onClose={() => setSelected(null)} />
    </>
  )
}
