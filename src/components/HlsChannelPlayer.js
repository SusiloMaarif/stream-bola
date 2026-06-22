'use client'

import { useState, useRef, useEffect } from 'react'

export default function HlsChannelPlayer({ channel, onClose }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!channel?.src) return

    const initHls = async () => {
      try {
        const Hls = (await import('hls.js')).default

        if (hlsRef.current) {
          hlsRef.current.destroy()
          hlsRef.current = null
        }

        if (!Hls.isSupported()) {
          setError('HLS tidak didukung browser ini')
          return
        }

        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backbufferLength: 60,
        })
        hlsRef.current = hls

        hls.attachMedia(videoRef.current)
        hls.on(Hls.Events.MEDIA_ATTACHED, () => hls.loadSource(channel.src))
        hls.on(Hls.Events.MANIFEST_PARSED, () => videoRef.current?.play().catch(() => {}))
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            if (data.type === Hls.ErrorTypes.NETWORK_ERROR) hls.startLoad()
            else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) hls.recoverMediaError()
            else setError('Stream error — coba channel lain')
          }
        })
      } catch { setError('Gagal memuat player') }
    }

    initHls()
    return () => { if (hlsRef.current) hlsRef.current.destroy() }
  }, [channel?.src])

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#000', zIndex: 1000, display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '8px 12px', background: '#0a0a12', borderBottom: '1px solid #1e1e2e',
      }}>
        <button onClick={onClose} style={{
          background: '#1a1a2e', border: 'none', color: '#aaa', width: 32, height: 32,
          borderRadius: 8, cursor: 'pointer', fontSize: 18, display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>✕</button>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{channel?.name}</div>
          <div style={{ fontSize: 11, color: '#888' }}>📡 {channel?.group} • {channel?.lang || 'ID'}</div>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
        {error ? (
          <div style={{ textAlign: 'center', color: '#ff6b6b', padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>❌</div>
            <div style={{ fontSize: 14 }}>{error}</div>
            <button onClick={onClose} style={{
              marginTop: 12, padding: '8px 20px', borderRadius: 8,
              border: '1px solid #ff6b6b', background: 'transparent', color: '#ff6b6b',
              cursor: 'pointer', fontSize: 13,
            }}>Kembali</button>
          </div>
        ) : (
          <video
            ref={videoRef}
            controls autoPlay playsInline
            style={{ width: '100%', maxHeight: '100vh', display: 'block' }}
          />
        )}
      </div>
    </div>
  )
}
