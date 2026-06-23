'use client'

import { useState, useRef, useEffect } from 'react'

export default function StreamPlayer({ match, selectedSource, onSelectSource, onClose, channel, onBack }) {
  const [ready, setReady] = useState(false)
  const [streamUrl, setStreamUrl] = useState(null)
  const [streamError, setStreamError] = useState(null)
  const [loadingStream, setLoadingStream] = useState(false)

  // If it's a channel stream (24/7), fetch via API proxy
  useEffect(() => {
    if (!channel) return
    ;(async () => {
      setLoadingStream(true)
      setStreamError(null)
      try {
        const res = await fetch(`/api/stream?id=${channel.id}`)
        if (res.redirected) {
          setStreamUrl(res.url)
          setReady(true)
        } else {
          const data = await res.json()
          setStreamError(data.error || 'Failed to get stream')
        }
      } catch (e) {
        setStreamError(e.message)
      } finally {
        setLoadingStream(false)
      }
    })()
  }, [channel])

  // If it's a match stream
  const isChannel = !!channel
  const sources = match?.sources || []
  const home = match?.teams?.home?.name || channel?.name || ''
  const away = match?.teams?.away?.name || ''

  // Group sources by language
  const grouped = sources.reduce((acc, src) => {
    const key = src.language || 'Unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(src)
    return acc
  }, {})

  const getLangName = (full) => {
    const p = full.split(' - ')
    return `${p[0]}${p[1] ? ` — ${p[1]}` : ''}`
  }

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: '#000', zIndex: 1000,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '8px 12px', background: '#0a0a12', borderBottom: '1px solid #1e1e2e',
        zIndex: 1001,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <button onClick={onClose || onBack} style={{
            background: '#1a1a2e', border: 'none', color: '#aaa', width: 32, height: 32,
            borderRadius: 8, cursor: 'pointer', fontSize: 18, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>✕</button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isChannel ? `📺 ${channel.name}` : `${home} vs ${away}`}
            </div>
          </div>
        </div>
      </div>

      {/* Video Area */}
      {(isChannel && !channel) || (!isChannel && !selectedSource) ? (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a12',
        }}>
          <div style={{ textAlign: 'center', color: '#555' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📺</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{isChannel ? 'Memuat stream...' : 'Pilih Channel'}</div>
            <div style={{ fontSize: 12, color: '#444' }}>
              {isChannel ? 'Menghubungkan ke server...' : 'Klik salah satu stream di bawah'}
            </div>
          </div>
        </div>
      ) : null}

      {/* Channel loading */}
      {isChannel && loadingStream && (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000',
        }}>
          <div style={{ textAlign: 'center', color: '#555' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
            <div style={{ fontSize: 14 }}>Connecting to stream...</div>
          </div>
        </div>
      )}

      {/* Channel error */}
      {isChannel && streamError && (
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a12',
        }}>
          <div style={{ textAlign: 'center', color: '#ff6b6b' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>❌</div>
            <div style={{ fontSize: 14 }}>Stream Error</div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 6 }}>{streamError}</div>
          </div>
        </div>
      )}

      {/* Channel stream iframe/player */}
      {isChannel && streamUrl && !loadingStream && (
        <div style={{ flex: 1, position: 'relative', background: '#000' }}>
          {streamUrl.includes('.ts') || streamUrl.includes('.m3u8') ? (
            <video controls autoPlay style={{ width: '100%', height: '100%' }} playsInline>
              <source src={streamUrl} />
            </video>
          ) : (
            <iframe
              src={streamUrl}
              style={{ width: '100%', height: '100%', border: 'none' }}
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture"
            />
          )}
        </div>
      )}

      {/* Match stream iframe */}
      {!isChannel && selectedSource && (
        <div style={{ flex: 1, position: 'relative', background: '#000' }}>
          <iframe
            key={selectedSource.embedUrl}
            src={selectedSource.embedUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      {/* Match source selector */}
      {!isChannel && sources.length > 0 && (
        <div style={{
          background: '#0a0a12', borderTop: '1px solid #1e1e2e',
          maxHeight: '35vh', overflowY: 'auto', zIndex: 1001,
        }}>
          <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e1e2e',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <span style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>
              📡 Channel ({sources.length} tersedia)
            </span>
          </div>
          <div style={{ padding: 8 }}>
            {Object.entries(grouped).map(([lang, srcs]) => (
              <div key={lang} style={{ marginBottom: 4 }}>
                <div style={{ fontSize: 10, color: '#666', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, padding: '4px 8px' }}>
                  {getLangName(lang)}
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 8px' }}>
                  {srcs.map((src, i) => {
                    const isActive = selectedSource?.embedUrl === src.embedUrl
                    return (
                      <button key={i} onClick={() => onSelectSource(src)} style={{
                        padding: '7px 14px', borderRadius: 6,
                        border: isActive ? '2px solid #00e676' : '1px solid #2a2a3e',
                        background: isActive ? '#00e67618' : '#1a1a2e',
                        color: isActive ? '#00e676' : '#999',
                        cursor: 'pointer', fontWeight: 600, fontSize: 11,
                      }}>
                        {src.hd ? '🔷' : '🔹'} S{src.streamNo} {src.hd ? 'HD' : 'SD'}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
