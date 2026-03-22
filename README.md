# ⛅ Atmosphere — Weather Intelligence

A fully responsive React weather app powered by the [Open-Meteo API](https://open-meteo.com) — no API key required.

## Features

### Page 1 — Today & Forecast
- Auto-detects browser GPS on load; falls back to New Delhi if denied
- **City search** in the navbar (powered by Nominatim geocoding)
- Date picker to view any past/current date
- °C / °F temperature toggle
- **10 weather metric cards**: Current/Min/Max Temp, Precipitation, Humidity, UV Index, Sunrise/Sunset (IST), Max Wind, Precip Probability
- **7 Air Quality cards**: AQI (US), PM10, PM2.5, CO, CO₂, NO₂, SO₂
- **6 interactive hourly charts**:
  - Temperature (line)
  - Relative Humidity (line)
  - Precipitation (bar)
  - Visibility (line)
  - Wind Speed 10m (line)
  - PM10 & PM2.5 combined (line)

### Page 2 — Historical Analysis (up to 2 years)
- Date range selector with 2-year max enforcement
- **5 historical charts**:
  - Temperature Mean/Max/Min (line)
  - Sunrise & Sunset in IST (line, time axis)
  - Precipitation (bar)
  - Max Wind Speed + hover tooltip for dominant direction (bar)
  - PM10 & PM2.5 trends (line)

### Chart Features
- Scroll-to-zoom (mouse wheel + pinch on mobile)
- Drag to pan horizontally
- Responsive — works on all screen sizes

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Install & Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

### Build for Production

```bash
npm run build
npm run preview
```

---

## Project Structure

```
src/
├── main.jsx                  # React entry point
├── App.jsx                   # Root component, GPS & location state
├── index.css                 # Global CSS variables & body styles
├── components/
│   ├── Navbar.jsx            # Top navigation with tabs & search
│   ├── Navbar.module.css
│   ├── LocationSearch.jsx    # City search with debounce + dropdown
│   ├── LocationSearch.module.css
│   ├── Page1.jsx             # Today & Forecast page
│   ├── Page1.module.css
│   ├── Page2.jsx             # Historical Analysis page
│   ├── Page2.module.css
│   ├── MetricCard.jsx        # Reusable metric display card
│   ├── MetricCard.module.css
│   ├── ChartComp.jsx         # Reusable Chart.js wrapper
│   └── ChartComp.module.css
└── utils/
    ├── api.js                # Open-Meteo & Nominatim API calls
    ├── helpers.js            # Formatting, conversion utilities
    └── chartConfig.js        # Shared Chart.js defaults
```

---

## Data Sources
- **Weather**: [Open-Meteo Forecast API](https://api.open-meteo.com)
- **Air Quality**: [Open-Meteo Air Quality API](https://air-quality-api.open-meteo.com)
- **Geocoding**: [Nominatim / OpenStreetMap](https://nominatim.openstreetmap.org)

All APIs are free and require no API key.
