export const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 300 },
  plugins: {
    legend: {
      labels: {
        color: '#8aabcc',
        font: { family: 'DM Sans', size: 11 },
        boxWidth: 12,
        padding: 12,
      },
    },
    tooltip: {
      backgroundColor: '#111822',
      borderColor: '#1e2d40',
      borderWidth: 1,
      titleColor: '#e8f4fd',
      bodyColor: '#8aabcc',
      padding: 10,
      titleFont: { family: 'Syne', size: 12 },
      bodyFont: { family: 'DM Sans', size: 11 },
    },
    zoom: {
      pan: { enabled: true, mode: 'x' },
      zoom: {
        wheel: { enabled: true },
        pinch: { enabled: true },
        mode: 'x',
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#4a6a85',
        font: { family: 'DM Sans', size: 10 },
        maxRotation: 45,
      },
      grid: { color: '#1e2d40' },
    },
    y: {
      ticks: {
        color: '#4a6a85',
        font: { family: 'DM Sans', size: 10 },
      },
      grid: { color: '#1e2d40' },
    },
  },
}
