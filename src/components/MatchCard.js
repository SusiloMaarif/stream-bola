'use client'

import { useState, useRef, useEffect } from 'react'

export default function MatchCard({ match }) {
  const [activeChannel, setActiveChannel] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const hlsRef = useRef(null)

  // Init hls.js ketika player aktif
  useEffect(() => {
    if (activeChannel === null) {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
      return
    }

    const ch = match.channels[activeChannel]
    if (!ch || ch.type !== 'm3u8') return

    setIsLoading(true)
    setError(null)

    const initHls = async () => {
      try {
        const Hls = (await import('hls.js')).default
        
        if (hlsRef.current) {
          hlsRef.current.destroy()
        }

        if (!Hls.isSupported()) {
          setError('HLS tidak didukung browser ini')
          setIsLoading(false)
          return
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backbufferLength: 30,
        })
        hlsRef.current = hls

        hls.attachMedia(videoRef.current)

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(ch.src)
        })

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false)
          videoRef.current?.play().catch(() => {})
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hls.startLoad()
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                hls.recoverMediaError()
                break
              default:
                setError('Stream error — coba channel lain')
                setIsLoading(false)
                break
            }
          }
        })
      } catch (e) {
        setError('Gagal memuat player')
        setIsLoading(false)
      }
    }

    // Delay init biar transisi mulus
    const timer = setTimeout(initHls, 300)

    return () => {
      clearTimeout(timer)
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [activeChannel, match.channels])

  const isLive = match.badge === '🔴 LIVE'

  return (
    <div style={{
      background: isLive ? 'linear-gradient(135deg, #12121a 0%, #1a0a0a 100%)' : '#12121a',
      borderRadius: 16,
      border: isLive ? '1px solid #ff333322' : '1px solid #1e1e2e',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      boxShadow: isLive ? '0 0 30px rgba(255, 0, 0, 0.05)' : 'none',
    }}>
      {/* Info Match */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: '#00e676', fontWeight: 700, letterSpacing: 0.5 }}>
            {match.league}
          </span>
          <span style={{
            fontSize: 10,
            fontWeight: 800,
            padding: '3px 8px',
            borderRadius: 4,
            background: isLive ? '#ff000033' : '#333',
            color: isLive ? '#ff4444' : '#888',
            letterSpacing: 0.5,
          }}>
            {match.badge}
          </span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>
              <span style={{ color: isLive ? '#fff' : '#e0e0e0' }}>{match.home}</span>
              <span style={{ color: '#555', fontWeight: 300, margin: '0 10px', fontSize: 16 }}>vs</span>
              <span style={{ color: isLive ? '#fff' : '#e0e0e0' }}>{match.away}</span>
            </div>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{ fontSize: 13, color: '#888', fontWeight: 500 }}>{match.date}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: '#ffd700', marginTop: 2 }}>
              {match.time}
            </div>
          </div>
        </div>
      </div>

      {/* Channel Buttons */}
      {match.channels.length > 0 && (
        <div style={{ padding: '0 20px 16px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {match.channels.map((ch, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveChannel(activeChannel === i ? null : i)
                setIsLoading(true)
                setError(null)
              }}
              style={{
                padding: '7px 16px',
                borderRadius: 8,
                border: activeChannel === i ? '2px solid #00e676' : '1px solid #2a2a3e',
                background: activeChannel === i ? '#00e67618' : '#1a1a2e',
                color: activeChannel === i ? '#00e676' : '#999',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 12,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 10 }}>▶</span>
              {ch.name}
            </button>
          ))}
        </div>
      )}

      {/* Player */}
      {activeChannel !== null && (() => {
        const ch = match.channels[activeChannel]

        if (ch.type === 'm3u8') {
          return (
            <div style={{ borderTop: '1px solid #1a1a2e', position: 'relative' }}>
              {/* Loading overlay */}
              {isLoading && (
                <div style={{
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(0,0,0,0.7)',
                  zIndex: 10,
                  fontSize: 13,
                  color: '#888',
                }}>
                  <span>⏳ Loading stream...</span>
                </div>
              )}
              {/* Error overlay */}
              {error && (
                <div style={{
                  padding: 20,
                  textAlign: 'center',
                  color: '#ff6b6b',
                  fontSize: 13,
                  background: '#1a0a0a',
                  borderTop: '1px solid #1e1e2e',
                }}>
                  ❌ {error}
                </div>
              )}
              <div style={{ position: 'relative', background: '#000', minHeight: 250 }}>
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  style={{ width: '100%', display: 'block', maxHeight: 500, minHeight: 250 }}
                  playsInline
                />
              </div>
              <div style={{ padding: '8px 20px', fontSize: 11, color: '#555', background: '#0a0a12', borderTop: '1px solid #1a1a2e' }}>
                📡 {ch.name} • {ch.src.substring(0, 60)}...
              </div>
            </div>
          )
        }

        // Iframe fallback
        return (
          <div style={{ borderTop: '1px solid #1a1a2e' }}>
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
