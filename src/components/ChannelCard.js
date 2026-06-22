'use client'

export default function ChannelCard({ channel, isActive, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: '16px 12px',
        borderRadius: 12,
        border: isActive ? '2px solid #00e676' : '1px solid #1e1e2e',
        background: isActive ? '#00e67610' : '#12121a',
        cursor: 'pointer',
        transition: 'all 0.2s',
        minHeight: 100,
        position: 'relative',
      }}
    >
      {/* Online indicator */}
      <div style={{
        position: 'absolute',
        top: 8,
        right: 8,
        width: 8,
        height: 8,
        borderRadius: '50%',
        background: '#00e676',
        boxShadow: '0 0 6px #00e676',
      }} />
      
      {/* Logo */}
      <div style={{ fontSize: 28 }}>{channel.logo}</div>
      
      {/* Name */}
      <div style={{
        fontSize: 12,
        fontWeight: 700,
        color: isActive ? '#00e676' : '#ccc',
        textAlign: 'center',
        lineHeight: 1.3,
      }}>
        {channel.name}
      </div>

      {/* Language badge */}
      <div style={{
        fontSize: 10,
        fontWeight: 700,
        color: '#555',
        padding: '2px 8px',
        borderRadius: 4,
        background: '#1a1a2e',
        border: '1px solid #2a2a3e',
      }}>
        {channel.lang === 'ID' ? '🇮🇩 ID' : '🌍 EN'}
      </div>
    </button>
  )
}
