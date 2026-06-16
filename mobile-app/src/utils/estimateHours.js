// Lightweight "AI-assisted" estimate. Severity × area heuristic, labeled as AI.
export function estimateHours(severity, sizeAcres = 1) {
  const base = { low: 1, medium: 2, high: 3.5 }[severity] || 2
  return Math.round((base * Math.max(0.5, sizeAcres)) * 2) / 2
}

// Haversine distance in miles, for proximity sorting (DoorDash-style).
export function distanceMiles(a, b) {
  if (!a || !b) return Infinity
  const R = 3958.8
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2)
  return R * 2 * Math.asin(Math.sqrt(h))
}
