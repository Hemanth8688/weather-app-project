export async function fetchDayData(lat, lon, date) {
  const wUrl = [
    `https://api.open-meteo.com/v1/forecast`,
    `?latitude=${lat}&longitude=${lon}`,
    `&hourly=temperature_2m,relative_humidity_2m,precipitation,visibility,wind_speed_10m`,
    `&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,precipitation_sum,sunrise,sunset,wind_speed_10m_max,uv_index_max,precipitation_probability_max,wind_direction_10m_dominant`,
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m`,
    `&timezone=auto&start_date=${date}&end_date=${date}&wind_speed_unit=kmh`,
  ].join('')

  const aqUrl = [
    `https://air-quality-api.open-meteo.com/v1/air-quality`,
    `?latitude=${lat}&longitude=${lon}`,
    `&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,us_aqi`,
    `&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,us_aqi`,
    `&timezone=auto&start_date=${date}&end_date=${date}`,
  ].join('')

  const [wRes, aqRes] = await Promise.all([fetch(wUrl), fetch(aqUrl)])
  const [weather, airQuality] = await Promise.all([wRes.json(), aqRes.json()])
  return { weather, airQuality }
}

export async function fetchRangeData(lat, lon, startDate, endDate) {
  const wUrl = [
    `https://api.open-meteo.com/v1/forecast`,
    `?latitude=${lat}&longitude=${lon}`,
    `&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum,wind_speed_10m_max,wind_direction_10m_dominant,sunrise,sunset`,
    `&timezone=auto&start_date=${startDate}&end_date=${endDate}&wind_speed_unit=kmh`,
  ].join('')

  const aqUrl = [
    `https://air-quality-api.open-meteo.com/v1/air-quality`,
    `?latitude=${lat}&longitude=${lon}`,
    `&daily=pm10_mean,pm2_5_mean`,
    `&timezone=auto&start_date=${startDate}&end_date=${endDate}`,
  ].join('')

  const [wRes, aqRes] = await Promise.all([fetch(wUrl), fetch(aqUrl)])
  const [weather, airQuality] = await Promise.all([wRes.json(), aqRes.json()])
  return { weather, airQuality }
}

export async function reverseGeocode(lat, lon) {
  const r = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  )
  const d = await r.json()
  const city =
    d.address?.city ||
    d.address?.town ||
    d.address?.village ||
    d.address?.county ||
    'Unknown'
  const state = d.address?.state || ''
  return `${city}${state ? ', ' + state : ''}`
}

export async function searchLocations(query) {
  const r = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`
  )
  return r.json()
}
