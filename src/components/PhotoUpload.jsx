import { useRef } from 'react'
import { Camera } from 'lucide-react'

export default function PhotoUpload({ label, value, onChange }) {
  const ref = useRef(null)

  const handle = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div className="ba-label">{label}</div>
      <div className="photo-up" onClick={() => ref.current?.click()}>
        {value ? (
          <img src={value} alt={label} />
        ) : (
          <>
            <Camera size={26} />
            <span>Tap to add photo</span>
          </>
        )}
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        onChange={handle}
      />
    </div>
  )
}
