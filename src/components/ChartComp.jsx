import { useEffect, useRef } from 'react'
import {
  Chart,
  LineController, BarController,
  LineElement, BarElement,
  PointElement, ArcElement,
  CategoryScale, LinearScale,
  Filler, Legend, Tooltip,
} from 'chart.js'
import ChartZoom from 'chartjs-plugin-zoom'
import { chartDefaults } from '../utils/chartConfig'
import styles from './ChartComp.module.css'

Chart.register(
  LineController, BarController,
  LineElement, BarElement,
  PointElement, ArcElement,
  CategoryScale, LinearScale,
  Filler, Legend, Tooltip,
  ChartZoom
)

export default function ChartComp({ type, data, options = {}, height = 220 }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    const merged = {
      ...chartDefaults,
      ...options,
      plugins: {
        ...chartDefaults.plugins,
        ...(options.plugins || {}),
        zoom: chartDefaults.plugins.zoom,
        tooltip: chartDefaults.plugins.tooltip,
        legend: {
          ...chartDefaults.plugins.legend,
          ...(options.plugins?.legend || {}),
        },
      },
      scales: {
        x: { ...chartDefaults.scales.x, ...(options.scales?.x || {}) },
        y: { ...chartDefaults.scales.y, ...(options.scales?.y || {}) },
        ...(options.scales?.y1
          ? { y1: { ...chartDefaults.scales.y, ...options.scales.y1 } }
          : {}),
      },
    }

    chartRef.current = new Chart(canvasRef.current, { type, data, options: merged })
    return () => { if (chartRef.current) chartRef.current.destroy() }
  }, [type, data, options])

  return (
    <div className={styles.scroll}>
      <div className={styles.inner} style={{ height }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
