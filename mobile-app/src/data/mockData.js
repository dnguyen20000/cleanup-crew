// Atlanta-area cleanup hot spots (matches the Sandy Springs / Buckhead screenshots)
// Photos use Unsplash source URLs so they load without any API key.

const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=60`

export const RANKS = [
  { name: 'Seedling', emoji: '🌱', min: 0 },
  { name: 'Sprout', emoji: '🌿', min: 100 },
  { name: 'Sapling', emoji: '🪴', min: 300 },
  { name: 'Guardian', emoji: '🌳', min: 600 },
  { name: 'Eco Hero', emoji: '🏆', min: 1000 }
]

export function rankFor(points) {
  let r = RANKS[0]
  for (const rank of RANKS) if (points >= rank.min) r = rank
  return r
}

export function nextRank(points) {
  return RANKS.find((r) => r.min > points) || null
}

export const MOCK_USER = {
  uid: 'u1',
  name: 'Ryleigh J',
  hometown: 'Sandy Springs, GA',
  email: 'ryleigh@ripple.app',
  role: 'volunteer',
  points: 420,
  totalHours: 18.5,
  cleanups: 12,
  lbsCollected: 184,
  team: 'Peachtree Pickers',
  homeLocation: { lat: 33.9304, lng: -84.3733 }
}

export const MOCK_LISTINGS = [
  {
    id: 'l1',
    title: 'Chattahoochee Riverbank Cleanup',
    address: '200 Riverside Dr, Sandy Springs, GA',
    location: { lat: 33.9412, lng: -84.3899 },
    photoURL: img('photo-1532996122724-e3c354a0b15b'),
    estimatedHours: 3,
    severity: 'high',
    eventDate: '2026-06-14',
    startTime: '09:00',
    endTime: '12:00',
    adminId: 'a1',
    adminName: 'Marcus T (Admin)',
    capacity: 20,
    signupCount: 14,
    status: 'open'
  },
  {
    id: 'l2',
    title: 'Brookhaven Park Trail Sweep',
    address: '4158 Peachtree Rd, Brookhaven, GA',
    location: { lat: 33.8651, lng: -84.3366 },
    photoURL: img('photo-1542601906990-b4d3fb778b09'),
    estimatedHours: 2,
    severity: 'medium',
    eventDate: '2026-06-14',
    startTime: '14:00',
    endTime: '16:00',
    adminId: 'a1',
    adminName: 'Marcus T (Admin)',
    capacity: 15,
    signupCount: 6,
    status: 'open'
  },
  {
    id: 'l3',
    title: 'Buckhead Underpass Litter Drive',
    address: '3344 Peachtree Rd NE, Atlanta, GA',
    location: { lat: 33.8484, lng: -84.3654 },
    photoURL: img('photo-1611284446314-60a58ac0deb9'),
    estimatedHours: 4,
    severity: 'high',
    eventDate: '2026-06-15',
    startTime: '08:00',
    endTime: '12:00',
    adminId: 'a2',
    adminName: 'Dana W (Admin)',
    capacity: 25,
    signupCount: 19,
    status: 'open'
  },
  {
    id: 'l4',
    title: 'Dunwoody Nature Center Tidy',
    address: '5343 Roberts Dr, Dunwoody, GA',
    location: { lat: 33.9462, lng: -84.3158 },
    photoURL: img('photo-1466611653911-95081537e5b7'),
    estimatedHours: 1.5,
    severity: 'low',
    eventDate: '2026-06-16',
    startTime: '10:00',
    endTime: '11:30',
    adminId: 'a1',
    adminName: 'Marcus T (Admin)',
    capacity: 12,
    signupCount: 3,
    status: 'open'
  },
  {
    id: 'l5',
    title: 'Chamblee Rail Trail Pickup',
    address: '5486 Peachtree Rd, Chamblee, GA',
    location: { lat: 33.8918, lng: -84.2988 },
    photoURL: img('photo-1530587191325-3db32d826c18'),
    estimatedHours: 2.5,
    severity: 'medium',
    eventDate: '2026-06-17',
    startTime: '16:00',
    endTime: '18:30',
    adminId: 'a2',
    adminName: 'Dana W (Admin)',
    capacity: 18,
    signupCount: 9,
    status: 'open'
  }
]

export const MOCK_LEADERBOARD = [
  { name: 'Peachtree Pickers', points: 4820, members: 12 },
  { name: 'River Keepers', points: 4310, members: 9 },
  { name: 'Buckhead Brigade', points: 3990, members: 15 },
  { name: 'Dunwoody Defenders', points: 2750, members: 7 }
]

export const SEVERITY = {
  high: { color: '#ef3b2d', label: 'Very busy', pill: 'red' },
  medium: { color: '#f0762b', label: 'Busy', pill: 'orange' },
  low: { color: '#2fae7a', label: 'Light', pill: 'green' }
}
