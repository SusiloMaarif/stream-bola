'use client'

import { useState, useEffect, useCallback } from 'react'
import MatchCard from '@/components/MatchCard'
import StreamPlayer from '@/components/StreamPlayer'

const API_BASE = 'https://api.sportsrc.org'

export default function Home() {
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeMatch, setActiveMatch] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`${API_BASE}/?data=matches&category=football`)
      const data = await res.json()
      
      if (data.success && data.data) {
        const now = Date.now()
        const sorted = data.data
          .filter(m => m.date > now - 7200000)
          .sort((a, b) => a.date - b.date)
        setMatches(sorted)
      }
    } catch (e) {
      setError('Gagal mengambil jadwal pertandingan')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMatches()
    const interval = setInterval(fetchMatches, 60000)
    return () => clearInterval(interval)
  }, [fetchMatches])

  const openMatch = async (match) => {
    try {
      const res = await fetch(`${API_BASE}/?data=detail&category=football&id=${match.id}`)
      const data = await res.json()
      if (data.success && data.data) {
        setActiveMatch(data.data)
        setSelectedSource(data.data.sources?.[0] || null)
      }
    } catch (e) {
      setError('Gagal memuat detail stream')
    }
  }

  const closeMatch = () => {
    setActiveMatch(null)
    setSelectedSource(null)
  }

  const filteredMatches = matches.filter(m => {
    if (search) {
      const q = search.toLowerCase()
      const home = m.teams?.home?.name || ''
      const away = m.teams?.away?.name || ''
      if (!home.toLowerCase().includes(q) && !away.toLowerCase().includes(q) && !m.title.toLowerCase().includes(q)) return false
    }
    if (filter === 'live') return m.date <= Date.now() && m.date > Date.now() - 7200000
    if (filter === 'today') {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return m.date >= today.getTime()
    }
    return true
  })

  const formatDate = (timestamp) => {
    const d = new Date(timestamp)
    const now = new Date()
    const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
    const isToday = d.toDateString() === now.toDateString()
    const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === d.toDateString()
    
    if (d.getTime() <= now.getTime() && d.getTime() > now.getTime() - 7200000) return `🔴 LIVE • ${time}`
    if (isToday) return `📍 Hari Ini • ${time} WIB`
    if (isTomorrow) return `📍 Besok • ${time} WIB`
    return `${d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })} • ${time} WIB`
  }

  const isLive = (match) => match.date <= Date.now() && match.date > Date.now() - 7200000

  if (activeMatch) {
    return (
      <StreamPlayer
        match={activeMatch}
        selectedSource={selectedSource}
        onSelectSource={setSelectedSource}
        onClose={closeMatch}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a12', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #00e67608 0%, transparent 100%)',
        borderBottom: '1px solid #1a1a2e',
        padding: '16px',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)',
        background: 'rgba(10,10,18,0.95)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
              ⚽ <span style={{ color: '#00e676' }}>Live</span>Score
            </h1>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={fetchMatches} style={{
                padding: '6px 12px', borderRadius: 8, border: '1px solid #2a2a3e',
                background: '#1a1a2e', color: '#888', cursor: 'pointer', fontSize: 11, fontWeight: 600,
              }}>
                🔄 Refresh
              </button>
            </div>
          </div>
          
          <input
            type="text"
            placeholder="🔍 Cari tim..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1px solid #2a2a3e', background: '#12121a', color: '#e0e0e0',
              fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 10,
            }}
          />

          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'live', label: '🔴 LIVE' },
              { id: 'today', label: 'Hari Ini' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setFilter(tab.id)} style={{
                padding: '6px 14px', borderRadius: 8, border: 'none',
                background: filter === tab.id ? '#00e676' : '#1a1a2e',
                color: filter === tab.id ? '#000' : '#888',
                fontWeight: 600, fontSize: 12, cursor: 'pointer',
              }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px' }}>
        {loading && matches.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚽</div>
            <div style={{ fontSize: 14 }}>Memuat pertandingan...</div>
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', padding: 60, color: '#ff6b6b' }}>
            <div style={{ fontSize: 14 }}>❌ {error}</div>
            <button onClick={fetchMatches} style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, border: '1px solid #ff6b6b', background: 'transparent', color: '#ff6b6b', cursor: 'pointer', fontSize: 13 }}>Coba Lagi</button>
          </div>
        )}

        {!loading && !error && filteredMatches.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 14 }}>Tidak ada pertandingan</div>
          </div>
        )}

        {matches.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredMatches.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                isLive={isLive(match)}
                dateStr={formatDate(match.date)}
                onClick={() => openMatch(match)}
              />
            ))}
          </div>
        )}

        {/* Ad-free info */}
        <div style={{ marginTop: 24, padding: '14px 16px', background: '#0d0d1a', borderRadius: 12, border: '1px solid #1a1a2e', fontSize: 12, color: '#555' }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            💡 <strong style={{ color: '#888' }}>Tips:</strong> Streamer bekerja ketika ada pertandingan langsung.<br/>
            🛡️ Gunakan <strong style={{ color: '#888' }}>VPN</strong> Indonesia untuk channel yang di-geo-block.<br/>
            🔄 Data pertandingan diperbarui otomatis tiap 60 detik.
          </p>
        </div>
      </div>
    </div>
  )
}
