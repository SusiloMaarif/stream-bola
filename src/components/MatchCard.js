'use client'

import { useState, useRef, useEffect } from 'react'

export default function MatchCard({ match }) {
  const [activeChannel, setActiveChannel] = useState(null)
  const videoRef = useRef(null)
  const hlsRef = useRef(null)

  // Init hls.js ketika player aktif
  useEffect(() => {
    if (activeChannel === null) return
    const ch = match.channels[activeChannel]
    if (!ch || ch.type !== 'm3u8') return

    let hls = null
    const initHls = async () => {
      const Hls = (await import('hls.js')).default
      if (!Hls.isSupported()) return

      hls = new Hls()
      hlsRef.current = hls
      hls.attachMedia(videoRef.current)
      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(ch.src)
      })
    }
    initHls()

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [activeChannel, match.channels])

  return (
    <div style={{
      background: '#12121a',
      borderRadius: 16,
      border: '1px solid #1e1e2e',
      overflow: 'hidden',
    }}>
      {/* Info Match */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: 12, color: '#00e676', fontWeight: 600, marginBottom: 6 }}>
          {match.league}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>
            {match.home} <span style={{ color: '#666', fontWeight: 400, margin: '0 10px' }}>vs</span> {match.away}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, color: '#888' }}>{match.date}</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#ffd700' }}>{match.time}</div>
          </div>
        </div>
      </div>

      {/* Channel Buttons */}
      {match.channels.length > 0 && (
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {match.channels.map((ch, i) => (
            <button
              key={i}
              onClick={() => setActiveChannel(activeChannel === i ? null : i)}
              style={{
                padding: '8px 18px',
                borderRadius: 8,
                border: activeChannel === i ? '2px solid #00e676' : '1px solid #333',
                background: activeChannel === i ? '#00e67622' : '#1a1a2e',
                color: activeChannel === i ? '#00e676' : '#aaa',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              ▶ {ch.name}
            </button>
          ))}
        </div>
      )}

      {/* Player */}
      {activeChannel !== null && (() => {
        const ch = match.channels[activeChannel]

        // M3U8 Player (hls.js)
        if (ch.type === 'm3u8') {
          return (
            <div style={{ borderTop: '1px solid #1e1e2e' }}>
              <div style={{ position: 'relative', background: '#000', minHeight: 200 }}>
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  style={{ width: '100%', display: 'block', maxHeight: 500 }}
                  playsInline
                />
              </div>
            </div>
          )
        }

        // Iframe Player (buat embed dari aggregator)
        return (
          <div style={{ borderTop: '1px solid #1e1e2e' }}>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
              <iframe
                src={`https:${ch.src}`}
                style={{
                  position: 'absolute',
                  top: 0, left: 0,
                  width: '100%', height: '100%',
                  border: 'none',
                }}
                allowFullScreen
                allow="autoplay; encrypted-media"
              />
            </div>
          </div>
        )
      })()}

      {/* Kalo gak ada channel */}
      {match.channels.length === 0 && (
        <div style={{ padding: '10px 20px 16px', color: '#555', fontSize: 13 }}>
          ⏰ Link streaming akan muncul mendekati jam tayang
        </div>
      )}
    </div>
  )
}
