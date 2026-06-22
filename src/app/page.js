'use client'

import { useState, useMemo } from 'react'
import ChannelCard from '@/components/ChannelCard'
import PlayerModal from '@/components/PlayerModal'

// Daftar channel berdasarkan kategori
const CHANNELS = [
  // === INDONESIA SPORTS ===
  {
    id: 'tvri-sport',
    name: 'TVRI Sport HD',
    logo: '📺',
    category: 'Indonesia Sports',
    src: 'https://ott-balancer.tvri.go.id/live/eds/SportHD/hls/SportHD.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },
  {
    id: 'tvri-nasional',
    name: 'TVRI Nasional',
    logo: '📺',
    category: 'Indonesia Sports',
    src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },
  {
    id: 'tvri-world',
    name: 'TVRI World',
    logo: '🌍',
    category: 'Indonesia Sports',
    src: 'https://ott-balancer.tvri.go.id/live/eds/TVRIWorld/hls/TVRIWorld.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },
  {
    id: 'metro-tv',
    name: 'Metro TV',
    logo: '📰',
    category: 'Indonesia Sports',
    src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },
  {
    id: 'trans-tv',
    name: 'Trans TV',
    logo: '📺',
    category: 'Indonesia Sports',
    src: 'https://video.detik.com/transtv/smil:transtv.smil/playlist.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },
  {
    id: 'trans7',
    name: 'Trans7',
    logo: '📺',
    category: 'Indonesia Sports',
    src: 'https://video.detik.com/trans7/smil:trans7.smil/playlist.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },
  {
    id: 'garuda-tv',
    name: 'Garuda TV',
    logo: '🦅',
    category: 'Indonesia Sports',
    src: 'https://etv-cdn.kdb.co.id/GarudaTV-Stream/index.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },
  {
    id: 'cnn-indo',
    name: 'CNN Indonesia',
    logo: '📡',
    category: 'Indonesia Sports',
    src: 'https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/playlist.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },

  // === INTERNATIONAL SPORTS ===
  {
    id: 'bein-sports-usa',
    name: 'beIN Sports USA',
    logo: '🇧🇪',
    category: 'International Sports',
    src: 'http://23.237.104.106:8080/USA_BEIN/index.m3u8',
    type: 'm3u8',
    lang: 'EN',
    reliable: false,
  },
  {
    id: 'bein-sports-xtra',
    name: 'beIN SPORTS XTRA',
    logo: '🔥',
    category: 'International Sports',
    src: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8',
    type: 'm3u8',
    lang: 'EN',
    reliable: true,
  },
  {
    id: 'fox-sports-1',
    name: 'Fox Sports 1',
    logo: '🦊',
    category: 'International Sports',
    src: 'https://cors-proxy.cooks.fyi/http://190.11.225.124:5000/live/fs1_hd/playlist.m3u8',
    type: 'm3u8',
    lang: 'EN',
    reliable: false,
  },
  {
    id: 'fox-sports',
    name: 'FOX Sports (720p)',
    logo: '🦊',
    category: 'International Sports',
    src: 'https://jmp2.uk/plu-5a74b8e1e22a61737979c6bf.m3u8',
    type: 'm3u8',
    lang: 'EN',
    reliable: false,
  },
  {
    id: 'fox-sports-2',
    name: 'Fox Sports 2',
    logo: '🦊',
    category: 'International Sports',
    src: 'http://471ccec7.tvclub.xyz/iptv/BUYS9YTNABMC25/31612/index.m3u8',
    type: 'm3u8',
    lang: 'EN',
    reliable: false,
  },
  {
    id: 'fox-deportes',
    name: 'Fox Deportes (ES)',
    logo: '🇪🇸',
    category: 'International Sports',
    src: 'https://cors-proxy.cooks.fyi/http://23.237.104.106:8080/USA_FOX_DEPORTES/index.m3u8',
    type: 'm3u8',
    lang: 'ES',
    reliable: false,
  },
  {
    id: 'espn-ocho',
    name: 'ESPN8 The Ocho',
    logo: '🏆',
    category: 'International Sports',
    src: 'https://d3b6q2ou5kp8ke.cloudfront.net/ESPNTheOcho.m3u8',
    type: 'm3u8',
    lang: 'EN',
    reliable: true,
  },
  {
    id: 'espn-deportes',
    name: 'ESPN Deportes',
    logo: '🇪🇸',
    category: 'International Sports',
    src: 'http://origin.thetvapp.to/hls/espn-deportes/mono.m3u8',
    type: 'm3u8',
    lang: 'ES',
    reliable: false,
  },
  {
    id: 'espnu',
    name: 'ESPNU',
    logo: '🏀',
    category: 'International Sports',
    src: 'http://23.237.104.106:8080/USA_ESPNU/index.m3u8',
    type: 'm3u8',
    lang: 'EN',
    reliable: false,
  },
  {
    id: 'dazn-combat',
    name: 'DAZN Combat',
    logo: '🥊',
    category: 'International Sports',
    src: 'https://dazn-combat-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-dazn-combat-rakuten/CDN/master.m3u8',
    type: 'm3u8',
    lang: 'EN',
    reliable: true,
  },
  {
    id: 'nbc-sports',
    name: 'NBC Sports NOW',
    logo: '🇺🇸',
    category: 'International Sports',
    src: 'https://d4whmvwm0rdvi.cloudfront.net/10007/99993008/hls/master.m3u8?ads.xumo_channelId=99993008',
    type: 'm3u8',
    lang: 'EN',
    reliable: false,
  },
  {
    id: 'nba-tv',
    name: 'NBA TV',
    logo: '🏀',
    category: 'International Sports',
    src: 'https://amg00556-amg00556c3-firetv-us-6060.playouts.now.amagi.tv/playlist.m3u8',
    type: 'm3u8',
    lang: 'EN',
    reliable: false,
  },
  {
    id: 'mlb-channel',
    name: 'MLB Channel',
    logo: '⚾',
    category: 'International Sports',
    src: 'https://bcovlive-a.akamaihd.net/r2d2c4ca5bf57456fb1d16255c1a535c8/eu-west-1/6058004203001/playlist.m3u8',
    type: 'm3u8',
    lang: 'EN',
    reliable: false,
  },

  // === INDONESIA REGULAR ===
  {
    id: 'btv',
    name: 'BTV',
    logo: '📺',
    category: 'Indonesia TV',
    src: 'https://b1news.beritasatumedia.com/Beritasatu/B1News_manifest.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },
  {
    id: 'idtv',
    name: 'IDTV',
    logo: '📺',
    category: 'Indonesia TV',
    src: 'https://b1world.beritasatumedia.com/Beritasatu/B1World_manifest.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },
  {
    id: 'rri-net',
    name: 'RRI Net',
    logo: '📻',
    category: 'Indonesia TV',
    src: 'https://private-streaming.rri.go.id/memfs/6f77c7b5-feb2-4935-9f89-e7e9fca0a54a_output_0.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },
  {
    id: 'cnbc-indo',
    name: 'CNBC Indonesia',
    logo: '📈',
    category: 'Indonesia TV',
    src: 'https://live.cnbcindonesia.com/livecnbc/smil:cnbctv.smil/playlist.m3u8',
    type: 'm3u8',
    lang: 'ID',
    reliable: true,
  },
]

// Kelompokan kategori
const CATEGORIES = [
  { key: 'Indonesia Sports', label: '🇮🇩 Indonesia Sports', emoji: '🇮🇩' },
  { key: 'International Sports', label: '🌍 International Sports', emoji: '🌍' },
  { key: 'Indonesia TV', label: '📡 Indonesia TV', emoji: '📡' },
]

export default function Home() {
  const [activeId, setActiveId] = useState(null)
  const [search, setSearch] = useState('')

  const activeChannel = useMemo(
    () => CHANNELS.find(c => c.id === activeId),
    [activeId]
  )

  const filteredChannels = useMemo(() => {
    if (!search.trim()) return CHANNELS
    const q = search.toLowerCase()
    return CHANNELS.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q)
    )
  }, [search])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0a12',
      color: '#e0e0e0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Player Full */}
      {activeChannel && (
        <PlayerModal
          channel={activeChannel}
          onClose={() => setActiveId(null)}
        />
      )}

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%)',
        borderBottom: '1px solid #1e1e2e',
        padding: '24px 16px 16px',
      }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0, textAlign: 'center', letterSpacing: -1 }}>
          ⚽ <span style={{ color: '#00e676' }}>Live</span>TV
          <span style={{ fontSize: 12, color: '#555', fontWeight: 400, marginLeft: 10, letterSpacing: 0 }}>
            Sports • 24/7
          </span>
        </h1>
        <p style={{ textAlign: 'center', color: '#555', fontSize: 12, margin: '4px 0 12px', fontWeight: 500 }}>
          Klik channel untuk nonton langsung • {CHANNELS.length} channel live
        </p>

        {/* Search */}
        <div style={{ maxWidth: 500, margin: '0 auto', position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Cari channel..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px',
              borderRadius: 10,
              border: '1px solid #2a2a3e',
              background: '#0f0f1a',
              color: '#e0e0e0',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* Channel Grid by Category */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '16px' }}>
        {CATEGORIES.map(cat => {
          const channels = filteredChannels.filter(c => c.category === cat.key)
          if (channels.length === 0) return null

          return (
            <div key={cat.key} style={{ marginBottom: 32 }}>
              <h2 style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#888',
                margin: '0 0 12px 4px',
                letterSpacing: 0.5,
              }}>
                {cat.label} <span style={{ color: '#555', fontWeight: 400, fontSize: 13 }}>({channels.length})</span>
              </h2>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                gap: 10,
              }}>
                {channels.map(ch => (
                  <ChannelCard
                    key={ch.id}
                    channel={ch}
                    isActive={activeId === ch.id}
                    onClick={() => setActiveId(activeId === ch.id ? null : ch.id)}
                  />
                ))}
              </div>
            </div>
          )
        })}

        {/* Kalo search gak nemu */}
        {filteredChannels.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
            ❌ Channel "{search}" tidak ditemukan
          </div>
        )}

        {/* Footer */}
        <footer style={{
          marginTop: 40,
          textAlign: 'center',
          color: '#333',
          fontSize: 11,
          borderTop: '1px solid #1a1a2e',
          paddingTop: 24,
          paddingBottom: 40,
        }}>
          <p>⚠️ Hak siar milik pemilik masing-masing. Sumber dari publik.</p>
          <p style={{ marginTop: 4 }}>Gunakan VPN Indonesia untuk channel tertentu.</p>
          <p style={{ marginTop: 12, color: '#222' }}>Nyxar X Breach 🔓💀</p>
        </footer>
      </div>
    </div>
  )
}
