'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

export default function PlayerModal({ channel, onClose }) {
  const [status, setStatus] = useState('loading') // loading | playing | error | timeout
  const [errorMsg, setErrorMsg] = useState('')
  const [quality, setQuality] = useState('auto')
  const [availableQualities, setAvailableQualities] = useState([])
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const timeoutRef = useRef(null)

  // Quality mapping
  const QUALITY_MAP = {
    'auto': 0,    // auto = highest
    '2160p': 4,
    '1080p': 3,
    '720p': 2,
    '480p': 1,
    '360p': 0,
  }

  // Init HLS for M3U8 streams
  const initHls = useCallback(async () => {
    if (channel.type !== 'm3u8') return

    setStatus('loading')

    // Timeout: if still loading after 15s, show timeout
    timeoutRef.current = setTimeout(() => {
      if (status === 'loading') {
        setStatus('timeout')
        setErrorMsg('Stream timeout — channel mungkin offline atau butuh VPN')
      }
    }, 15000)

    try {
      const Hls = (await import('hls.js')).default

      if (!Hls.isSupported()) {
        setStatus('error')
        setErrorMsg('Browser tidak support HLS')
        return
      }

      if (hlsRef.current) {
        hlsRef.current.destroy()
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backbufferLength: 60,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
      })
      hlsRef.current = hls

      hls.attachMedia(videoRef.current)

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        hls.loadSource(channel.src)
      })

      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        clearTimeout(timeoutRef.current)
        setStatus('playing')
        
        // Extract available qualities
        if (data.levels && data.levels.length > 0) {
          const qs = data.levels.map((l, i) => ({
            id: i,
            label: l.height ? `${l.height}p` : `Level ${i}`,
            height: l.height || 0,
          }))
          // Sort by height desc
          qs.sort((a, b) => b.height - a.height)
          setAvailableQualities(qs)
        }

        // Auto play
        videoRef.current?.play().catch(() => {})
      })

      hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
        if (data.level >= 0 && availableQualities[data.level]) {
          setQuality(availableQualities[data.level].label)
        }
      })

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Retry once
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError()
              break
            default:
              clearTimeout(timeoutRef.current)
              setStatus('error')
              setErrorMsg('Stream error — coba channel lain')
              break
          }
        }
      })

      // Store hls ref for quality switching
      window.__hls = hls
    } catch (e) {
      clearTimeout(timeoutRef.current)
      setStatus('error')
      setErrorMsg('Gagal load player: ' + e.message)
    }
  }, [channel, status, availableQualities])

  // Init player
  useEffect(() => {
    if (channel.type === 'm3u8') {
      initHls()
    } else if (channel.type === 'youtube') {
      setStatus('playing')
    } else if (channel.type === 'iframe') {
      setStatus('playing')
    }

    return () => {
      clearTimeout(timeoutRef.current)
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [channel, initHls])

  // Quality selector handler
  const handleQualityChange = (levelId) => {
    const hls = window.__hls
    if (hls) {
      hls.currentLevel = levelId
    }
  }

  // Retry
  const handleRetry = () => {
    setStatus('loading')
    setErrorMsg('')
    clearTimeout(timeoutRef.current)
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
    // Re-init after small delay
    setTimeout(initHls, 500)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.95)',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      animation: 'fadeIn 0.2s ease',
    }}>
      {/* Header bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: '#0a0a12',
        borderBottom: '1px solid #1a1a2e',
      }}>
        <div>
          <span style={{ fontSize: 13, color: '#00e676', fontWeight: 600 }}>{channel.logo}</span>
          <span style={{ fontSize: 14, fontWeight: 700, marginLeft: 8 }}>{channel.name}</span>
          <span style={{ fontSize: 11, color: '#666', marginLeft: 8 }}>
            {channel.verified ? '✅' : '🔴 LIVE'}
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {/* Quality selector — only for M3U8 */}
          {channel.type === 'm3u8' && availableQualities.length > 0 && (
            <select
              value={quality}
              onChange={e => handleQualityChange(parseInt(e.target.value))}
              style={{
                padding: '4px 8px',
                borderRadius: 6,
                border: '1px solid #2a2a3e',
                background: '#12121a',
                color: '#e0e0e0',
                fontSize: 11,
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="auto">Auto</option>
              {availableQualities.map(q => (
                <option key={q.id} value={q.id}>{q.label}</option>
              ))}
            </select>
          )}
          
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32,
              borderRadius: 8,
              border: 'none',
              background: '#1a1a2e',
              color: '#e0e0e0',
              cursor: 'pointer',
              fontSize: 18,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Player area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        background: '#000',
      }}>
        {/* Loading */}
        {status === 'loading' && (
          <div style={{ textAlign: 'center', color: '#888' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#aaa' }}>Loading stream...</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>{channel.name}</div>
          </div>
        )}

        {/* Timeout */}
        {status === 'timeout' && (
          <div style={{ textAlign: 'center', color: '#ff6b6b' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏰</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Stream timeout</div>
            <div style={{ fontSize: 12, color: '#ff6b6b88', marginTop: 4, maxWidth: 400, padding: '0 20px' }}>
              {errorMsg}
            </div>
            <button onClick={handleRetry} style={{
              marginTop: 16, padding: '8px 24px', borderRadius: 8, border: 'none',
              background: '#ff6b6b', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13,
            }}>
              🔄 Retry
            </button>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div style={{ textAlign: 'center', color: '#ff6b6b' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>❌</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Error</div>
            <div style={{ fontSize: 12, color: '#ff6b6b88', marginTop: 4 }}>{errorMsg}</div>
            <button onClick={handleRetry} style={{
              marginTop: 16, padding: '8px 24px', borderRadius: 8, border: 'none',
              background: '#ff6b6b', color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13,
            }}>
              🔄 Retry
            </button>
          </div>
        )}

        {/* M3U8 Video Player */}
        {channel.type === 'm3u8' && (
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
        )}

        {/* YouTube Player */}
        {channel.type === 'youtube' && (
          <iframe
            src={channel.src}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        )}

        {/* Iframe Embed Player */}
        {channel.type === 'iframe' && (
          <iframe
            src={channel.src}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        )}
      </div>

      {/* Channel info bar */}
      <div style={{
        padding: '8px 16px',
        background: '#0a0a12',
        borderTop: '1px solid #1a1a2e',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: 11,
        color: '#555',
      }}>
        <span>📡 Sumber: {channel.src.substring(0, 50)}...</span>
        <span>{status === 'playing' ? '🔴 LIVE' : status.toUpperCase()}</span>
      </div>
    </div>
  )
}
