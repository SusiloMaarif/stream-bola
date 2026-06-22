'use client'

import { useState, useRef, useEffect } from 'react'

export default function PlayerModal({ channel, onClose }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBackdrop, setShowBackdrop] = useState(false)
  const videoRef = useRef(null)
  const hlsRef = useRef(null)

  // Animate in
  useEffect(() => {
    const t = setTimeout(() => setShowBackdrop(true), 10)
    return () => clearTimeout(t)
  }, [])

  // Init HLS
  useEffect(() => {
    if (!channel || channel.type !== 'm3u8') return

    setLoading(true)
    setError(null)

    const initHls = async () => {
      try {
        const Hls = (await import('hls.js')).default

        if (hlsRef.current) {
          hlsRef.current.destroy()
        }

        if (!Hls.isSupported()) {
          // Fallback: coba native HLS (Safari)
          if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = channel.src
            return
          }
          setError('Browser tidak mendukung HLS')
          setLoading(false)
          return
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backbufferLength: 60,
          maxBufferLength: 60,
        })
        hlsRef.current = hls

        hls.attachMedia(videoRef.current)

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(channel.src)
        })

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setLoading(false)
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
                setLoading(false)
                break
            }
          }
        })

        hls.on(Hls.Events.LEVEL_SWITCHED, () => {
          setLoading(false)
        })
      } catch (e) {
        setError('Gagal memuat player: ' + e.message)
        setLoading(false)
      }
    }

    const timer = setTimeout(initHls, 200)
    return () => {
      clearTimeout(timer)
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [channel])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [])

  if (!channel) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      background: '#000',
      opacity: showBackdrop ? 1 : 0,
      transition: 'opacity 0.3s ease',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: '#0a0a12',
        borderBottom: '1px solid #1e1e2e',
        zIndex: 10,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#00e676' }}>
            {channel.logo} {channel.name}
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
            ⏺ LIVE — Click close (X) to stop
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#888',
            fontSize: 24,
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: 8,
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>

      {/* Video area */}
      <div style={{
        flex: 1,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        overflow: 'hidden',
      }}>
        {/* Loading */}
        {loading && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            background: '#000',
            zIndex: 5,
          }}>
            <div style={{
              width: 40,
              height: 40,
              border: '3px solid #1e1e2e',
              borderTop: '3px solid #00e676',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            <div style={{ color: '#555', fontSize: 13 }}>⏳ Loading stream...</div>
            <div style={{ color: '#333', fontSize: 11, maxWidth: 300, textAlign: 'center', wordBreak: 'break-all' }}>
              {channel.src.substring(0, 80)}...
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 16,
            background: '#0a0a12',
            zIndex: 5,
          }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>😵</div>
            <div style={{ color: '#ff6b6b', fontSize: 15, fontWeight: 600 }}>{error}</div>
            <div style={{ color: '#555', fontSize: 12, maxWidth: 400, textAlign: 'center' }}>
              {channel.reliable ? (
                'Channel ini seharusnya stabil. Coba refresh atau ganti channel.'
              ) : (
                <>
                  Sumber IPTV mungkin mati/geo-blocked.
                  <br />Coba pakai <strong>VPN Indonesia</strong> atau coba channel lain.
                </>
              )}
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '10px 24px',
                borderRadius: 8,
                border: '1px solid #333',
                background: '#1a1a2e',
                color: '#ccc',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ← Kembali ke daftar channel
            </button>
          </div>
        )}

        {/* Video element */}
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '100vh',
            objectFit: 'contain',
            display: error ? 'none' : 'block',
          }}
        />
      </div>

      {/* Channel info bar */}
      {!error && (
        <div style={{
          padding: '10px 16px',
          background: '#0a0a12',
          borderTop: '1px solid #1e1e2e',
          fontSize: 11,
          color: '#555',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>📡 {channel.name} • 24/7 Live</span>
          <span style={{ color: '#333' }}>
            {channel.reliable ? '✅ Official' : '🔄 IPTV Source'}
          </span>
        </div>
      )}
    </div>
  )
}
