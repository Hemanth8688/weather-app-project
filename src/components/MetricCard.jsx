import styles from './MetricCard.module.css'

export default function MetricCard({ icon, label, value, unit, accentColor, valueStyle }) {
  return (
    <div className={styles.card} style={{ '--accent-color': accentColor || 'var(--accent)' }}>
      <span className={styles.icon}>{icon}</span>
      <div className={styles.label}>{label}</div>
      <div className={styles.value} style={valueStyle}>
        {value}
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
    </div>
  )
}
