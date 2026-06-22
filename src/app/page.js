'use client'

import { useState, useEffect, useRef } from 'react'
import ChannelsGrid from '@/components/ChannelsGrid'
import PlayerModal from '@/components/PlayerModal'

// === CHANNEL DATABASE ===
const CHANNELS = {
  indonesia: [
    { id: 'tvri', name: 'TVRI Nasional', logo: '🇮🇩', src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8', type: 'm3u8', hd: true, lang: 'ID' },
    { id: 'transtv', name: 'Trans TV', logo: '📺', src: 'https://video.detik.com/transtv/smil:transtv.smil/index.m3u8', type: 'm3u8', hd: true, lang: 'ID' },
    { id: 'trans7', name: 'Trans7', logo: '📺', src: 'https://video.detik.com/trans7/smil:trans7.smil/index.m3u8', type: 'm3u8', hd: true, lang: 'ID' },
    { id: 'metro', name: 'Metro TV', logo: '📰', src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8', type: 'm3u8', hd: true, lang: 'ID' },
    { id: 'useetv', name: 'USEETV Sport', logo: '⚽', src: 'http://edge.telin.useetv.com/sc/useesport_720p.m3u8', type: 'm3u8', hd: true, lang: 'ID' },
    { id: 'rrinet', name: 'RRI Net', logo: '📻', src: 'https://private-streaming.rri.go.id/memfs/6f77c7b5-feb2-4935-9f89-e7e9fca0a54a_output_0.m3u8', type: 'm3u8', hd: false, lang: 'ID' },
  ],
  international: [
    { id: 'bein1', name: 'beIN Sport 1', logo: '🏆', src: 'http://vzagut73.megogo.xyz/iptv/5WS4WSUFCCHGQF/6131/index.m3u8', type: 'm3u8', hd: true, lang: 'AR/EN' },
    { id: 'bein3', name: 'beIN Sport 3', logo: '🏆', src: 'http://vzagut73.megogo.xyz/iptv/5WS4WSUFCCHGQF/6124/index.m3u8', type: 'm3u8', hd: true, lang: 'AR/EN' },
    { id: 'tntsport', name: 'TNT Sports 1', logo: '🥊', src: 'http://eypv0ag4.siauliairsavlt.pw/iptv/NW3M9M6N2H4NYM/19051/index.m3u8', type: 'm3u8', hd: true, lang: 'EN' },
    { id: 'trtsport', name: 'TRT Sport', logo: '⚽', src: 'http://eypv0ag4.siauliairsavlt.pw/iptv/NW3M9M6N2H4NYM/19072/index.m3u8', type: 'm3u8', hd: true, lang: 'TR/EN' },
  ],
  sports: [
    { id: 'bein1', name: 'beIN Sport 1', logo: '🏆', src: 'http://vzagut73.megogo.xyz/iptv/5WS4WSUFCCHGQF/6131/index.m3u8', type: 'm3u8', hd: true, lang: 'AR/EN' },
    { id: 'bein3', name: 'beIN Sport 3', logo: '🏆', src: 'http://vzagut73.megogo.xyz/iptv/5WS4WSUFCCHGQF/6124/index.m3u8', type: 'm3u8', hd: true, lang: 'AR/EN' },
    { id: 'useetv', name: 'USEETV Sport', logo: '⚽', src: 'http://edge.telin.useetv.com/sc/useesport_720p.m3u8', type: 'm3u8', hd: true, lang: 'ID' },
    { id: 'tntsport', name: 'TNT Sports 1HD', logo: '🥊', src: 'http://eypv0ag4.siauliairsavlt.pw/iptv/NW3M9M6N2H4NYM/19051/index.m3u8', type: 'm3u8', hd: true, lang: 'EN' },
    { id: 'trtsport', name: 'TRT Sport', logo: '⚽', src: 'http://eypv0ag4.siauliairsavlt.pw/iptv/NW3M9M6N2H4NYM/19072/index.m3u8', type: 'm3u8', hd: true, lang: 'TR/EN' },
  ]
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [playing, setPlaying] = useState(null) // null or channel object
  const [currentTime, setCurrentTime] = useState('')

  // Jam realtime
  useEffect(() => {
    const update = () => {
      const now = new Date()
      setCurrentTime(now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }))
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  // Semua channel
  const allChannels = [...CHANNELS.indonesia, ...CHANNELS.international]
  
  // Filter berdasarkan kategori & search
  const filteredChannels = (() => {
    let list = allChannels
    if (activeCategory === 'indonesia') list = CHANNELS.indonesia
    else if (activeCategory === 'international') list = CHANNELS.international
    else if (activeCategory === 'sports') list = CHANNELS.sports
    
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(ch => ch.name.toLowerCase().includes(q))
    }
    return list
  })()

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a12',
      color: '#e0e0e0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      paddingBottom: 80,
    }}>
      {/* ===== HEADER ===== */}
      <header style={{
        background: 'linear-gradient(180deg, #0d0d1a 0%, #0a0a12 100%)',
        borderBottom: '1px solid #1a1a2e',
        padding: '20px 16px',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
                📡 <span style={{ background: 'linear-gradient(135deg, #00e676, #00c853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Live</span>TV
              </h1>
              <p style={{ margin: '2px 0 0', color: '#555', fontSize: 11, fontWeight: 500 }}>
                {Object.keys(allChannels).length} Channels • 24/7 Live
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#ffd700' }}>{currentTime}</div>
              <div style={{ fontSize: 10, color: '#555' }}>WIB</div>
            </div>
          </div>

          {/* Search Bar */}
          <div style={{
            display: 'flex',
            gap: 8,
            background: '#12121a',
            border: '1px solid #1e1e2e',
            borderRadius: 10,
            padding: '6px 14px',
            alignItems: 'center',
          }}>
            <span style={{ color: '#555', fontSize: 14 }}>🔍</span>
            <input
              type="text"
              placeholder="Cari channel..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                color: '#e0e0e0',
                fontSize: 13,
                outline: 'none',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 12 }}>✕</button>
            )}
          </div>

          {/* Category Pills */}
          <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: '📡 Semua', count: allChannels.length },
              { id: 'indonesia', label: '🇮🇩 Indonesia', count: CHANNELS.indonesia.length },
              { id: 'sports', label: '🏆 Sports', count: CHANNELS.sports.length },
              { id: 'international', label: '🌍 Internasional', count: CHANNELS.international.length },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 20,
                  border: activeCategory === cat.id ? '2px solid #00e676' : '1px solid #2a2a3e',
                  background: activeCategory === cat.id ? '#00e67615' : '#12121a',
                  color: activeCategory === cat.id ? '#00e676' : '#888',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 11,
                  transition: 'all 0.2s',
                }}
              >
                {cat.label} <span style={{ opacity: 0.6, fontSize: 10 }}>({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ===== MAIN CONTENT ===== */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '16px' }}>
        {filteredChannels.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#555' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📡</div>
            <p>Channel tidak ditemukan</p>
            <button onClick={() => { setSearch(''); setActiveCategory('all') }}
              style={{ marginTop: 12, padding: '8px 20px', borderRadius: 8, border: '1px solid #333', background: '#1a1a2e', color: '#aaa', cursor: 'pointer' }}
            >Reset filter</button>
          </div>
        ) : (
          <ChannelsGrid channels={filteredChannels} onPlay={setPlaying} />
        )}

        {/* Info Sumber */}
        <div style={{
          marginTop: 30,
          padding: 20,
          border: '1px solid #1a1a2e',
          borderRadius: 12,
          background: '#0d0d15',
          fontSize: 12,
          color: '#555',
          lineHeight: 1.8,
        }}>
          <p style={{ fontWeight: 600, color: '#888', marginBottom: 4 }}>📡 Sumber Channel</p>
          <p>Channel Indonesia: TVRI, Trans TV, Trans7, Metro TV (Official). USEETV Sport, RRI Net (Publik).</p>
          <p>Channel Internasional: Dari publik IPTV playlist — masa berlaku terbatas. Gunakan VPN untuk geo-block.</p>
          <p style={{ marginTop: 8, color: '#444' }}>⚠️ Hak siar milik pemilik masing-masing.</p>
        </div>
      </div>

      {/* ===== PLAYER MODAL ===== */}
      {playing && (
        <PlayerModal channel={playing} onClose={() => setPlaying(null)} />
      )}
    </div>
  )
}
