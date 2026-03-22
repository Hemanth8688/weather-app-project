import { useState, useEffect, useCallback } from 'react'
import { fetchDayData } from '../utils/api'
import { fmt, today, toIST, celsiusToF, aqiLevel, uvLevel, weatherIcon } from '../utils/helpers'
import MetricCard from './MetricCard'
import ChartComp from './ChartComp'
import styles from './Page1.module.css'

export default function Page1({ coords, locationName }) {
  const [date, setDate] = useState(today())
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isCelsius, setIsCelsius] = useState(true)

  const load = useCallback(async () => {
    if (!coords) return
    setLoading(true)
    setError('')
    try {
      const result = await fetchDayData(coords.lat, coords.lon, date)
      setData(result)
    } catch (e) {
      setError('Failed to fetch weather data. ' + e.message)
    } finally {
      setLoading(false)
    }
  }, [coords, date])

  useEffect(() => { load() }, [load])

  const t = (v) => isCelsius ? fmt(v) : fmt(celsiusToF(v))
  const tUnit = isCelsius ? '°C' : '°F'

  const w = data?.weather
  const aq = data?.airQuality
  const daily = w?.daily
  const current = w?.current
  const hourly = w?.hourly
  const aqHourly = aq?.hourly
  const aqCurrent = aq?.current

  const nowHour = new Date().getHours()
  const currentTemp = current?.temperature_2m ?? hourly?.temperature_2m?.[nowHour]
  const currentHumidity = current?.relative_humidity_2m ?? hourly?.relative_humidity_2m?.[nowHour]
  const aqi = aqCurrent?.us_aqi
  const aqiInfo = aqiLevel(aqi)
  const uvMax = daily?.uv_index_max?.[0]
  const uvInfo = uvLevel(uvMax)
  const hours = hourly?.time?.map(t => t.split('T')[1]?.substring(0, 5) || t) || []
  const aqHours = aqHourly?.time?.map(t => t.split('T')[1]?.substring(0, 5) || t) || hours

  return (
    <div className={styles.main}>
      {/* Date bar */}
      <div className={styles.dateBar}>
        <span className={styles.dateLabel}>DATE</span>
        <input
          type="date"
          className={styles.dateInput}
          value={date}
          max={today()}
          onChange={e => setDate(e.target.value)}
        />
        <button className={styles.todayBtn} onClick={() => setDate(today())}>Today</button>
        <div style={{ marginLeft: 'auto' }}>
          <div className={styles.tempToggle}>
            <button className={isCelsius ? styles.active : ''} onClick={() => setIsCelsius(true)}>°C</button>
            <button className={!isCelsius ? styles.active : ''} onClick={() => setIsCelsius(false)}>°F</button>
          </div>
        </div>
      </div>

      {loading && (
        <div className={styles.loader}>
          <div className={styles.ring} />
          <span className={styles.loaderText}>Fetching weather data…</span>
        </div>
      )}
      {error && <div className={styles.errorCard}>⚠ {error}</div>}

      {!loading && data && (
        <>
          {/* Hero card */}
          <div className={styles.heroCard}>
            <div>
              <div className={styles.heroTemp}>
                {t(currentTemp)}<span>{tUnit}</span>
              </div>
              <div className={styles.heroLocation}>📍 {locationName}</div>
              <div className={styles.heroDate}>
                {new Date(date + 'T12:00:00').toLocaleDateString('en-IN', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </div>
              <div className={styles.heroMinmax}>
                <div className={styles.heroMm}>Min <strong>{t(daily?.temperature_2m_min?.[0])}{tUnit}</strong></div>
                <div className={styles.heroMm}>Max <strong>{t(daily?.temperature_2m_max?.[0])}{tUnit}</strong></div>
                {aqi != null && (
                  <div className={styles.heroMm}>
                    AQI <strong style={{ color: aqiInfo.color }}>{aqi} — {aqiInfo.label}</strong>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.heroRight}>
              <div className={styles.weatherIcon}>
                {weatherIcon(daily?.precipitation_sum?.[0], uvMax)}
              </div>
            </div>
          </div>

          {/* Weather metrics */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Weather Conditions</div>
            <div className={styles.metricsGrid}>
              <MetricCard icon="🌡️" label="Current Temp" value={t(currentTemp)} unit={tUnit} accentColor="var(--accent)" />
              <MetricCard icon="🔻" label="Min Temp" value={t(daily?.temperature_2m_min?.[0])} unit={tUnit} accentColor="#38b6ff" />
              <MetricCard icon="🔺" label="Max Temp" value={t(daily?.temperature_2m_max?.[0])} unit={tUnit} accentColor="#f97316" />
              <MetricCard icon="💧" label="Precipitation" value={fmt(daily?.precipitation_sum?.[0])} unit="mm" accentColor="#60a5fa" />
              <MetricCard icon="💦" label="Humidity" value={fmt(currentHumidity, 0)} unit="%" accentColor="#7dd3fc" />
              <MetricCard
                icon="☀️"
                label="UV Index"
                value={fmt(uvMax, 1)}
                unit={uvInfo.label}
                accentColor={uvInfo.color}
                valueStyle={{ fontSize: '20px' }}
              />
              <MetricCard icon="🌅" label="Sunrise" value={toIST(daily?.sunrise?.[0])} accentColor="#fbbf24" valueStyle={{ fontSize: '16px' }} />
              <MetricCard icon="🌇" label="Sunset" value={toIST(daily?.sunset?.[0])} accentColor="#f97316" valueStyle={{ fontSize: '16px' }} />
              <MetricCard icon="💨" label="Max Wind" value={fmt(daily?.wind_speed_10m_max?.[0])} unit="km/h" accentColor="#a78bfa" />
              <MetricCard icon="🌧" label="Precip. Prob." value={fmt(daily?.precipitation_probability_max?.[0], 0)} unit="%" accentColor="#34d399" />
            </div>
          </div>

          {/* Air quality */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Air Quality</div>
            <div className={styles.aqiGrid}>
              <div className={styles.aqiCard}>
                <div className={styles.aqiLabel}>AQI (US)</div>
                <div className={styles.aqiValue} style={{ color: aqiInfo.color }}>{aqi ?? '—'}</div>
                <span className={styles.aqiBadge} style={{ background: aqiInfo.color + '22', color: aqiInfo.color }}>{aqiInfo.label}</span>
              </div>
              <div className={styles.aqiCard}>
                <div className={styles.aqiLabel}>PM10</div>
                <div className={styles.aqiValue}>{fmt(aqCurrent?.pm10)}</div>
                <div className={styles.aqiUnit}>μg/m³</div>
              </div>
              <div className={styles.aqiCard}>
                <div className={styles.aqiLabel}>PM2.5</div>
                <div className={styles.aqiValue}>{fmt(aqCurrent?.pm2_5)}</div>
                <div className={styles.aqiUnit}>μg/m³</div>
              </div>
              <div className={styles.aqiCard}>
                <div className={styles.aqiLabel}>CO</div>
                <div className={styles.aqiValue}>{fmt(aqCurrent?.carbon_monoxide, 0)}</div>
                <div className={styles.aqiUnit}>μg/m³</div>
              </div>
              <div className={styles.aqiCard}>
                <div className={styles.aqiLabel}>CO₂</div>
                <div className={styles.aqiValue}>~415</div>
                <div className={styles.aqiUnit}>ppm (est.)</div>
              </div>
              <div className={styles.aqiCard}>
                <div className={styles.aqiLabel}>NO₂</div>
                <div className={styles.aqiValue}>{fmt(aqCurrent?.nitrogen_dioxide)}</div>
                <div className={styles.aqiUnit}>μg/m³</div>
              </div>
              <div className={styles.aqiCard}>
                <div className={styles.aqiLabel}>SO₂</div>
                <div className={styles.aqiValue}>{fmt(aqCurrent?.sulphur_dioxide)}</div>
                <div className={styles.aqiUnit}>μg/m³</div>
              </div>
            </div>
          </div>

          {/* Hourly Charts */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Hourly Forecast</div>

            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>🌡 Temperature</div>
              <div className={styles.chartSubtitle}>Hourly temperature variation · {isCelsius ? 'Celsius' : 'Fahrenheit'}</div>
              <ChartComp type="line" height={220} data={{
                labels: hours,
                datasets: [{
                  label: `Temp (${tUnit})`,
                  data: hourly?.temperature_2m?.map(v => isCelsius ? v : celsiusToF(v)),
                  borderColor: '#38b6ff',
                  backgroundColor: 'rgba(56,182,255,0.08)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 3,
                  pointHoverRadius: 6,
                }]
              }} />
              <div className={styles.zoomHint}>🖱 Scroll to zoom · Drag to pan</div>
            </div>

            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>💦 Relative Humidity</div>
              <div className={styles.chartSubtitle}>Hourly humidity %</div>
              <ChartComp type="line" height={220} data={{
                labels: hours,
                datasets: [{
                  label: 'Humidity (%)',
                  data: hourly?.relative_humidity_2m,
                  borderColor: '#7dd3fc',
                  backgroundColor: 'rgba(125,211,252,0.08)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 3,
                }]
              }} options={{ scales: { y: { min: 0, max: 100 } } }} />
              <div className={styles.zoomHint}>🖱 Scroll to zoom · Drag to pan</div>
            </div>

            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>🌧 Precipitation</div>
              <div className={styles.chartSubtitle}>Hourly precipitation in mm</div>
              <ChartComp type="bar" height={220} data={{
                labels: hours,
                datasets: [{
                  label: 'Precipitation (mm)',
                  data: hourly?.precipitation,
                  backgroundColor: 'rgba(96,165,250,0.7)',
                  borderColor: '#60a5fa',
                  borderWidth: 1,
                  borderRadius: 4,
                }]
              }} />
              <div className={styles.zoomHint}>🖱 Scroll to zoom · Drag to pan</div>
            </div>

            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>👁 Visibility</div>
              <div className={styles.chartSubtitle}>Hourly visibility in meters</div>
              <ChartComp type="line" height={220} data={{
                labels: hours,
                datasets: [{
                  label: 'Visibility (m)',
                  data: hourly?.visibility,
                  borderColor: '#34d399',
                  backgroundColor: 'rgba(52,211,153,0.08)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 3,
                }]
              }} />
              <div className={styles.zoomHint}>🖱 Scroll to zoom · Drag to pan</div>
            </div>

            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>💨 Wind Speed (10m)</div>
              <div className={styles.chartSubtitle}>Hourly wind speed in km/h</div>
              <ChartComp type="line" height={220} data={{
                labels: hours,
                datasets: [{
                  label: 'Wind Speed (km/h)',
                  data: hourly?.wind_speed_10m,
                  borderColor: '#a78bfa',
                  backgroundColor: 'rgba(167,139,250,0.08)',
                  borderWidth: 2,
                  fill: true,
                  tension: 0.3,
                  pointRadius: 3,
                }]
              }} />
              <div className={styles.zoomHint}>🖱 Scroll to zoom · Drag to pan</div>
            </div>

            <div className={styles.chartWrapper}>
              <div className={styles.chartTitle}>🌫 Particulate Matter — PM10 & PM2.5</div>
              <div className={styles.chartSubtitle}>Hourly air quality particulates in μg/m³</div>
              <ChartComp type="line" height={220} data={{
                labels: aqHours,
                datasets: [
                  {
                    label: 'PM10 (μg/m³)',
                    data: aqHourly?.pm10,
                    borderColor: '#f97316',
                    backgroundColor: 'rgba(249,115,22,0.08)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 3,
                  },
                  {
                    label: 'PM2.5 (μg/m³)',
                    data: aqHourly?.pm2_5,
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239,68,68,0.08)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 3,
                  }
                ]
              }} />
              <div className={styles.zoomHint}>🖱 Scroll to zoom · Drag to pan</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
