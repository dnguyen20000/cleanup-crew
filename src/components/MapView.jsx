import { MapContainer, TileLayer, CircleMarker, Popup, Tooltip } from 'react-leaflet'
import { SEVERITY } from '../data/mockData.js'

export default function MapView({ listings, center, onSelect }) {
  const c = center || { lat: 33.9304, lng: -84.3733 }
  return (
    <MapContainer center={[c.lat, c.lng]} zoom={12} scrollWheelZoom={true} zoomControl={false}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap &copy; CARTO'
      />
      {listings.map((l) => {
        const sev = SEVERITY[l.severity]
        const radius = l.severity === 'high' ? 26 : l.severity === 'medium' ? 20 : 15
        return (
          <CircleMarker
            key={l.id}
            center={[l.location.lat, l.location.lng]}
            radius={radius}
            pathOptions={{
              color: sev.color,
              fillColor: sev.color,
              fillOpacity: 0.35,
              weight: 2
            }}
            eventHandlers={{ click: () => onSelect && onSelect(l) }}
          >
            <Tooltip direction="top" offset={[0, -6]} opacity={1}>
              <strong>{sev.label}</strong>
            </Tooltip>
            <Popup>
              <strong>{l.title}</strong>
              <br />
              {l.signupCount}/{l.capacity} volunteers
            </Popup>
          </CircleMarker>
        )
      })}
    </MapContainer>
  )
}
