import { NavLink } from 'react-router-dom'
import { Home, Map, Calendar, User, LayoutDashboard, ListPlus } from 'lucide-react'

const VOL_TABS = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/map', label: 'Map', icon: Map },
  { to: '/app/calendar', label: 'Calendar', icon: Calendar },
  { to: '/app/profile', label: 'Profile', icon: User }
]

const ADMIN_TABS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/listings', label: 'Listings', icon: ListPlus },
  { to: '/admin/verify', label: 'Verify', icon: Calendar },
  { to: '/admin/profile', label: 'Profile', icon: User }
]

export default function BottomTabBar({ admin }) {
  const tabs = admin ? ADMIN_TABS : VOL_TABS
  return (
    <nav className="tabbar">
      {tabs.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
          <span className="tab-dot" />
          <Icon size={22} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
