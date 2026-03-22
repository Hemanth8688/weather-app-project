import LocationSearch from './LocationSearch'
import styles from './Navbar.module.css'

export default function Navbar({ page, setPage, coords, locationName, onLocationSelect }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>⛅ Atmosphere</div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${page === 1 ? styles.active : ''}`}
          onClick={() => setPage(1)}
        >
          Today &amp; Forecast
        </button>
        <button
          className={`${styles.tab} ${page === 2 ? styles.active : ''}`}
          onClick={() => setPage(2)}
        >
          Historical Analysis
        </button>
      </div>

      <LocationSearch onSelect={onLocationSelect} />

      <div className={styles.location}>
        <span className={styles.pill}>
          <span className={`${styles.dot} ${coords ? styles.dotGreen : styles.dotYellow}`} />
          {locationName}
        </span>
      </div>
    </nav>
  )
}
