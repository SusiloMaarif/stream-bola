'use client'

import { useState, useRef, useEffect } from 'react'

export default function PlayerModal({ match, selectedSource, onSelectSource, onClose }) {
  const [isLoading, setIsLoading] = useState(true)
  const iframeRef = useRef(null)

  const sources = match.sources || []
  const home = match.teams?.home?.name || ''
  const away = match.teams?.away?.name || ''

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [selectedSource])

  // Group sources by channel/language
  const groupedSources = sources.reduce((acc, src) => {
    const key = src.language || 'Unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(src)
    return acc
  }, {})

  // Extract just the channel name from language string
  const getChannelName = (lang) => {
    const parts = lang.split(' - ')
    return parts.length > 1 ? parts[1].trim() : lang
  }
  const getLanguage = (lang) => {
    const parts = lang.split(' - ')
    return parts[0].trim()
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: '#000',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '8px 12px',
        background: '#0a0a12',
        borderBottom: '1px solid #1e1e2e',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
          <button
            onClick={onClose}
            style={{
              background: '#1a1a2e',
              border: 'none',
              color: '#aaa',
              width: 32,
              height: 32,
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ✕
          </button>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {home} vs {away}
            </div>
            {selectedSource && (
              <div style={{ fontSize: 11, color: '#888' }}>
                📺 {selectedSource.language}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Player Area */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: '#000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#000',
            zIndex: 5,
            color: '#555',
            fontSize: 14,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>⏳</div>
              <div>Loading stream...</div>
              {selectedSource && (
                <div style={{ fontSize: 12, marginTop: 6, color: '#444' }}>
                  Source: {selectedSource.language} 
                  {selectedSource.hd ? ' • HD' : ' • SD'}
                </div>
              )}
            </div>
          </div>
        )}

        {selectedSource && (
          <iframe
            key={selectedSource.id + selectedSource.streamNo}
            ref={iframeRef}
            src={selectedSource.embedUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={() => setIsLoading(false)}
          />
        )}

        {!selectedSource && (
          <div style={{ textAlign: 'center', color: '#555' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📺</div>
            <div style={{ fontSize: 14 }}>Pilih sumber streaming di bawah</div>
          </div>
        )}
      </div>

      {/* Channel/Source Selector */}
      <div style={{
        background: '#0a0a12',
        borderTop: '1px solid #1e1e2e',
        maxHeight: '35vh',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '8px 12px', borderBottom: '1px solid #1e1e2e' }}>
          <span style={{ fontSize: 11, color: '#888', fontWeight: 600 }}>📡 Pilih Channel ({sources.length} tersedia)</span>
        </div>
        <div style={{ padding: '8px' }}>
          {Object.entries(groupedSources).map(([lang, srcs]) => (
            <div key={lang} style={{ marginBottom: 6 }}>
              <div style={{
                fontSize: 10,
                color: '#666',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 1,
                padding: '4px 8px',
              }}>
                {getLanguage(lang)} — {getChannelName(lang)}
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', padding: '0 8px' }}>
                {srcs.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => onSelectSource(src)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 6,
                      border: selectedSource?.id === src.id && selectedSource?.streamNo === src.streamNo
                        ? '2px solid #00e676'
                        : '1px solid #2a2a3e',
                      background: selectedSource?.id === src.id && selectedSource?.streamNo === src.streamNo
                        ? '#00e67618'
                        : '#1a1a2e',
                      color: selectedSource?.id === src.id && selectedSource?.streamNo === src.streamNo
                        ? '#00e676'
                        : '#999',
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 11,
                      transition: 'all 0.2s',
                    }}
                  >
                    {src.hd ? '🔷' : '🔹'} Stream {src.streamNo} {src.hd ? 'HD' : 'SD'}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
