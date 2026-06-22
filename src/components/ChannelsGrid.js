'use client'

export default function ChannelsGrid({ channels, onPlay }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
      gap: 12,
    }}>
      {channels.map(ch => (
        <button
          key={ch.id}
          onClick={() => onPlay(ch)}
          style={{
            background: '#12121a',
            border: '1px solid #1e1e2e',
            borderRadius: 14,
            padding: '20px 14px',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s',
            color: '#e0e0e0',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#00e67644'
            e.currentTarget.style.background = '#181828'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#1e1e2e'
            e.currentTarget.style.background = '#12121a'
          }}
        >
          {/* HD Badge */}
          {ch.hd && (
            <span style={{
              position: 'absolute',
              top: 8, right: 8,
              fontSize: 9,
              fontWeight: 800,
              background: '#00e67620',
              color: '#00e676',
              padding: '2px 6px',
              borderRadius: 4,
              border: '1px solid #00e67630',
            }}>HD</span>
          )}

          {/* Logo/Icon */}
          <div style={{ fontSize: 36, marginBottom: 10, lineHeight: 1 }}>
            {ch.logo}
          </div>

          {/* Nama */}
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>
            {ch.name}
          </div>

          {/* Language */}
          <div style={{ fontSize: 10, color: '#555' }}>
            {ch.lang}
          </div>

          {/* Play overlay on hover */}
          <div style={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            padding: '6px 0',
            fontSize: 11,
            color: '#00e676',
            fontWeight: 600,
            opacity: 0.8,
          }}>
            ▶ Klik putar
          </div>
        </button>
      ))}
    </div>
  )
}
