'use client'

import { useState } from 'react'

export default function StreamPlayer({ match, selectedSource, onSelectSource, onClose }) {
  const [ready, setReady] = useState(false)

  const sources = match.sources || []
  const home = match.teams?.home?.name || ''
  const away = match.teams?.away?.name || ''

  // Group by language
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

  const loadStream = (src) => {
    onSelectSource(src)
    setReady(true)
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
          <button onClick={onClose} style={{
            background: '#1a1a2e', border: 'none', color: '#aaa', width: 32, height: 32,
            borderRadius: 8, cursor: 'pointer', fontSize: 18, display: 'flex',
            alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>✕</button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {home} vs {away}
            </div>
            {selectedSource && (
              <div style={{ fontSize: 11, color: '#888' }}>
                📺 {selectedSource.language}
                {selectedSource.hd ? ' • HD' : ' • SD'}
                {' • Stream ' + selectedSource.streamNo}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div style={{
        flex: 1, position: 'relative', background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {!selectedSource && (
          <div style={{ textAlign: 'center', color: '#555', padding: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📺</div>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Pilih Channel</div>
            <div style={{ fontSize: 12, color: '#444' }}>Klik salah satu stream di bawah untuk mulai nonton</div>
          </div>
        )}

        {selectedSource && (
          <iframe
            key={selectedSource.embedUrl}
            src={selectedSource.embedUrl}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) }
      </div>

      {/* Source selector - bottom panel */}
      <div style={{
        background: '#0a0a12', borderTop: '1px solid #1e1e2e',
        maxHeight: '35vh', overflowY: 'auto',
        zIndex: 1001,
      }}>
        <div style={{
          padding: '8px 12px', borderBottom: '1px solid #1e1e2e',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <span style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>
            📡 Channel ({sources.length} tersedia)
          </span>
          <span style={{ fontSize: 10, color: '#555' }}>
            ⚡ Klik untuk langsung tonton
          </span>
        </div>
        <div style={{ padding: 8 }}>
          {Object.entries(grouped).map(([lang, srcs]) => (
            <div key={lang} style={{ marginBottom: 4 }}>
              <div style={{
                fontSize: 10, color: '#666', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: 1, padding: '4px 8px',
              }}>
                {getLangName(lang)}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 8px' }}>
                {srcs.map((src, i) => {
                  const isActive = selectedSource?.embedUrl === src.embedUrl
                  return (
                    <button
                      key={i}
                      onClick={() => loadStream(src)}
                      style={{
                        padding: '7px 14px', borderRadius: 6,
                        border: isActive ? '2px solid #00e676' : '1px solid #2a2a3e',
                        background: isActive ? '#00e67618' : '#1a1a2e',
                        color: isActive ? '#00e676' : '#999',
                        cursor: 'pointer', fontWeight: 600, fontSize: 11,
                        transition: 'all 0.15s',
                      }}
                    >
                      {src.hd ? '🔷' : '🔹'} S{src.streamNo} {src.hd ? 'HD' : 'SD'}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
