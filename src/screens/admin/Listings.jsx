import { useState } from 'react'
import { Plus, MapPin } from 'lucide-react'
import Header from '../../components/Header.jsx'
import PhotoUpload from '../../components/PhotoUpload.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { SEVERITY } from '../../data/mockData.js'

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1558640476-437a2b9438a2?auto=format&fit=crop&w=600&q=60'

export default function Listings() {
  const { listings, addListing } = useApp()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    title: '',
    address: '',
    severity: 'medium',
    sizeAcres: 1,
    eventDate: '2026-06-18',
    startTime: '09:00',
    endTime: '12:00',
    capacity: 15,
    estimatedHours: 2,
    photoURL: null
  })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const publish = () => {
    addListing({
      ...form,
      estimatedHours: Number(form.estimatedHours),
      capacity: Number(form.capacity),
      photoURL: form.photoURL || PLACEHOLDER
    })
    setOpen(false)
    setForm((f) => ({ ...f, title: '', address: '', photoURL: null }))
  }

  return (
    <>
      <Header
        title="Listings"
        sub="Manage cleanup hot spots"
        right={
          <button className="icon-btn" onClick={() => setOpen((o) => !o)}>
            <Plus size={22} />
          </button>
        }
      />
      <div className="screen">
        {open && (
          <div className="card">
            <strong style={{ fontSize: 17 }}>New hot spot</strong>
            <div className="field" style={{ marginTop: 12 }}>
              <label>Title</label>
              <input
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="e.g. Riverside Trail Cleanup"
              />
            </div>
            <div className="field">
              <label>Address</label>
              <input
                value={form.address}
                onChange={(e) => set('address', e.target.value)}
                placeholder="Street, City, State"
              />
            </div>

            <div className="field">
              <label>Photo of the area</label>
              <PhotoUpload label="" value={form.photoURL} onChange={(d) => set('photoURL', d)} />
            </div>

            <div className="row" style={{ gap: 12 }}>
              <div className="field" style={{ flex: 1 }}>
                <label>Severity</label>
                <select value={form.severity} onChange={(e) => set('severity', e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>Size (acres)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={form.sizeAcres}
                  onChange={(e) => set('sizeAcres', e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Estimated Hours</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={form.estimatedHours}
                onChange={(e) => set('estimatedHours', e.target.value)}
              />
            </div>

            <div className="field">
              <label>Event date</label>
              <input
                type="date"
                value={form.eventDate}
                onChange={(e) => set('eventDate', e.target.value)}
              />
            </div>
            <div className="row" style={{ gap: 12 }}>
              <div className="field" style={{ flex: 1 }}>
                <label>Start</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => set('startTime', e.target.value)}
                />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label>End</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => set('endTime', e.target.value)}
                />
              </div>
              <div className="field" style={{ width: 80 }}>
                <label>Cap</label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => set('capacity', e.target.value)}
                />
              </div>
            </div>

            <button
              className="btn primary"
              style={{ marginTop: 16 }}
              disabled={!form.title || !form.address}
              onClick={publish}
            >
              Publish hot spot
            </button>
          </div>
        )}

        <div className="section-title" style={{ marginTop: open ? 8 : 0 }}>
          {listings.length} active listings
        </div>
        {listings.map((l) => {
          const sev = SEVERITY[l.severity]
          return (
            <div key={l.id} className="listing">
              <img src={l.photoURL} alt={l.title} />
              <div className="body">
                <span className="title">{l.title}</span>
                <div className="addr">
                  <MapPin size={12} style={{ verticalAlign: -1 }} /> {l.address}
                </div>
                <div className="row" style={{ gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                  <span className={'pill ' + sev.pill}>{sev.label}</span>
                  <span className="faint" style={{ fontSize: 12 }}>
                    {l.eventDate} · ~{l.estimatedHours}h
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
