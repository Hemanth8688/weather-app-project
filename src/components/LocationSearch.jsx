import { useState, useEffect, useRef, useCallback } from 'react'
import { searchLocations } from '../utils/api'
import styles from './LocationSearch.module.css'

export default function LocationSearch({ onSelect }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const doSearch = useCallback(async (q) => {
    if (!q.trim()) { setResults([]); setOpen(false); return }
    setSearching(true)
    try {
      const data = await searchLocations(q)
      setResults(data)
      setOpen(true)
    } catch {
      setResults([])
    } finally {
      setSearching(false)
    }
  }, [])

  const handleInput = (e) => {
    const v = e.target.value
    setQuery(v)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => doSearch(v), 400)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { clearTimeout(debounceRef.current); doSearch(query) }
    if (e.key === 'Escape') setOpen(false)
  }

  const pick = (item) => {
    const city =
      item.address?.city ||
      item.address?.town ||
      item.address?.village ||
      item.address?.county ||
      item.name ||
      item.display_name.split(',')[0]
    const state = item.address?.state || ''
    const country = item.address?.country || ''
    const name = `${city}${state ? ', ' + state : ''}${country ? ', ' + country : ''}`
    onSelect(
      { lat: parseFloat(item.lat).toFixed(4), lon: parseFloat(item.lon).toFixed(4) },
      name
    )
    setQuery('')
    setOpen(false)
    setResults([])
  }

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <span className={styles.icon}>🔍</span>
      <input
        className={styles.input}
        type="text"
        placeholder="Search city…"
        value={query}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        aria-label="Search location"
      />
      <button
        className={styles.btn}
        disabled={searching || !query.trim()}
        onClick={() => { clearTimeout(debounceRef.current); doSearch(query) }}
      >
        {searching ? '…' : 'Go'}
      </button>

      {open && (
        <div className={styles.dropdown}>
          {results.length === 0 ? (
            <div className={styles.noResult}>No results found</div>
          ) : (
            results.map((item, i) => {
              const city =
                item.address?.city ||
                item.address?.town ||
                item.address?.village ||
                item.address?.county ||
                item.name
              const sub = item.display_name.split(',').slice(1, 3).join(',').trim()
              return (
                <div key={i} className={styles.result} onClick={() => pick(item)}>
                  <strong>{city || item.display_name.split(',')[0]}</strong>
                  <span>{sub}</span>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
