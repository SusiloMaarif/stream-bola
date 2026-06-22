'use client'

import { useState } from 'react'
import ChannelCard from '@/components/ChannelCard'
import PlayerModal from '@/components/PlayerModal'

// ===================== CHANNEL DATA =====================
// Sumber: iptv-org.github.io, playlist publik
const CHANNELS = {
  indonesia: {
    title: '🇮🇩 Indonesia',
    channels: [
      { name: 'TVRI Nasional', logo: '🇮🇩', src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8', lang: 'id' },
      { name: 'TVRI Sport HD', logo: '🏅', src: 'https://ott-balancer.tvri.go.id/live/eds/SportHD/hls/SportHD.m3u8', lang: 'id' },
      { name: 'TVRI World', logo: '🌏', src: 'https://ott-balancer.tvri.go.id/live/eds/World/hls/World.m3u8', lang: 'en' },
      { name: 'Metro TV', logo: '📰', src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8', lang: 'id' },
      { name: 'CNN Indonesia', logo: '📡', src: 'https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/chunklist_w2099542994_b384000_sleng.m3u8', lang: 'id' },
      { name: 'CNBC Indonesia', logo: '💹', src: 'https://live.cnbcindonesia.com/livecnbc/smil:cnbctv.smil/chunklist.m3u8', lang: 'id' },
      { name: 'Trans TV', logo: '📺', src: 'https://video.detik.com/transtv/smil:transtv.smil/index.m3u8', lang: 'id' },
      { name: 'Trans7', logo: '📺', src: 'https://video.detik.com/trans7/smil:trans7.smil/index.m3u8', lang: 'id' },
      { name: 'BeritaSatu', logo: '📰', src: 'https://video.detik.com/beritasatu/smil:beritasatu.smil/index.m3u8', lang: 'id' },
      { name: 'RRI Net', logo: '📻', src: 'https://private-streaming.rri.go.id/memfs/6f77c7b5-feb2-4935-9f89-e7e9fca0a54a_output_0.m3u8', lang: 'id' },
    ]
  },
  sports: {
    title: '🌍 International Sports',
    channels: [
      { name: 'beIN Sports USA', logo: '⚽', src: 'http://23.237.104.106:8080/USA_BEIN/index.m3u8', lang: 'en' },
      { name: 'beIN SPORTS XTRA', logo: '⚽', src: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8', lang: 'en' },
      { name: 'Fox Sports 1', logo: '🦊', src: 'https://cors-proxy.cooks.fyi/http://190.11.225.124:5000/live/fs1_hd/playlist.m3u8', lang: 'en' },
      { name: 'Fox Sports 2', logo: '🦊', src: 'https://tvsen7.aynaott.com/foxsports2/index.m3u8', lang: 'en' },
      { name: 'Fox Sports', logo: '🦊', src: 'https://live-manifest.production-public.tubi.io/live/6035c7fd-efff-4ec7-93dc-aa0c7a58ba47/playlist.m3u8', lang: 'en' },
      { name: 'Fox Deportes', logo: '🇪🇸', src: 'http://origin.thetvapp.to/hls/fox-deportes/mono.m3u8', lang: 'es' },
      { name: 'ESPN8 The Ocho', logo: '🏆', src: 'https://d3b6q2ou5kp8ke.cloudfront.net/ESPNTheOcho.m3u8', lang: 'en' },
      { name: 'ESPN Deportes', logo: '🇪🇸', src: 'http://origin.thetvapp.to/hls/espn-deportes/mono.m3u8', lang: 'es' },
      { name: 'ESPNU', logo: '🏀', src: 'http://23.237.104.106:8080/USA_ESPNU/index.m3u8', lang: 'en' },
      { name: 'NBC Sports NOW', logo: '⛸️', src: 'https://d4whmvwm0rdvi.cloudfront.net/10007/99993008/hls/master.m3u8', lang: 'en' },
      { name: 'CBS Sports HQ', logo: '📺', src: 'https://propee33f9c2.airspace-cdn.cbsivideo.com/index.m3u8', lang: 'en' },
      { name: 'CBS Sports Golazo', logo: '⚽', src: 'https://proped3fhg87.airspace-cdn.cbsivideo.com/golazo-live-dai/master/golazo-live-dai.m3u8', lang: 'en' },
      { name: 'DAZN TV', logo: '🥊', src: 'https://jmp2.uk/plu-647f07e74cfc2c0008a2e557.m3u8', lang: 'en' },
      { name: 'DAZN Combat', logo: '🥊', src: 'https://dazn-combat-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-dazn-combat-rakuten/CDN/master.m3u8', lang: 'en' },
      { name: 'NBA TV', logo: '🏀', src: 'http://origin.thetvapp.to/hls/nba-tv/mono.m3u8', lang: 'en' },
      { name: 'MLB Channel', logo: '⚾', src: 'http://origin.thetvapp.to/hls/mlb-network/mono.m3u8', lang: 'en' },
    ]
  },
  football: {
    title: '⚽ Football (Langsung)',
    channels: [
      { name: 'beIN Sports USA', logo: '⚽', src: 'http://23.237.104.106:8080/USA_BEIN/index.m3u8', lang: 'en' },
      { name: 'beIN SPORTS XTRA', logo: '⚽', src: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8', lang: 'en' },
      { name: 'Fox Sports 1', logo: '🦊', src: 'https://cors-proxy.cooks.fyi/http://190.11.225.124:5000/live/fs1_hd/playlist.m3u8', lang: 'en' },
      { name: 'Fox Deportes', logo: '🇪🇸', src: 'http://origin.thetvapp.to/hls/fox-deportes/mono.m3u8', lang: 'es' },
      { name: 'CBS Sports Golazo', logo: '⚽', src: 'https://proped3fhg87.airspace-cdn.cbsivideo.com/golazo-live-dai/master/golazo-live-dai.m3u8', lang: 'en' },
      { name: 'NBC Sports NOW', logo: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', src: 'https://d4whmvwm0rdvi.cloudfront.net/10007/99993008/hls/master.m3u8', lang: 'en' },
      { name: 'ESPN Deportes', logo: '🇪🇸', src: 'http://origin.thetvapp.to/hls/espn-deportes/mono.m3u8', lang: 'es' },
      { name: 'TVRI Sport HD', logo: '🇮🇩', src: 'https://ott-balancer.tvri.go.id/live/eds/SportHD/hls/SportHD.m3u8', lang: 'id' },
      { name: 'DAZN TV', logo: '⚽', src: 'https://jmp2.uk/plu-647f07e74cfc2c0008a2e557.m3u8', lang: 'en' },
      { name: 'Sky Sports UK (via proxy)', logo: '🇬🇧', src: 'http://23.237.104.106:8080/GB_SKYSP1/index.m3u8', lang: 'en' },
    ]
  }
}

export default function Home() {
  const [selectedChannel, setSelectedChannel] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')

  // Gabung semua channel
  const allChannels = Object.values(CHANNELS).flatMap(c => c.channels)
  
  // Filter
  const filtered = activeCategory === 'all'
    ? allChannels
    : CHANNELS[activeCategory]?.channels || []

  const searched = filtered.filter(ch =>
    ch.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a12 0%, #0f0f1a 50%, #0a0a12 100%)',
      color: '#e0e0e0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(180deg, #00e67615 0%, transparent 100%)',
        borderBottom: '1px solid #1a1a2e',
        padding: '30px 20px 20px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: -1 }}>
          📺 <span style={{ background: 'linear-gradient(135deg, #00e676, #00c853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stream</span>Bola
        </h1>
        <p style={{ color: '#666', margin: '6px 0 0', fontSize: 13, fontWeight: 500 }}>
          Live Sports TV • 24/7 Channels
        </p>
      </div>

      {/* Search + Category */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 16px 0' }}>
        <input
          placeholder="🔍 Cari channel..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 16px',
            borderRadius: 10,
            border: '1px solid #2a2a3e',
            background: '#12121a',
            color: '#e0e0e0',
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { id: 'all', label: '📺 Semua' },
            { id: 'indonesia', label: '🇮🇩 Indonesia' },
            { id: 'sports', label: '🌍 Sports' },
            { id: 'football', label: '⚽ Football' },
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setSearch('') }}
              style={{
                padding: '6px 16px',
                borderRadius: 20,
                border: activeCategory === cat.id ? '2px solid #00e676' : '1px solid #2a2a3e',
                background: activeCategory === cat.id ? '#00e67618' : '#12121a',
                color: activeCategory === cat.id ? '#00e676' : '#888',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
                transition: 'all 0.2s',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Channel Grid */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '16px 16px 40px' }}>
        {activeCategory !== 'all' && (
          <h2 style={{ fontSize: 13, color: '#666', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>
            {CHANNELS[activeCategory]?.title}
          </h2>
        )}
        
        {searched.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
            😕 Gak ada channel yang cocok dengan &quot;{search}&quot;
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
          }}>
            {searched.map((ch, i) => (
              <ChannelCard
                key={i}
                channel={ch}
                onClick={() => setSelectedChannel(ch)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Player Modal */}
      {selectedChannel && (
        <PlayerModal
          channel={selectedChannel}
          onClose={() => setSelectedChannel(null)}
        />
      )}

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        color: '#333',
        fontSize: 11,
        padding: '20px',
        borderTop: '1px solid #0f0f1a',
      }}>
        ⚠️ Semua link publik. Hak siar milik pemilik masing-masing.
      </footer>
    </div>
  )
}
