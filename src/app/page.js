'use client'

import { useState, useEffect, useRef } from 'react'
import PlayerModal from '@/components/PlayerModal'

// ============================================
// MASTER CHANNEL LIST — Tambahin channel disini
// ============================================
const CHANNELS = [
  // 🇮🇩 === INDONESIA FREE ===
  { id: 'tvri-nasional',    name: 'TVRI Nasional',     logo: '🇮🇩', category: 'Indonesia', src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8', type: 'm3u8', verified: true },
  { id: 'trans-tv',         name: 'Trans TV',           logo: '📺', category: 'Indonesia', src: 'https://video.detik.com/transtv/smil:transtv.smil/index.m3u8', type: 'm3u8', verified: true },
  { id: 'trans-7',          name: 'Trans 7',            logo: '📺', category: 'Indonesia', src: 'https://video.detik.com/trans7/smil:trans7.smil/index.m3u8', type: 'm3u8', verified: true },
  { id: 'metro-tv',         name: 'Metro TV',           logo: '📰', category: 'Indonesia', src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8', type: 'm3u8', verified: true },
  { id: 'rri-net',          name: 'RRI Net',            logo: '📻', category: 'Indonesia', src: 'https://private-streaming.rri.go.id/memfs/6f77c7b5-feb2-4935-9f89-e7e9fca0a54a_output_0.m3u8', type: 'm3u8', verified: true },
  { id: 'tvri-jakarta',     name: 'TVRI Jakarta',       logo: '🏛️', category: 'Indonesia', src: 'https://ott-balancer.tvri.go.id/live/eds/Jakarta/hls/Jakarta.m3u8', type: 'm3u8' },
  { id: 'tvri-aceh',        name: 'TVRI Aceh',          logo: '🏛️', category: 'Indonesia', src: 'https://ott-balancer.tvri.go.id/live/eds/Aceh/hls/Aceh.m3u8', type: 'm3u8' },
  { id: 'tvri-jabar',       name: 'TVRI Jawa Barat',    logo: '🏛️', category: 'Indonesia', src: 'https://ott-balancer.tvri.go.id/live/eds/Jabar/hls/Jabar.m3u8', type: 'm3u8' },
  { id: 'tvri-jatim',       name: 'TVRI Jawa Timur',    logo: '🏛️', category: 'Indonesia', src: 'https://ott-balancer.tvri.go.id/live/eds/Jatim/hls/Jatim.m3u8', type: 'm3u8' },
  { id: 'tvri-sumut',       name: 'TVRI Sumatera Utara',logo: '🏛️', category: 'Indonesia', src: 'https://ott-balancer.tvri.go.id/live/eds/Sumut/hls/Sumut.m3u8', type: 'm3u8' },
  { id: 'tvri-sulsel',      name: 'TVRI Sulawesi Selatan', logo: '🏛️', category: 'Indonesia', src: 'https://ott-balancer.tvri.go.id/live/eds/Sulsel/hls/Sulsel.m3u8', type: 'm3u8' },
  { id: 'tvri-kalsel',      name: 'TVRI Kalimantan Selatan', logo: '🏛️', category: 'Indonesia', src: 'https://ott-balancer.tvri.go.id/live/eds/Kalsel/hls/Kalsel.m3u8', type: 'm3u8' },
  { id: 'tvri-bali',        name: 'TVRI Bali',          logo: '🏛️', category: 'Indonesia', src: 'https://ott-balancer.tvri.go.id/live/eds/Bali/hls/Bali.m3u8', type: 'm3u8' },
  { id: 'tvri-papua',       name: 'TVRI Papua',         logo: '🏛️', category: 'Indonesia', src: 'https://ott-balancer.tvri.go.id/live/eds/Papua/hls/Papua.m3u8', type: 'm3u8' },

  // 🌍 === LIVE SPORTS (YouTube / Embed) ===
  { id: 'sports-yt',        name: 'Sports Live',        logo: '🏆', category: 'Sports', src: 'https://www.youtube.com/embed/_gJqCfcK3-0?autoplay=1&mute=1', type: 'youtube' },
  { id: 'bein-xtra',        name: 'beIN XTRA',          logo: '⚽', category: 'Sports', src: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8', type: 'm3u8' },
  { id: 'dazn-combat',      name: 'DAZN Combat',        logo: '🥊', category: 'Sports', src: 'https://dazn-combat-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-dazn-combat-rakuten/CDN/master.m3u8', type: 'm3u8' },
  { id: 'cbs-sports',       name: 'CBS Sports HQ',      logo: '🏈', category: 'Sports', src: 'https://propee33f9c2.airspace-cdn.cbsivideo.com/index.m3u8', type: 'm3u8' },
  { id: 'nba-tv',           name: 'NBA TV',             logo: '🏀', category: 'Sports', src: 'https://nba-tv.amagi.tv/playlist.m3u8', type: 'm3u8' },
  { id: 'fox-sports',       name: 'Fox Sports',         logo: '🦊', category: 'Sports', src: 'https://live-manifest.production-public.tubi.io/live/6035c7fd-efff-4ec7-93dc-aa0c7a58ba47/playlist.m3u8', type: 'm3u8' },

  // 📡 === NEWS ===
  { id: 'kompas-tv-embed',  name: 'Kompas TV',          logo: '📡', category: 'News', src: 'https://www.dens.tv/embed/kompastv', type: 'iframe' },

  // 🎥 === YOUTUBE LIVE ===
  { id: 'yt-live-1',        name: 'YouTube Sports',     logo: '▶️', category: 'YouTube', src: 'https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=1', type: 'youtube' },
  { id: 'yt-news',          name: 'Live News',          logo: '▶️', category: 'YouTube', src: 'https://www.youtube.com/embed/HkQza3VIGPw?autoplay=1&mute=1', type: 'youtube' },
]

// Group by category
const CATEGORIES = [...new Set(CHANNELS.map(c => c.category))]

export default function Home() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [playing, setPlaying] = useState(null) // channel object or null
  const [customUrl, setCustomUrl] = useState('')

  const filtered = CHANNELS.filter(c => {
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.category.toLowerCase().includes(search.toLowerCase())
    const matchCategory = activeCategory === 'Semua' || c.category === activeCategory
    return matchSearch && matchCategory
  })

  const handlePlay = (ch) => {
    setPlaying(ch)
  }

  const handleClose = () => {
    setPlaying(null)
  }

  const handleAddCustom = () => {
    if (!customUrl.trim()) return
    const name = prompt('Nama channel:') || 'Custom'
    const ch = {
      id: `custom-${Date.now()}`,
      name: name,
      logo: '🔗',
      category: 'Custom',
      src: customUrl.trim(),
      type: customUrl.trim().includes('youtube.com') ? 'youtube' : 'm3u8',
    }
    CHANNELS.push(ch)
    setCustomUrl('')
  }

  // Keyboard shortcut: ESC to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') setPlaying(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a12',
      color: '#e0e0e0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(180deg, #00e67610 0%, transparent 100%)',
        borderBottom: '1px solid #1a1a2e',
        padding: '24px 16px 20px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: -1 }}>
          📺 <span style={{ color: '#00e676' }}>Live</span>TV
        </h1>
        <p style={{ color: '#666', fontSize: 13, margin: '6px 0 16px' }}>
          24/7 Live Streaming • Click to Watch
        </p>
        
        {/* Search Bar */}
        <div style={{ maxWidth: 500, margin: '0 auto' }}>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Cari channel..."
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: 12,
              border: '1px solid #2a2a3e',
              background: '#12121a',
              color: '#e0e0e0',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
          {['Semua', ...CATEGORIES].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{
              padding: '5px 14px', borderRadius: 20,
              border: activeCategory === cat ? '2px solid #00e676' : '1px solid #2a2a3e',
              background: activeCategory === cat ? '#00e67618' : '#12121a',
              color: activeCategory === cat ? '#00e676' : '#888',
              cursor: 'pointer', fontWeight: 600, fontSize: 12,
            }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Channel Grid */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {filtered.map(ch => (
            <ChannelCard key={ch.id} channel={ch} onPlay={handlePlay} />
          ))}
        </div>

        {/* Add custom URL */}
        <div style={{ marginTop: 24, padding: '16px', background: '#12121a', borderRadius: 12, border: '1px solid #1a1a2e' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 8px', color: '#888' }}>🔗 Tambah Channel Custom</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              placeholder="https://example.com/stream.m3u8"
              style={{
                flex: 1, padding: '8px 12px', borderRadius: 8,
                border: '1px solid #2a2a3e', background: '#0a0a12',
                color: '#e0e0e0', fontSize: 13, outline: 'none',
              }}
            />
            <button onClick={handleAddCustom} style={{
              padding: '8px 16px', borderRadius: 8, border: 'none',
              background: '#00e676', color: '#000', fontWeight: 700,
              cursor: 'pointer', fontSize: 12,
            }}>Tambah</button>
          </div>
          <p style={{ fontSize: 11, color: '#555', marginTop: 6 }}>
            Support M3U8, YouTube embed, atau iframe URL
          </p>
        </div>

        <footer style={{ marginTop: 30, textAlign: 'center', color: '#333', fontSize: 11, padding: '20px 0' }}>
          Powered by Nyxar X Breach 🔓💀
        </footer>
      </div>

      {/* Player Modal */}
      {playing && <PlayerModal channel={playing} onClose={handleClose} />}
    </div>
  )
}

// === Channel Card Component ===
function ChannelCard({ channel, onPlay }) {
  return (
    <div
      onClick={() => onPlay(channel)}
      style={{
        background: 'linear-gradient(135deg, #12121a 0%, #16161e 100%)',
        borderRadius: 12,
        border: '1px solid #1e1e2e',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'center',
        userSelect: 'none',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = '#00e67644'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1e1e2e'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ fontSize: 32, marginBottom: 8 }}>{channel.logo}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: '#e0e0e0' }}>{channel.name}</div>
      <div style={{ fontSize: 11, color: '#555', marginTop: 4 }}>
        {channel.verified ? '✅ Verified' : channel.type.toUpperCase()}
      </div>
      {channel.category === 'Indonesia' && (
        <div style={{ fontSize: 10, color: '#00e676', marginTop: 4, fontWeight: 600 }}>FREE 🇮🇩</div>
      )}
    </div>
  )
}
