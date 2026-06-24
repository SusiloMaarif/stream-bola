'use client'

import { useState, useEffect, useCallback } from 'react'
import MatchCard from '@/components/MatchCard'
import Channels247 from '@/components/Channels247'
import HlsPlayer from '@/components/HlsPlayer'
import StreamPlayer from '@/components/StreamPlayer'

const API_BASE = 'https://api.sportsrc.org'

export default function Home() {
  const [tab, setTab] = useState('matches')
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeMatch, setActiveMatch] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [activeChannel, setActiveChannel] = useState(null)

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
      setError('Gagal mengambil jadwal')
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
      setError('Gagal memuat stream')
    }
  }

  const closeAll = () => {
    setActiveMatch(null)
    setSelectedSource(null)
    setActiveChannel(null)
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
      const today = new Date(); today.setHours(0,0,0,0)
      return m.date >= today.getTime()
    }
    return true
  })

  const formatDate = (ts) => {
    const d = new Date(ts), now = new Date()
    const t = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
    if (d.toDateString() === now.toDateString()) return `📍 Hari Ini • ${t} WIB`
    const tmrw = new Date(now.getTime() + 86400000)
    if (d.toDateString() === tmrw.toDateString()) return `📍 Besok • ${t} WIB`
    return `${d.toLocaleDateString('id-ID', { weekday:'long', day:'numeric', month:'short' })} • ${t} WIB`
  }

  const isLive = (m) => m.date <= Date.now() && m.date > Date.now() - 7200000

  // Channel player view
  if (activeChannel) {
    return <HlsPlayer channel={activeChannel} onClose={closeAll} />
  }

  // Match stream player view
  if (activeMatch) {
    return (
      <StreamPlayer
        match={activeMatch}
        selectedSource={selectedSource}
        onSelectSource={setSelectedSource}
        onClose={closeAll}
      />
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a12', color: '#e0e0e0', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #00e67608 0%, transparent 100%)',
        borderBottom: '1px solid #1a1a2e', padding: '16px',
        position: 'sticky', top: 0, zIndex: 50,
        backdropFilter: 'blur(12px)', background: 'rgba(10,10,18,0.95)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
              ⚽ <span style={{ color: '#00e676' }}>Sport</span>Stream
            </h1>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setTab('matches')} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', flex: 1,
              background: tab === 'matches' ? '#00e676' : '#1a1a2e',
              color: tab === 'matches' ? '#000' : '#888',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
              📅 Pertandingan
            </button>
            <button onClick={() => setTab('247')} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', flex: 1,
              background: tab === '247' ? '#ffd700' : '#1a1a2e',
              color: tab === '247' ? '#000' : '#888',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
            }}>
              📺 24/7 Channel
            </button>
          </div>

          {tab === 'matches' && (
            <>
              <input type="text" placeholder="🔍 Cari tim..." value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width:'100%', padding:'10px 14px', borderRadius:10,
                  border:'1px solid #2a2a3e', background:'#12121a', color:'#e0e0e0',
                  fontSize:13, outline:'none', boxSizing:'border-box', marginBottom:10, marginTop:10 }} />
              <div style={{ display:'flex', gap:8 }}>
                {[{id:'all',label:'Semua'},{id:'live',label:'🔴 LIVE'},{id:'today',label:'Hari Ini'}].map(t => (
                  <button key={t.id} onClick={() => setFilter(t.id)} style={{
                    padding:'6px 14px', borderRadius:8, border:'none',
                    background: filter===t.id ? '#00e676' : '#1a1a2e',
                    color: filter===t.id ? '#000' : '#888',
                    fontWeight:600, fontSize:12, cursor:'pointer',
                  }}>{t.label}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px' }}>
        {tab === 'matches' && (
          <>
            {loading && matches.length===0 && (
              <div style={{ textAlign:'center', padding:60, color:'#555' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>⚽</div>
                <div style={{ fontSize:14 }}>Memuat pertandingan...</div>
              </div>
            )}
            {error && (
              <div style={{ textAlign:'center', padding:60, color:'#ff6b6b' }}>
                <div style={{ fontSize:14 }}>❌ {error}</div>
                <button onClick={fetchMatches} style={{ marginTop:12, padding:'8px 20px', borderRadius:8,
                  border:'1px solid #ff6b6b', background:'transparent', color:'#ff6b6b',
                  cursor:'pointer', fontSize:13 }}>Coba Lagi</button>
              </div>
            )}
            {!loading && !error && filteredMatches.length===0 && (
              <div style={{ textAlign:'center', padding:60, color:'#555' }}>
                <div style={{ fontSize:32, marginBottom:12 }}>📭</div>
                <div style={{ fontSize:14 }}>Tidak ada pertandingan</div>
              </div>
            )}
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {filteredMatches.map(m => (
                <MatchCard key={m.id} match={m}
                  isLive={isLive(m)} dateStr={formatDate(m.date)}
                  onClick={() => openMatch(m)} />
              ))}
            </div>
          </>
        )}

        {tab === '247' && (
          <Channels247 onPlay={(ch) => setActiveChannel(ch)} />
        )}
      </div>
    </div>
  )
}
