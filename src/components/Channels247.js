'use client'

import { useState } from 'react'

const CHANNELS = [
  {
    id: 1, name: 'TVRI Sport',
    src: 'https://ott-balancer.tvri.go.id/live/eds/Sport/hls/Sport.m3u8',
    type: 'm3u8', country: '🇮🇩',
    desc: 'Olahraga nasional & internasional',
  },
  {
    id: 2, name: 'TVRI Nasional',
    src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8',
    type: 'm3u8', country: '🇮🇩',
    desc: 'Berita & olahraga',
  },
  {
    id: 3, name: 'TVRI World',
    src: 'https://ott-balancer.tvri.go.id/live/eds/World/hls/World.m3u8',
    type: 'm3u8', country: '🇮🇩',
    desc: 'Siaran internasional',
  },
  {
    id: 4, name: 'Trans TV',
    src: 'https://video.detik.com/transtv/smil:transtv.smil/index.m3u8',
    type: 'm3u8', country: '🇮🇩',
    desc: 'Hiburan & olahraga',
  },
  {
    id: 5, name: 'Trans7',
    src: 'https://video.detik.com/trans7/smil:trans7.smil/index.m3u8',
    type: 'm3u8', country: '🇮🇩',
    desc: 'Hiburan & olahraga',
  },
  {
    id: 6, name: 'Metro TV',
    src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8',
    type: 'm3u8', country: '🇮🇩',
    desc: 'Berita & olahraga',
  },
  {
    id: 7, name: 'BTV',
    src: 'https://cdn.beritasatumedia.com/beritasatu/BTV-Station-2/smil:latest.smil/playlist.m3u8',
    type: 'm3u8', country: '🇮🇩',
    desc: 'Berita Indonesia',
  },
  {
    id: 8, name: 'IDTV',
    src: 'https://cdn.beritasatumedia.com/beritasatu/BTV-Beritasatu/smil:latest.smil/playlist.m3u8',
    type: 'm3u8', country: '🇮🇩',
    desc: 'Berita bisnis & olahraga',
  },
  {
    id: 9, name: 'Garuda TV',
    src: 'https://5c7b683162943.streamlock.net/live/ngrp:garudatv_all/playlist.m3u8',
    type: 'm3u8', country: '🇮🇩',
    desc: 'Channel olahraga Indonesia',
  },
  {
    id: 10, name: 'CNN Indonesia',
    src: 'https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/chunklist_w2099542994_b384000_sleng.m3u8',
    type: 'm3u8', country: '🇮🇩',
    desc: 'Berita nasional & internasional',
  },
]

export default function Channels247({ onSelectChannel }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{
      border: '1px solid #1e1e2e', borderRadius: 16, overflow: 'hidden',
      background: '#0e0e16',
    }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '14px 16px', background: '#12121a',
          border: 'none', color: '#e0e0e0', cursor: 'pointer',
          fontSize: 14, fontWeight: 700, textAlign: 'left',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <span>📡 24/7 Live Channels <span style={{ fontSize: 11, color: '#888', fontWeight: 400 }}>({CHANNELS.length} channel tersedia)</span></span>
        <span style={{ color: '#00e676', fontSize: 12 }}>{open ? '▲ Tutup' : '▼ Buka'}</span>
      </button>

      {open && (
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {CHANNELS.map(ch => (
            <div
              key={ch.id}
              onClick={() => onSelectChannel(ch)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 10,
                background: '#1a1a2e', border: '1px solid #2a2a3e',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#00e67644'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#2a2a3e'}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 8,
                background: '#00e67615', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 18, flexShrink: 0,
              }}>
                📺
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {ch.country} {ch.name}
                </div>
                <div style={{ fontSize: 11, color: '#888' }}>{ch.desc}</div>
              </div>
              <div style={{
                fontSize: 10, color: '#00e676', fontWeight: 600,
                padding: '3px 8px', borderRadius: 4, background: '#00e67611',
                whiteSpace: 'nowrap',
              }}>
                ▶ Tonton
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
