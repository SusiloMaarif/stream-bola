'use client'

export default function ChannelCard({ channel, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: '#12121a',
        border: '1px solid #1e1e2e',
        borderRadius: 12,
        padding: '16px 14px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'left',
        color: '#e0e0e0',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = '#1a1a2e'
        e.currentTarget.style.borderColor = '#00e67644'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = '#12121a'
        e.currentTarget.style.borderColor = '#1e1e2e'
      }}
    >
      <div style={{
        width: 40,
        height: 40,
        borderRadius: 10,
        background: '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        flexShrink: 0,
      }}>
        {channel.logo}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {channel.name}
        </div>
        <div style={{ fontSize: 11, color: '#555', marginTop: 2 }}>
          {channel.lang === 'id' ? '🇮🇩 Indonesia' : channel.lang === 'en' ? '🇬🇧 English' : '🇪🇸 Spanish'}
        </div>
      </div>
      <span style={{ fontSize: 12, color: '#00e676' }}>▶</span>
    </button>
  )
}
