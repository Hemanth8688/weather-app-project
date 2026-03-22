import { useState, useEffect, useCallback } from 'react'
import { fetchRangeData } from '../utils/api'
import { today, windDir, windArrow } from '../utils/helpers'
import ChartComp from './ChartComp'
import { chartDefaults } from '../utils/chartConfig'
import styles from './Page2.module.css'

export default function Page2({ coords }) {
  const maxDate = today()
  const twoYearsAgo = (() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() - 2)
    return d.toISOString().split('T')[0]
  })()

  const [start, setStart] = useState(() => {
    const d = new Date()
    d.setMonth(d.getMonth() - 3)
    return d.toISOString().split('T')[0]
  })
  const [end, setEnd] = useState(maxDate)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rangeError, setRangeError] = useState('')

  const validate = useCallback(() => {
    if (!start || !end) return 'Please select both dates.'
    const s = new Date(start), e = new Date(end)
    if (s > e) return 'Start date must be before end date.'
    const diffDays = (e - s) / (1000 * 60 * 60 * 24)
    if (diffDays > 730) return 'Maximum range is 2 years (730 days).'
    return ''
  }, [start, end])

  const load = useCallback(async () => {
    if (!coords) return
    const err = validate()
    if (err) { setRangeError(err); return }
    setRangeError('')
    setLoading(true)
    setError('')
    try {
      const result = await fetchRangeData(coords.lat, coords.lon, start, end)
      setData(result)
    } catch (e) {
      setError('Failed to fetch data. ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [coords, start, end, validate])

  useEffect(() => { if (coords) load() }, [coords])

  const w = data?.weather?.daily
  const aq = data?.airQuality?.daily
  const labels = w?.time || []

  // Thin out labels for dense datasets
  const thinLabels = labels.map((l, i) => {
    if (labels.length > 90) return i % 7 === 0 ? l : ''
    if (labels.length > 30) return i % 3 === 0 ? l : ''
    return l
  })

  const chartH = 240

  return (
    <div className={styles.main}>
      {/* Range bar */}
      <div className={styles.rangeBar}>
        <span className={styles.label}>FROM</span>
        <input
          type="date"
          className={styles.dateInput}
          value={start}
          min={twoYearsAgo}
          max={end}
          onChange={e => setStart(e.target.value)}
        />
        <span className={styles.sep}>→</span>
        <input
          type="date"
          className={styles.dateInput}
          value={end}
          min={start}
          max={maxDate}
          onChange={e => setEnd(e.target.value)}
        />
        <button className={styles.applyBtn} onClick={load} disabled={loading}>
          {loading ? 'Loading…' : 'Apply Range'}
        </button>
        {rangeError && <span className={styles.rangeError}>⚠ {rangeError}</span>}
      </div>

      {loading && (
        <div className={styles.loader}>
          <div className={styles.ring} />
          <span className={styles.loaderText}>Loading historical data…</span>
        </div>
      )}
      {error && <div className={styles.errorCard}>⚠ {error}</div>}

      {!loading && data && (
        <div className={styles.chartsSection}>
          <div className={styles.sectionTitle}>
            Historical Analysis · {labels.length} days · {start} → {end}
          </div>

          {/* Temperature */}
          <div className={styles.chartWrapper}>
            <div className={styles.chartTitle}>🌡 Temperature — Mean, Max &amp; Min</div>
            <div className={styles.chartSubtitle}>Daily temperature range over selected period</div>
            <ChartComp type="line" height={chartH} data={{
              labels: thinLabels,
              datasets: [
                { label: 'Mean (°C)', data: w?.temperature_2m_mean, borderColor: '#38b6ff', borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
                { label: 'Max (°C)', data: w?.temperature_2m_max, borderColor: '#f97316', borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
                { label: 'Min (°C)', data: w?.temperature_2m_min, borderColor: '#7dd3fc', borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
              ]
            }} />
            <div className={styles.zoomHint}>🖱 Scroll to zoom · Drag to pan</div>
          </div>

          {/* Sunrise / Sunset */}
          <div className={styles.chartWrapper}>
            <div className={styles.chartTitle}>🌅 Sunrise &amp; Sunset Times (IST)</div>
            <div className={styles.chartSubtitle}>Time displayed as minutes from midnight IST</div>
            <ChartComp type="line" height={chartH} data={{
              labels: thinLabels,
              datasets: [
                {
                  label: 'Sunrise (IST)',
                  data: w?.sunrise?.map(s => {
                    try {
                      const d = new Date(s)
                      const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000)
                      return ist.getUTCHours() * 60 + ist.getUTCMinutes()
                    } catch { return null }
                  }),
                  borderColor: '#fbbf24', borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false
                },
                {
                  label: 'Sunset (IST)',
                  data: w?.sunset?.map(s => {
                    try {
                      const d = new Date(s)
                      const ist = new Date(d.getTime() + 5.5 * 60 * 60 * 1000)
                      return ist.getUTCHours() * 60 + ist.getUTCMinutes()
                    } catch { return null }
                  }),
                  borderColor: '#f97316', borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false
                }
              ]
            }} options={{
              scales: {
                y: {
                  ticks: {
                    callback: v =>
                      `${Math.floor(v / 60).toString().padStart(2, '0')}:${(v % 60).toString().padStart(2, '0')}`
                  }
                }
              }
            }} />
            <div className={styles.zoomHint}>🖱 Scroll to zoom · Drag to pan</div>
          </div>

          {/* Precipitation */}
          <div className={styles.chartWrapper}>
            <div className={styles.chartTitle}>🌧 Daily Precipitation</div>
            <div className={styles.chartSubtitle}>Total precipitation in mm per day</div>
            <ChartComp type="bar" height={chartH} data={{
              labels: thinLabels,
              datasets: [{
                label: 'Precipitation (mm)',
                data: w?.precipitation_sum,
                backgroundColor: 'rgba(96,165,250,0.65)',
                borderColor: '#60a5fa',
                borderWidth: 1,
                borderRadius: 2,
              }]
            }} />
            <div className={styles.zoomHint}>🖱 Scroll to zoom · Drag to pan</div>
          </div>

          {/* Wind */}
          <div className={styles.chartWrapper}>
            <div className={styles.chartTitle}>💨 Max Wind Speed &amp; Dominant Direction</div>
            <div className={styles.chartSubtitle}>Daily max wind speed (km/h) — hover for direction</div>
            <ChartComp type="bar" height={chartH} data={{
              labels: thinLabels,
              datasets: [{
                label: 'Max Wind Speed (km/h)',
                data: w?.wind_speed_10m_max,
                backgroundColor: 'rgba(167,139,250,0.65)',
                borderColor: '#a78bfa',
                borderWidth: 1,
                borderRadius: 2,
              }]
            }} options={{
              plugins: {
                tooltip: {
                  ...chartDefaults.plugins.tooltip,
                  callbacks: {
                    afterLabel: (ctx) => {
                      const deg = w?.wind_direction_10m_dominant?.[ctx.dataIndex]
                      return deg != null
                        ? `Direction: ${windDir(deg)} ${windArrow(deg)} (${deg}°)`
                        : ''
                    }
                  }
                }
              }
            }} />
            <div className={styles.zoomHint}>🖱 Scroll to zoom · Drag to pan · Hover for wind direction</div>
          </div>

          {/* Air Quality */}
          <div className={styles.chartWrapper}>
            <div className={styles.chartTitle}>🌫 Air Quality — PM10 &amp; PM2.5</div>
            <div className={styles.chartSubtitle}>Daily mean particulate matter μg/m³</div>
            <ChartComp type="line" height={chartH} data={{
              labels: thinLabels,
              datasets: [
                { label: 'PM10 (μg/m³)', data: aq?.pm10_mean, borderColor: '#f97316', borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
                { label: 'PM2.5 (μg/m³)', data: aq?.pm2_5_mean, borderColor: '#ef4444', borderWidth: 1.5, pointRadius: 0, tension: 0.3, fill: false },
              ]
            }} />
            <div className={styles.zoomHint}>🖱 Scroll to zoom · Drag to pan</div>
          </div>
        </div>
      )}
    </div>
  )
}
