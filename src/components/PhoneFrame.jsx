import { useApp } from '../context/AppContext.jsx'

export default function PhoneFrame({ children, tabs }) {
  const { toast } = useApp()
  return (
    <div className="phone">
      <div className={'phone-body' + (tabs ? '' : ' no-tabs')}>{children}</div>
      {tabs}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
