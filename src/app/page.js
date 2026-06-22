'use client'

import { useState, useEffect, useCallback } from 'react'
import MatchCard from '@/components/MatchCard'
import PlayerModal from '@/components/PlayerModal'

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
        // Filter matches: ambil yang upcoming/live, sort by date
        const now = Date.now()
        const sorted = data.data
          .filter(m => m.date > now - 7200000) // 2 jam ke belakang (masih live)
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
    // Auto-refresh every 60 seconds
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
      if (!m.title.toLowerCase().includes(q) &&
          !(m.teams?.home?.name || '').toLowerCase().includes(q) &&
          !(m.teams?.away?.name || '').toLowerCase().includes(q)) {
        return false
      }
    }
    if (filter === 'live') {
      return m.date <= Date.now() && m.date > Date.now() - 7200000
    }
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
    const isToday = d.toDateString() === now.toDateString()
    const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === d.toDateString()
    const time = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
    
    if (d.getTime() <= now.getTime() && d.getTime() > now.getTime() - 7200000) {
      return `🔴 LIVE • ${time}`
    }
    if (isToday) return `📍 Hari Ini • ${time} WIB`
    if (isTomorrow) return `📍 Besok • ${time} WIB`
    return `${d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })} • ${time} WIB`
  }

  const isLive = (match) => {
    return match.date <= Date.now() && match.date > Date.now() - 7200000
  }

  if (activeMatch) {
    return (
      <PlayerModal
        match={activeMatch}
        selectedSource={selectedSource}
        onSelectSource={setSelectedSource}
        onClose={closeMatch}
      />
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a12',
      color: '#e0e0e0',
      fontFamily: 'system-ui, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #00e67608 0%, transparent 100%)',
        borderBottom: '1px solid #1a1a2e',
        padding: '20px 16px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        background: 'rgba(10,10,18,0.95)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 12px' }}>
            ⚽ <span style={{ color: '#00e676' }}>Sport</span>Stream
          </h1>
          
          {/* Search */}
          <input
            type="text"
            placeholder="🔍 Cari tim atau pertandingan..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 10,
              border: '1px solid #2a2a3e',
              background: '#12121a',
              color: '#e0e0e0',
              fontSize: 13,
              outline: 'none',
              boxSizing: 'border-box',
              marginBottom: 10,
            }}
          />

          {/* Filter tabs */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'live', label: '🔴 LIVE' },
              { id: 'today', label: 'Hari Ini' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 8,
                  border: 'none',
                  background: filter === tab.id ? '#00e676' : '#1a1a2e',
                  color: filter === tab.id ? '#000' : '#888',
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Match List */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px' }}>
        {loading && matches.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>⚽</div>
            <div style={{ fontSize: 14 }}>Memuat jadwal pertandingan...</div>
          </div>
        )}

        {error && (
          <div style={{ textAlign: 'center', padding: 60, color: '#ff6b6b' }}>
            <div style={{ fontSize: 14 }}>❌ {error}</div>
            <button
              onClick={fetchMatches}
              style={{
                marginTop: 12,
                padding: '8px 20px',
                borderRadius: 8,
                border: '1px solid #ff6b6b',
                background: 'transparent',
                color: '#ff6b6b',
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!loading && !error && filteredMatches.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 14 }}>Tidak ada pertandingan ditemukan</div>
          </div>
        )}

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
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: 900,
        margin: '12px auto 0',
        padding: '16px',
        borderTop: '1px solid #1a1a2e',
        textAlign: 'center',
        color: '#444',
        fontSize: 11,
      }}>
        <p>Data & stream dari SportSRC API. Semua sumber bersifat publik.</p>
        <p style={{ marginTop: 2 }}>Powered by Nyxar X Breach 🔓💀</p>
      </div>
    </div>
  )
}
