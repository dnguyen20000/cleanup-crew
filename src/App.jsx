import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useApp } from './context/AppContext.jsx'
import PhoneFrame from './components/PhoneFrame.jsx'
import BottomTabBar from './components/BottomTabBar.jsx'

import SignIn from './screens/auth/SignIn.jsx'
import Home from './screens/volunteer/Home.jsx'
import MapScreen from './screens/volunteer/MapScreen.jsx'
import Calendar from './screens/volunteer/Calendar.jsx'
import Profile from './screens/volunteer/Profile.jsx'
import AdminDashboard from './screens/admin/AdminDashboard.jsx'
import Listings from './screens/admin/Listings.jsx'
import Verify from './screens/admin/Verify.jsx'
import AdminProfile from './screens/admin/AdminProfile.jsx'

function Protected({ children, requireRole }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/" replace />
  if (requireRole && user.role !== requireRole) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/app/home'} replace />
  }
  return children
}

export default function App() {
  const { user } = useApp()
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/app/home'} replace />
          ) : (
            <SignIn />
          )
        }
      />

      {/* Volunteer */}
      <Route
        path="/app/*"
        element={
          <Protected requireRole="volunteer">
            <PhoneFrame tabs={<BottomTabBar admin={false} />}>
              <Routes>
                <Route path="home" element={<Home />} />
                <Route path="map" element={<MapScreen />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="home" replace />} />
              </Routes>
            </PhoneFrame>
          </Protected>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <Protected requireRole="admin">
            <PhoneFrame tabs={<BottomTabBar admin={true} />}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="listings" element={<Listings />} />
                <Route path="verify" element={<Verify />} />
                <Route path="profile" element={<AdminProfile />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </PhoneFrame>
          </Protected>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
