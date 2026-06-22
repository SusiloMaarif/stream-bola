'use client'

import { useState, useEffect, useRef } from 'react'

// Custom loader untuk hls.js — semua request lewat proxy biar CORS & mixed-content aman
function createProxyLoader(Hls) {
  const DefaultLoader = Hls.DefaultConfig.loader
  return class ProxyLoader extends DefaultLoader {
    constructor(config) {
      super(config)
      const load = this.load.bind(this)
      this.load = function(context, config, callbacks) {
        if (context.url.startsWith('http') && !context.url.includes('/api/proxy')) {
          context.url = `/api/proxy?url=${encodeURIComponent(context.url)}`
        }
        load(context, config, callbacks)
      }
      const loadBinary = this.loadBinary?.bind(this)
      if (loadBinary) {
        this.loadBinary = function(context, config, callbacks) {
          if (context.url.startsWith('http') && !context.url.includes('/api/proxy')) {
            context.url = `/api/proxy?url=${encodeURIComponent(context.url)}`
          }
          loadBinary(context, config, callbacks)
        }
      }
    }
  }
}

export default function PlayerModal({ channel, onClose }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [state, setState] = useState('loading') // loading | playing | error | quality-picker
  const [errorMsg, setErrorMsg] = useState('')
  const [qualities, setQualities] = useState([])
  const [currentQuality, setCurrentQuality] = useState(-1) // -1 = auto

  useEffect(() => {
    if (!channel) return

    setState('loading')
    setErrorMsg('')
    setQualities([])
    setCurrentQuality(-1)

    const init = async () => {
      try {
        const Hls = (await import('hls.js')).default
        if (!Hls.isSupported()) {
          setState('error')
          setErrorMsg('Browser tidak mendukung HLS')
          return
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backbufferLength: 60,
          loader: createProxyLoader(Hls),
        })
        hlsRef.current = hls

        // Detect available qualities
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          const levels = hls.levels
          if (levels && levels.length > 1) {
            setQualities(levels.map((l, i) => ({
              id: i,
              label: l.height ? `${l.height}p` : `Quality ${i}`,
              height: l.height || 0,
              bitrate: l.bitrate,
            })))
          }
          setState('playing')
          videoRef.current?.play().catch(() => {})
        })

        // Quality switch handler
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
          setCurrentQuality(data.level)
        })

        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
              hls.startLoad()
            } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
              hls.recoverMediaError()
            } else {
              setState('error')
              setErrorMsg('Stream error — coba channel lain')
            }
          }
        })

        hls.attachMedia(videoRef.current)
        hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(channel.src)
        })

        // Timeout 15 detik
        setTimeout(() => {
          if (state === 'loading') {
            setState('error')
            setErrorMsg('Stream timeout — channel mungkin offline atau geo-blocked')
          }
        }, 15000)
      } catch (e) {
        setState('error')
        setErrorMsg('Gagal memuat player')
      }
    }

    init()

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [channel])

  // Set quality
  const setQuality = (levelId) => {
    if (!hlsRef.current) return
    if (levelId === -1) {
      hlsRef.current.currentLevel = -1 // auto
      setCurrentQuality(-1)
    } else {
      hlsRef.current.currentLevel = levelId
      setCurrentQuality(levelId)
    }
    setState('playing')
  }

  if (!channel) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.92)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      backdropFilter: 'blur(4px)',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        background: '#0a0a12',
        borderBottom: '1px solid #1a1a2e',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{channel.logo}</span>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>{channel.name}</div>
            <div style={{ fontSize: 11, color: '#00e676' }}>
              🔴 LIVE
              {currentQuality >= 0 && qualities[currentQuality] && (
                <span style={{ marginLeft: 8, color: '#888' }}>
                  • {qualities[currentQuality].label}
                </span>
              )}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {/* Quality button */}
          {qualities.length > 1 && (
            <button
              onClick={() => setState(state === 'quality-picker' ? 'playing' : 'quality-picker')}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: '1px solid #2a2a3e',
                background: '#1a1a2e',
                color: '#aaa',
                cursor: 'pointer',
                fontSize: 12,
              }}
            >
              ⚙️ {currentQuality === -1 ? 'Auto' : qualities[currentQuality]?.label || 'Auto'}
            </button>
          )}
          <button
            onClick={onClose}
            style={{
              width: 32, height: 32,
              borderRadius: 8,
              border: 'none',
              background: '#ff000022',
              color: '#ff4444',
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Video Area */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        position: 'relative',
        minHeight: 0,
      }}>
        {/* Loading overlay */}
        {state === 'loading' && (
          <div style={{
            textAlign: 'center',
            color: '#888',
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <div style={{ fontSize: 14 }}>Loading stream...</div>
            <div style={{ fontSize: 11, color: '#555', marginTop: 6 }}>
              {channel.src.substring(0, 50)}...
            </div>
          </div>
        )}

        {/* Error overlay */}
        {state === 'error' && (
          <div style={{ textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>❌</div>
            <div style={{ fontSize: 16, color: '#ff6b6b', fontWeight: 600 }}>{errorMsg}</div>
            <div style={{ fontSize: 12, color: '#555', marginTop: 8, wordBreak: 'break-all', maxWidth: 400 }}>
              {channel.src}
            </div>
            <button
              onClick={onClose}
              style={{
                marginTop: 20,
                padding: '8px 24px',
                borderRadius: 8,
                border: '1px solid #2a2a3e',
                background: '#1a1a2e',
                color: '#aaa',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              ← Balik ke daftar channel
            </button>
          </div>
        )}

        {/* Quality Picker overlay */}
        {state === 'quality-picker' && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 20,
          }}>
            <div style={{
              background: '#12121a',
              borderRadius: 16,
              border: '1px solid #1e1e2e',
              padding: 24,
              minWidth: 280,
              maxWidth: 400,
            }}>
              <h3 style={{ margin: '0 0 16px', fontSize: 16, color: '#e0e0e0' }}>📺 Pilih Kualitas</h3>
              
              <button
                onClick={() => setQuality(-1)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px 16px',
                  borderRadius: 8,
                  border: currentQuality === -1 ? '2px solid #00e676' : '1px solid #2a2a3e',
                  background: currentQuality === -1 ? '#00e67615' : '#1a1a2e',
                  color: currentQuality === -1 ? '#00e676' : '#aaa',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 13,
                  marginBottom: 8,
                  textAlign: 'left',
                }}
              >
                🔄 Auto
                {currentQuality === -1 && <span style={{ float: 'right' }}>✓</span>}
              </button>
              
              {qualities.map(q => (
                <button
                  key={q.id}
                  onClick={() => setQuality(q.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 16px',
                    borderRadius: 8,
                    border: currentQuality === q.id ? '2px solid #00e676' : '1px solid #2a2a3e',
                    background: currentQuality === q.id ? '#00e67615' : '#1a1a2e',
                    color: currentQuality === q.id ? '#00e676' : '#aaa',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: 13,
                    marginBottom: 8,
                    textAlign: 'left',
                  }}
                >
                  {q.label} 
                  {q.bitrate ? <span style={{ color: '#555', fontWeight: 400, marginLeft: 6, fontSize: 11 }}>({(q.bitrate/1000000).toFixed(1)} Mbps)</span> : ''}
                  {currentQuality === q.id && <span style={{ float: 'right' }}>✓</span>}
                </button>
              ))}
              
              <button
                onClick={() => setState('playing')}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '10px',
                  borderRadius: 8,
                  border: 'none',
                  background: 'transparent',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: 13,
                  marginTop: 8,
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* Video element — selalu ada, hidden kalo loading */}
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          style={{
            width: '100%',
            height: '100%',
            display: state === 'playing' ? 'block' : 'none',
            maxHeight: '100vh',
            objectFit: 'contain',
          }}
        />
      </div>
    </div>
  )
}
