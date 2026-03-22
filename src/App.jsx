import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Page1 from './components/Page1'
import Page2 from './components/Page2'
import { reverseGeocode } from './utils/api'

export default function App() {
  const [page, setPage] = useState(1)
  const [coords, setCoords] = useState(null)
  const [locationName, setLocationName] = useState('Detecting location…')
  const [gpsError, setGpsError] = useState('')

  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation not supported.')
      setCoords({ lat: 28.6139, lon: 77.2090 })
      setLocationName('New Delhi (default)')
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(4)
        const lon = pos.coords.longitude.toFixed(4)
        setCoords({ lat, lon })
        try {
          const name = await reverseGeocode(lat, lon)
          setLocationName(name)
        } catch {
          setLocationName(`${lat}, ${lon}`)
        }
      },
      () => {
        setGpsError('Location access denied. Using default location.')
        setCoords({ lat: 28.6139, lon: 77.2090 })
        setLocationName('New Delhi (default)')
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [])

  const handleLocationSelect = (newCoords, name) => {
    setCoords(newCoords)
    setLocationName(name)
    setGpsError('')
  }

  return (
    <>
      <Navbar
        page={page}
        setPage={setPage}
        coords={coords}
        locationName={locationName}
        onLocationSelect={handleLocationSelect}
      />

      {gpsError && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '12px 16px 0' }}>
          <div style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 14,
            padding: '12px 18px',
            color: '#fca5a5',
            fontSize: 13
          }}>
            ℹ {gpsError}
          </div>
        </div>
      )}

      {page === 1 && <Page1 coords={coords} locationName={locationName} />}
      {page === 2 && <Page2 coords={coords} locationName={locationName} />}
    </>
  )
}
