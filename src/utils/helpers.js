export const fmt = (v, d = 1) => (v == null ? '—' : Number(v).toFixed(d))

export const today = () => new Date().toISOString().split('T')[0]

export const toIST = (utcStr) => {
  if (!utcStr) return '—'
  try {
    const d = new Date(utcStr)
    return d.toLocaleTimeString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  } catch {
    return utcStr
  }
}

export const celsiusToF = (c) => (c == null ? null : c * 9 / 5 + 32)

export const windDir = (deg) => {
  if (deg == null) return '—'
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

export const windArrow = (deg) => {
  if (deg == null) return '→'
  const arrows = ['↑', '↗', '→', '↘', '↓', '↙', '←', '↖']
  return arrows[Math.round(deg / 45) % 8]
}

export const aqiLevel = (us_aqi) => {
  if (us_aqi == null) return { label: '—', color: '#8aabcc' }
  if (us_aqi <= 50) return { label: 'Good', color: '#22c55e' }
  if (us_aqi <= 100) return { label: 'Moderate', color: '#eab308' }
  if (us_aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: '#f97316' }
  if (us_aqi <= 200) return { label: 'Unhealthy', color: '#ef4444' }
  if (us_aqi <= 300) return { label: 'Very Unhealthy', color: '#a855f7' }
  return { label: 'Hazardous', color: '#7f1d1d' }
}

export const uvLevel = (uv) => {
  if (uv == null) return { label: '—', color: '#8aabcc' }
  if (uv <= 2) return { label: 'Low', color: '#22c55e' }
  if (uv <= 5) return { label: 'Moderate', color: '#eab308' }
  if (uv <= 7) return { label: 'High', color: '#f97316' }
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' }
  return { label: 'Extreme', color: '#a855f7' }
}

export const weatherIcon = (precipitation, uvMax) => {
  if (precipitation > 5) return '🌧'
  if (uvMax > 7) return '☀️'
  return '🌤'
}
