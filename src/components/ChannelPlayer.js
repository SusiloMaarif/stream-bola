'use client'

import { useState, useRef, useEffect } from 'react'

export default function ChannelPlayer({ channel, onClose }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const playerRef = useRef(null)
  const [showIframe, setShowIframe] = useState(false)

  // Try M3U8 via hls.js first
  useEffect(() => {
    if (!channel || !videoRef.current) return

    let hls = null
    const initPlayer = async () => {
      try {
        const Hls = (await import('hls.js')).default

        if (Hls.isSupported()) {
          hls = new Hls({ enableWorker: true, backbufferLength: 60 })
          hlsRef.current = hls
          hls.attachMedia(videoRef.current)
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            hls.loadSource(channel.src)
          })
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setLoading(false)
            videoRef.current?.play().catch(() => {
              // Autoplay blocked, need click
              setLoading(false)
            })
          })
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal) {
              if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                hls.startLoad()
              } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                hls.recoverMediaError()
              } else {
                setError('Stream error')
                setLoading(false)
              }
            }
          })
        } else {
          // Fallback to iframe proxy
          setShowIframe(true)
          setLoading(false)
        }
      } catch {
        setError('Gagal memuat player')
        setLoading(false)
      }
    }

    initPlayer()
    return () => {
      if (hls) hls.destroy()
      if (hlsRef.current) hlsRef.current.destroy()
    }
  }, [channel])

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#000', zIndex: 1000, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#0a0a12', borderBottom: '1px solid #1e1e2e', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1 }}>
          <button onClick={onClose} style={{ background: '#1a1a2e', border: 'none', color: '#aaa', width: 32, height: 32, borderRadius: 8, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{channel.country} {channel.name}</div>
            <div style={{ fontSize: 11, color: '#888' }}>📺 24/7 Live Channel</div>
          </div>
        </div>
      </div>

      {/* Video */}
      <div style={{ flex: 1, position: 'relative', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {loading && (
          <div style={{ textAlign: 'center', color: '#555' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>⏳</div>
            <div style={{ fontSize: 14 }}>Loading...</div>
          </div>
        )}
        {error && (
          <div style={{ textAlign: 'center', color: '#ff6b6b' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>❌</div>
            <div style={{ fontSize: 14 }}>{error}</div>
          </div>
        )}
        
        {showIframe ? (
          <iframe src={`/api/proxy?url=${encodeURIComponent(channel.src)}`} style={{ width: '100%', height: '100%', border: 'none' }} allowFullScreen allow="autoplay; encrypted-media" />
        ) : (
          <video
            ref={videoRef}
            controls
            autoPlay
            playsInline
            style={{
              width: '100%', maxHeight: '100%', display: 'block',
              objectFit: 'contain',
            }}
          />
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 16px', background: '#0a0a12', borderTop: '1px solid #1e1e2e' }}>
        <div style={{ fontSize: 12, color: '#888' }}>
          <span style={{ color: '#00e676' }}>🔴 LIVE</span> — {channel.desc}
        </div>
      </div>
    </div>
  )
}
