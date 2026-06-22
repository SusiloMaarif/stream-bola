'use client'

import { useState, useEffect, useCallback } from 'react'
import MatchCard from '@/components/MatchCard'
import StreamPlayer from '@/components/StreamPlayer'
import HlsChannelPlayer from '@/components/HlsChannelPlayer'

const API_BASE = 'https://api.sportsrc.org'

// 24/7 Verified Channels
const CHANNELS_247 = [
  // 🇮🇩 INDONESIA
  { id: 'tvri', name: 'TVRI Nasional', group: '🇮🇩 Indonesia', lang: 'ID', src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'trans7', name: 'Trans7', group: '🇮🇩 Indonesia', lang: 'ID', src: 'https://video.detik.com/trans7/smil:trans7.smil/index.m3u8', type: 'm3u8', quality: 'HD', referer: 'https://www.detik.com/' },
  { id: 'transtv', name: 'Trans TV', group: '🇮🇩 Indonesia', lang: 'ID', src: 'https://video.detik.com/transtv/smil:transtv.smil/index.m3u8', type: 'm3u8', quality: 'HD', referer: 'https://www.detik.com/' },
  { id: 'metro', name: 'Metro TV', group: '🇮🇩 Indonesia', lang: 'ID', src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'rrinet', name: 'RRI Net', group: '🇮🇩 Indonesia', lang: 'ID', src: 'https://private-streaming.rri.go.id/memfs/6f77c7b5-feb2-4935-9f89-e7e9fca0a54a_output_0.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'beritasatu', name: 'BeritaSatu', group: '🇮🇩 Indonesia', lang: 'ID', src: 'https://video.detik.com/beritasatu/smil:beritasatu.smil/index.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'garuda', name: 'Garuda TV', group: '🇮🇩 Indonesia', lang: 'ID', src: 'https://video.detik.com/garudatv/smil:garudatv.smil/index.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'cnbc', name: 'CNBC Indonesia', group: '🇮🇩 Indonesia', lang: 'ID', src: 'https://video.detik.com/cnbcindonesia/smil:cnbcindonesia.smil/index.m3u8', type: 'm3u8', quality: 'HD' },
  // 🌍 SPORTS - iptv-org verified
  { id: 'africa24', name: 'Africa 24 Sport', group: '🌍 Sports', lang: 'EN/FR', src: 'https://africa24.vedge.infomaniak.com/livecast/ik:africa24sport/manifest.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'accdn', name: 'ACCDN Sports', group: '🌍 Sports', lang: 'EN', src: 'https://raycom-accdn-firetv.amagi.tv/playlist.m3u8', type: 'm3u8', quality: 'HD' },
  { id: '30agolf', name: '30A Golf', group: '🌍 Sports', lang: 'EN', src: 'https://30a-tv.com/feeds/vidaa/golf.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'draftkings', name: 'DraftKings', group: '🌍 Sports', lang: 'EN', src: 'https://na.linear.zype.com/e0bd0e23-a958-4e43-8164-4f2fef8876a8/fd3614bd-90bf-4530-a277-65ae3a1720c8-zype/live.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'dazn', name: 'DAZN 1 (DE)', group: '🌍 Sports', lang: 'DE', src: 'https://dazn1-de-rakuten.amagi.tv/playlist.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'beinxtra', name: 'beIN SPORTS XTRA', group: '🌍 Sports', lang: 'EN', src: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'espn8ocho', name: 'ESPN8 The Ocho', group: '🌍 Sports', lang: 'EN', src: 'https://d3b6q2ou5kp8ke.cloudfront.net/ESPNTheOcho.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'cbssports', name: 'CBS Sports HQ', group: '🌍 Sports', lang: 'EN', src: 'https://propee33f9c2.airspace-cdn.cbsivideo.com/index.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'golazo', name: 'CBS Sports Golazo', group: '🌍 Sports', lang: 'EN', src: 'https://proped3fhg87.airspace-cdn.cbsivideo.com/golazo-live-dai/master/golazo-live-dai.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'nbcsports', name: 'NBC Sports Now', group: '🌍 Sports', lang: 'EN', src: 'https://d4whmvwm0rdvi.cloudfront.net/10007/99993008/hls/master.m3u8', type: 'm3u8', quality: 'HD' },
  { id: 'aspor', name: 'A Spor (TR)', group: '🌍 Sports', lang: 'TR', src: 'https://rnttwmjcin.turknet.ercdn.net/lcpmvefbyo/aspor/aspor.m3u8', type: 'm3u8', quality: 'HD' },
]

export default function Home() {
  const [tab, setTab] = useState('matches') // 'matches' | 'channels'
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeMatch, setActiveMatch] = useState(null)
  const [selectedSource, setSelectedSource] = useState(null)
  const [activeChannel, setActiveChannel] = useState(null)
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
        setMatches(data.data.filter(m => m.date > now - 7200000).sort((a, b) => a.date - b.date))
      }
    } catch { setError('Gagal memuat jadwal') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchMatches(); const i = setInterval(fetchMatches, 60000); return () => clearInterval(i) }, [fetchMatches])

  const openMatch = async (match) => {
    try {
      const res = await fetch(`${API_BASE}/?data=detail&category=football&id=${match.id}`)
      const data = await res.json()
      if (data.success && data.data) { setActiveMatch(data.data); setSelectedSource(data.data.sources?.[0] || null) }
    } catch { setError('Gagal memuat detail stream') }
  }

  const filteredMatches = matches.filter(m => {
    if (search) {
      const q = search.toLowerCase()
      if (!(m.teams?.home?.name || '').toLowerCase().includes(q) &&
          !(m.teams?.away?.name || '').toLowerCase().includes(q) &&
          !m.title.toLowerCase().includes(q)) return false
    }
    if (filter === 'live') return m.date <= Date.now() && m.date > Date.now() - 7200000
    if (filter === 'today') { const t = new Date(); t.setHours(0,0,0,0); return m.date >= t.getTime() }
    return true
  })

  const filteredChannels = CHANNELS_247.filter(ch => {
    if (!search) return true
    const q = search.toLowerCase()
    return ch.name.toLowerCase().includes(q) || ch.group.toLowerCase().includes(q)
  })

  const formatDate = (ts) => {
    const d = new Date(ts), n = new Date()
    const t = d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
    if (d.getTime() <= n.getTime() && d.getTime() > n.getTime() - 7200000) return `🔴 LIVE • ${t}`
    if (d.toDateString() === n.toDateString()) return `📍 Hari Ini • ${t} WIB`
    const tmw = new Date(n.getTime() + 86400000)
    if (tmw.toDateString() === d.toDateString()) return `📍 Besok • ${t} WIB`
    return `${d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })} • ${t} WIB`
  }
  const isLive = (m) => m.date <= Date.now() && m.date > Date.now() - 7200000

  // Player modals
  if (activeMatch) return (
    <StreamPlayer match={activeMatch} selectedSource={selectedSource}
      onSelectSource={setSelectedSource} onClose={() => { setActiveMatch(null); setSelectedSource(null) }} />
  )
  if (activeChannel) return (
    <HlsChannelPlayer channel={activeChannel} onClose={() => setActiveChannel(null)} />
  )

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
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>
              ⚽ <span style={{ color: '#00e676' }}>Live</span>Score
            </h1>
            <button onClick={fetchMatches} style={{
              padding: '6px 12px', borderRadius: 8, border: '1px solid #2a2a3e',
              background: '#1a1a2e', color: '#888', cursor: 'pointer', fontSize: 11, fontWeight: 600,
            }}>🔄 Refresh</button>
          </div>

          <input type="text" placeholder="🔍 Cari tim atau channel..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 14px', borderRadius: 10,
              border: '1px solid #2a2a3e', background: '#12121a', color: '#e0e0e0',
              fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 10,
            }}
          />

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setTab('matches')} style={{
              flex: 1, padding: '10px', borderRadius: 10, border: 'none',
              background: tab === 'matches' ? 'linear-gradient(135deg, #00e676, #00c853)' : '#1a1a2e',
              color: tab === 'matches' ? '#000' : '#888',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>⚽ Pertandingan</button>
            <button onClick={() => setTab('channels')} style={{
              flex: 1, padding: '10px', borderRadius: 10, border: 'none',
              background: tab === 'channels' ? 'linear-gradient(135deg, #00e676, #00c853)' : '#1a1a2e',
              color: tab === 'channels' ? '#000' : '#888',
              fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>📺 24/7 Channel</button>
          </div>

          {/* Filter sub-tabs (matches only) */}
          {tab === 'matches' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {[
                { id: 'all', label: 'Semua' }, { id: 'live', label: '🔴 LIVE' }, { id: 'today', label: 'Hari Ini' },
              ].map(t => (
                <button key={t.id} onClick={() => setFilter(t.id)} style={{
                  padding: '6px 14px', borderRadius: 8, border: 'none',
                  background: filter === t.id ? '#00e676' : '#1a1a2e',
                  color: filter === t.id ? '#000' : '#888',
                  fontWeight: 600, fontSize: 12, cursor: 'pointer',
                }}>{t.label}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px' }}>
        {/* MATCHES TAB */}
        {tab === 'matches' && (
          <>
            {loading && matches.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>⚽</div>
                <div style={{ fontSize: 14 }}>Memuat pertandingan...</div>
              </div>
            )}
            {error && (
              <div style={{ textAlign: 'center', padding: 60, color: '#ff6b6b' }}>
                <div>❌ {error}</div>
                <button onClick={fetchMatches} style={{
                  marginTop: 12, padding: '8px 20px', borderRadius: 8,
                  border: '1px solid #ff6b6b', background: 'transparent', color: '#ff6b6b',
                  cursor: 'pointer', fontSize: 13,
                }}>Coba Lagi</button>
              </div>
            )}
            {!loading && filteredMatches.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, color: '#555', fontSize: 14 }}>
                Tidak ada pertandingan. Coba tab <strong style={{ color: '#888' }}>📺 24/7 Channel</strong>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredMatches.map(m => (
                <MatchCard key={m.id} match={m} isLive={isLive(m)}
                  dateStr={formatDate(m.date)} onClick={() => openMatch(m)} />
              ))}
            </div>
          </>
        )}

        {/* CHANNELS 24/7 TAB */}
        {tab === 'channels' && (
          <>
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 13, color: '#888' }}>
                📡 {filteredChannels.length} channel tersedia • <span style={{ color: '#00e676' }}>24/7 LIVE</span>
              </span>
              <span style={{ fontSize: 10, color: '#555' }}>🔊 Klik untuk tonton</span>
            </div>

            {filteredChannels.length === 0 && (
              <div style={{ textAlign: 'center', padding: 40, color: '#555', fontSize: 14 }}>
                Channel tidak ditemukan
              </div>
            )}

            {/* Group by category */}
            {['🇮🇩 Indonesia', '🌍 Sports'].map(group => {
              const channels = filteredChannels.filter(c => c.group === group)
              if (channels.length === 0) return null
              return (
                <div key={group} style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 13, color: '#888', fontWeight: 600, margin: '0 0 10px', letterSpacing: 0.5 }}>
                    {group} — {channels.length} channel
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                    {channels.map(ch => (
                      <button
                        key={ch.id}
                        onClick={() => setActiveChannel(ch)}
                        style={{
                          padding: '12px', borderRadius: 10,
                          background: '#12121a', border: '1px solid #1e1e2e',
                          color: '#e0e0e0', cursor: 'pointer',
                          textAlign: 'left', transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e2e'}
                      >
                        <div style={{ fontSize: 18, marginBottom: 6 }}>
                          {ch.group.includes('Indonesia') ? '🇮🇩' : '📺'}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4, lineHeight: 1.3 }}>
                          {ch.name}
                        </div>
                        <div style={{ fontSize: 10, color: '#666' }}>
                          <span style={{ color: '#00e676' }}>● LIVE</span> • {ch.quality || 'HD'}
                        </div>
                        <div style={{ fontSize: 9, color: '#444', marginTop: 4 }}>
                          {ch.lang}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
