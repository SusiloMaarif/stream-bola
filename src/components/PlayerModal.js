'use client'

import { useState, useRef, useEffect } from 'react'

export default function PlayerModal({ channel, onClose }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBackdrop, setShowBackdrop] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
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

    // Proxy URL — bypass CORS + rewrite segment URLs
    const proxyUrl = `/api/proxy?url=${encodeURIComponent(channel.src)}`

    // Coba native HLS dulu (Safari, iOS)
    const video = videoRef.current
    if (video && video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = proxyUrl
      video.addEventListener('loadedmetadata', () => setLoading(false), { once: true })
      video.addEventListener('error', () => {
        // Fallback ke hls.js kalo gagal
        initHlsJs(proxyUrl)
      }, { once: true })
      return
    }

    initHlsJs(proxyUrl)

    function initHlsJs(url) {
      let destroyed = false

      const init = async () => {
        try {
          const Hls = (await import('hls.js')).default

          if (!Hls.isSupported()) {
            setError('Browser tidak mendukung HLS streaming')
            setLoading(false)
            return
          }

          if (hlsRef.current) hlsRef.current.destroy()

          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backbufferLength: 60,
            maxBufferLength: 60,
            maxMaxBufferLength: 120,
            startFragPrefetch: true,
            // Timeout lebih longgar
            manifestLoadingTimeOut: 20000,
            levelLoadingTimeOut: 15000,
            fragLoadingTimeOut: 20000,
          })
          
          hlsRef.current = hls

          hls.attachMedia(video)
          
          hls.on(Hls.Events.MEDIA_ATTACHED, () => {
            if (!destroyed) hls.loadSource(url)
          })

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (!destroyed) {
              setLoading(false)
              video.play().catch(() => {})
            }
          })

          // Satu level berhasil
          hls.on(Hls.Events.LEVEL_LOADED, () => {
            if (!destroyed) setLoading(false)
          })

          hls.on(Hls.Events.ERROR, (event, data) => {
            if (destroyed) return
            console.warn('HLS error:', data.type, data.details, data.fatal)

            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  // Coba recover — retry loading
                  console.log('HLS network error, retrying...')
                  setTimeout(() => {
                    if (!destroyed) hls.startLoad()
                  }, 1000)
                  break
                case Hls.ErrorTypes.MEDIA_ERROR:
                  // Media error — recover
                  console.log('HLS media error, recovering...')
                  hls.recoverMediaError()
                  break
                default:
                  // Fatal — coba sekali lagi pake direct URL (tanpa proxy)
                  if (retryCount < 1) {
                    setRetryCount(prev => prev + 1)
                    setLoading(true)
                    hls.destroy()
                    // Coba direct tanpa proxy buat stream yang gak suka proxy
                    const hls2 = new Hls({ enableWorker: true })
                    hlsRef.current = hls2
                    hls2.attachMedia(video)
                    hls2.on(Hls.Events.MEDIA_ATTACHED, () => {
                      hls2.loadSource(channel.src)
                    })
                    hls2.on(Hls.Events.MANIFEST_PARSED, () => {
                      setLoading(false)
                      video.play().catch(() => {})
                    })
                    hls2.on(Hls.Events.ERROR, () => {
                      setError('Stream tidak bisa diputar. Coba channel lain.')
                      setLoading(false)
                    })
                    return
                  }
                  setError('Stream tidak bisa diputar. Coba channel lain.')
                  setLoading(false)
                  break
              }
            }
          })
        } catch (e) {
          if (!destroyed) {
            setError('Gagal memuat player')
            setLoading(false)
          }
        }
      }

      init()
      return () => { destroyed = true }
    }
  }, [channel, retryCount])

  // Cleanup
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
        flexShrink: 0,
      }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#00e676' }}>
            {channel.logo} {channel.name}
          </div>
          <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
            ⏺ LIVE — Tekan ✕ untuk berhenti
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
              {channel.name} • {channel.reliable ? 'Official Stream' : 'IPTV Stream'}
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
                'Channel official — coba refresh atau ganti channel.'
              ) : (
                <>
                  Sumber IPTV mungkin mati/geo-blocked.
                  <br />Coba pakai <strong>VPN Indonesia</strong> atau pilih channel lain.
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => {
                  setRetryCount(0)
                  setError(null)
                  setLoading(true)
                  // Force re-mount by changing key
                  if (hlsRef.current) {
                    hlsRef.current.destroy()
                    hlsRef.current = null
                  }
                }}
                style={{
                  padding: '10px 24px',
                  borderRadius: 8,
                  border: '1px solid #00e676',
                  background: '#00e67618',
                  color: '#00e676',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                🔄 Coba Lagi
              </button>
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
                ← Kembali
              </button>
            </div>
          </div>
        )}

        {/* Video element — selalu render biar HLS bisa attach */}
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
          flexShrink: 0,
        }}>
          <span>📡 {channel.name} • 24/7 Live</span>
          <span style={{ 
            color: channel.reliable ? '#00e676' : '#ffd700',
            fontSize: 10,
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: 4,
            background: channel.reliable ? '#00e67612' : '#ffd70012',
          }}>
            {channel.reliable ? '✅ Official' : '🔄 IPTV'}
          </span>
        </div>
      )}
    </div>
  )
}
