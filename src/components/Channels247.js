'use client'

import { useState, useRef, useEffect } from 'react'

const CHANNELS = [
  { id: 'tvri', name: 'TVRI Nasional', flag: '🇮🇩', lang: 'Indonesia', src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8', verified: true },
  { id: 'transtv', name: 'Trans TV', flag: '🇮🇩', lang: 'Indonesia', src: 'https://video.detik.com/transtv/smil:transtv.smil/index.m3u8', verified: true },
  { id: 'trans7', name: 'Trans7', flag: '🇮🇩', lang: 'Indonesia', src: 'https://video.detik.com/trans7/smil:trans7.smil/index.m3u8', verified: true },
  { id: 'metro', name: 'Metro TV', flag: '🇮🇩', lang: 'Indonesia', src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8', verified: true },
  { id: 'rri', name: 'RRI Net', flag: '🇮🇩', lang: 'Indonesia', src: 'https://private-streaming.rri.go.id/memfs/6f77c7b5-feb2-4935-9f89-e7e9fca0a54a_output_0.m3u8', verified: true },
  { id: 'bein', name: 'beIN Sports XTRA', flag: '🌍', lang: 'English', src: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8' },
  { id: 'fox', name: 'Fox Sports', flag: '🇺🇸', lang: 'English', src: 'https://live-manifest.production-public.tubi.io/live/6035c7fd-efff-4ec7-93dc-aa0c7a58ba47/playlist.m3u8' },
  { id: 'dazn', name: 'DAZN Combat', flag: '🌍', lang: 'English', src: 'https://dazn-combat-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-dazn-combat-rakuten/CDN/master.m3u8' },
  { id: 'cnn', name: 'CNN Indonesia', flag: '🇮🇩', lang: 'Indonesia', src: 'https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/chunklist_w2099542994_b384000_sleng.m3u8' },
  { id: 'cnbc', name: 'CNBC Indonesia', flag: '🇮🇩', lang: 'Indonesia', src: 'https://live.cnbcindonesia.com/livecnbc/smil:cnbctv.smil/chunklist.m3u8' },
  { id: 'foxdep', name: 'Fox Deportes', flag: '🇺🇸', lang: 'Spanish', src: 'https://fox-deportes-rakuten.amagi.tv/playlist.m3u8' },
  { id: 'cbs', name: 'CBS Sports HQ', flag: '🇺🇸', lang: 'English', src: 'https://propee33f9c2.airspace-cdn.cbsivideo.com/index.m3u8' },
  { id: 'nbcs', name: 'NBC Sports NOW', flag: '🇺🇸', lang: 'English', src: 'https://d4whmvwm0rdvi.cloudfront.net/10007/99993008/hls/master.m3u8' },
  { id: 'mola', name: 'Mola TV', flag: '🇮🇩', lang: 'Indonesia', src: 'https://mola-tv-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-molatv-rakuten/CDN/master.m3u8' },
  { id: 'sportklub', name: 'Sport Klub', flag: '🇪🇺', lang: 'Regional', src: 'https://sportklub-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-sportklub-rakuten/CDN/master.m3u8' },
  { id: 'belogriv', name: 'Belogriv TV', flag: '🇺🇸', lang: 'English', src: 'https://belogriv-tv.amagi.tv/playlist.m3u8' },
  { id: 'espn8', name: 'ESPN8 The Ocho', flag: '🇺🇸', lang: 'English', src: 'https://d3b6q2ou5kp8ke.cloudfront.net/ESPNTheOcho.m3u8' },
]

export default function Channels247({ onPlayM3U8 }) {
  const [search, setSearch] = useState('')
  const [playing, setPlaying] = useState(null)
  const [playingChannel, setPlayingChannel] = useState(null)
  const videoRef = useRef(null)
  const hlsRef = useRef(null)

  const filtered = CHANNELS.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.lang.toLowerCase().includes(search.toLowerCase())
  )

  // HLS player
  useEffect(() => {
    if (!playingChannel) {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }
      return
    }

    const loadHls = async () => {
      try {
        const Hls = (await import('hls.js')).default
        if (hlsRef.current) hlsRef.current.destroy()

        if (!Hls.isSupported()) return

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })
        hlsRef.current = hls
        hls.attachMedia(videoRef.current)
        hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(playingChannel))
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch(() => {})
        })
        hls.on(Hls.Events.ERROR, (e, data) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad()
            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError()
          }
        })
      } catch (e) {}
    }
    loadHls()

    return () => {
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }
    }
  }, [playingChannel])

  return (
    <div>
      {playing && playingChannel && (
        <div style={{
          marginBottom: 16, borderRadius: 12, overflow: 'hidden',
          border: '1px solid #1e1e2e',
        }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '8px 12px', background: '#0a0a12', borderBottom: '1px solid #1e1e2e',
          }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>📺 Now Playing: {playing}</span>
            <button onClick={() => { setPlaying(null); setPlayingChannel(null) }} style={{
              background: '#1a1a2e', border: 'none', color: '#aaa', width: 28, height: 28,
              borderRadius: 6, cursor: 'pointer', fontSize: 14, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>
          <div style={{ background: '#000', minHeight: 250 }}>
            <video ref={videoRef} controls autoPlay playsInline
              style={{ width: '100%', display: 'block', maxHeight: 500, minHeight: 250 }} />
          </div>
        </div>
      )}

      <h2 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 6px', color: '#00e676' }}>
        📡 24/7 Live Channels
      </h2>
      <p style={{ fontSize: 12, color: '#666', margin: '0 0 12px' }}>
        Channel siaran 24 jam non-stop — klik untuk nonton langsung
      </p>

      <input type="text" placeholder="🔍 Cari channel..." value={search}
        onChange={e => setSearch(e.target.value)}
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid #2a2a3e',
          background: '#12121a', color: '#e0e0e0', fontSize: 13, outline: 'none',
          boxSizing: 'border-box', marginBottom: 12,
        }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
        {filtered.map(ch => (
          <button
            key={ch.id}
            onClick={() => {
              setPlaying(ch.name)
              setPlayingChannel(ch.src)
              setSearch('')
            }}
            style={{
              padding: '12px',
              borderRadius: 10,
              border: playing === ch.name ? '2px solid #00e676' : '1px solid #2a2a3e',
              background: playing === ch.name ? '#00e67612' : '#12121a',
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#00e67655'}
            onMouseLeave={e => e.currentTarget.style.borderColor = playing === ch.name ? '#00e676' : '#2a2a3e'}
          >
            <div style={{ fontSize: 16, marginBottom: 4 }}>{ch.flag}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: playing === ch.name ? '#00e676' : '#e0e0e0' }}>{ch.name}</div>
            <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>
              {ch.lang}
              {ch.verified && <span style={{ marginLeft: 4, color: '#00e676' }}>✅</span>}
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 30, color: '#555', fontSize: 13 }}>
          Tidak ada channel ditemukan
        </div>
      )}

      <div style={{ marginTop: 12, padding: '10px 12px', background: '#0d0d1a', borderRadius: 8, fontSize: 11, color: '#555' }}>
        ✅ = Verified | Channel internasional mungkin butuh VPN
      </div>
    </div>
  )
}
