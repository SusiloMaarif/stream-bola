'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export default function PlayerModal({ channel, onClose }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [status, setStatus] = useState('loading') // loading | playing | error
  const [errorMsg, setErrorMsg] = useState('')
  const [qualities, setQualities] = useState([])
  const [currentQuality, setCurrentQuality] = useState(-1) // -1 = auto
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const playerRef = useRef(null)

  // Init HLS
  useEffect(() => {
    if (!channel || channel.type !== 'm3u8') return

    setStatus('loading')
    setErrorMsg('')
    setQualities([])
    setCurrentQuality(-1)

    const initHls = async () => {
      try {
        const Hls = (await import('hls.js')).default

        if (hlsRef.current) {
          hlsRef.current.destroy()
          hlsRef.current = null
        }

        if (!Hls.isSupported()) {
          setStatus('error')
          setErrorMsg('HLS tidak didukung browser ini')
          return
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        })
        hlsRef.current = hls
        hls.attachMedia(videoRef.current)

        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(channel.src)
        })

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Dapatkan daftar kualitas
          const levels = hls.levels.map((l, i) => ({
            id: i,
            height: l.height,
            bitrate: l.bitrate,
            name: l.height >= 1080 ? '1080p' :
                  l.height >= 720 ? '720p' :
                  l.height >= 480 ? '480p' :
                  l.height >= 360 ? '360p' :
                  l.height >= 240 ? '240p' : `${l.height}p`
          }))
          setQualities(levels)
          setStatus('playing')
          videoRef.current?.play().catch(() => {})
        })

        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          setCurrentQuality(data.level)
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setStatus('error')
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              setErrorMsg('Stream timeout — channel mungkin offline atau geo-blocked')
            } else {
              setErrorMsg('Error memuat stream. Coba channel lain.')
            }
          }
        })
      } catch (e) {
        setStatus('error')
        setErrorMsg('Gagal memuat player')
      }
    }

    const timer = setTimeout(initHls, 300)
    return () => {
      clearTimeout(timer)
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [channel])

  // Ganti kualitas
  const changeQuality = useCallback((levelId) => {
    if (hlsRef.current) {
      if (levelId === -1) {
        hlsRef.current.currentLevel = -1 // auto
        setCurrentQuality(-1)
      } else {
        hlsRef.current.currentLevel = levelId
        setCurrentQuality(levelId)
      }
    }
    setShowQualityMenu(false)
  }, [])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!playerRef.current) return
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen?.()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen?.()
      setIsFullscreen(false)
    }
  }, [])

  // Close on ESC
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (showQualityMenu) {
          setShowQualityMenu(false)
        } else {
          onClose()
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose, showQualityMenu])

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999,
      animation: 'fadeIn 0.2s ease',
    }}>
      {/* ===== TOP BAR ===== */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 16px',
        background: '#0a0a12',
        borderBottom: '1px solid #1a1a2e',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#888', cursor: 'pointer',
            fontSize: 20, padding: '4px 8px', borderRadius: 6,
          }}>←</button>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{channel.logo} {channel.name}</div>
            <div style={{ fontSize: 11, color: '#555' }}>🔴 LIVE · {channel.lang}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {/* Quality Selector */}
          {status === 'playing' && qualities.length > 0 && (
            <div style={{ position: 'relative' }}>
              <button onClick={() => setShowQualityMenu(!showQualityMenu)} style={{
                padding: '5px 10px',
                borderRadius: 6,
                border: '1px solid #333',
                background: '#1a1a2e',
                color: '#aaa',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 600,
              }}>
                {currentQuality === -1 ? 'Auto' : qualities.find(q => q.id === currentQuality)?.name || 'Auto'} ▾
              </button>
              {showQualityMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%', right: 0, marginTop: 4,
                  background: '#12121a',
                  border: '1px solid #2a2a3e',
                  borderRadius: 8,
                  overflow: 'hidden',
                  minWidth: 100,
                  zIndex: 100,
                  boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
                }}>
                  <button onClick={() => changeQuality(-1)} style={{
                    width: '100%',
                    padding: '8px 14px',
                    border: 'none',
                    background: currentQuality === -1 ? '#00e67620' : 'transparent',
                    color: currentQuality === -1 ? '#00e676' : '#aaa',
                    cursor: 'pointer',
                    fontSize: 12,
                    textAlign: 'left',
                  }}>🔄 Auto</button>
                  {qualities.map(q => (
                    <button key={q.id} onClick={() => changeQuality(q.id)} style={{
                      width: '100%',
                      padding: '8px 14px',
                      border: 'none',
                      background: currentQuality === q.id ? '#00e67620' : 'transparent',
                      color: currentQuality === q.id ? '#00e676' : '#aaa',
                      cursor: 'pointer',
                      fontSize: 12,
                      textAlign: 'left',
                    }}>
                      {q.name} {q.id === 0 && '(Terendah)'} {q.id === qualities.length - 1 && '(Tertinggi)'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Fullscreen */}
          <button onClick={toggleFullscreen} style={{
            padding: '5px 10px',
            borderRadius: 6,
            border: '1px solid #333',
            background: '#1a1a2e',
            color: '#aaa',
            cursor: 'pointer',
            fontSize: 14,
          }}>⛶</button>

          {/* Close */}
          <button onClick={onClose} style={{
            padding: '5px 10px',
            borderRadius: 6,
            border: '1px solid #ff333333',
            background: '#ff000011',
            color: '#ff6666',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
          }}>✕ Tutup</button>
        </div>
      </div>

      {/* ===== VIDEO PLAYER ===== */}
      <div ref={playerRef} style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: '#000',
        minHeight: 0,
      }}>
        {/* Loading */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
            <div style={{ color: '#888', fontSize: 14 }}>Loading stream...</div>
            <div style={{ color: '#555', fontSize: 12, marginTop: 6 }}>{channel.src.substring(0, 60)}...</div>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
            <div style={{ color: '#ff6b6b', fontSize: 14, fontWeight: 600 }}>{errorMsg}</div>
            <div style={{ color: '#888', fontSize: 12, marginTop: 8 }}>{channel.name}</div>
            <button onClick={onClose} style={{
              marginTop: 16,
              padding: '10px 24px',
              borderRadius: 8,
              border: '1px solid #333',
              background: '#1a1a2e',
              color: '#aaa',
              cursor: 'pointer',
              fontSize: 13,
            }}>← Kembali ke daftar channel</button>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            maxHeight: '100vh',
            display: status === 'playing' ? 'block' : 'none',
            objectFit: 'contain',
            background: '#000',
          }}
        />
      </div>

      {/* Info bar */}
      <div style={{
        padding: '8px 16px',
        background: '#0a0a12',
        borderTop: '1px solid #1a1a2e',
        fontSize: 11,
        color: '#555',
        flexShrink: 0,
        display: 'flex',
        justifyContent: 'space-between',
      }}>
        <span>🔴 LIVE · {channel.name}</span>
        <span>Stream via {channel.type?.toUpperCase() || 'HLS'}</span>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
