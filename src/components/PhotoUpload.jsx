import { useRef, useState, useEffect } from 'react'
import { Camera } from 'lucide-react'

export default function PhotoUpload({ label, value, onChange }) {
  const ref = useRef(null)
  const [localUrl, setLocalUrl] = useState(null)

  // Clear local preview if the external value updates to match or reset
  useEffect(() => {
    if (value && value !== localUrl) {
      setLocalUrl(null)
    }
  }, [value, localUrl])

  const handle = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX_WIDTH = 600
        const scale = MAX_WIDTH / img.width
        canvas.width = MAX_WIDTH
        canvas.height = img.height * scale
        
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        // Compress the image down to a very small data URL for Firestore
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.6)
        
        setLocalUrl(compressedDataUrl)
        onChange(compressedDataUrl)
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  }

  const displayUrl = localUrl || value

  return (
    <div>
      <div className="ba-label">{label}</div>
      <div className="photo-up" onClick={() => ref.current?.click()}>
        {displayUrl ? (
          <img 
            src={displayUrl} 
            alt={label} 
            style={{ opacity: localUrl && !value ? 0.6 : 1 }} 
          />
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
