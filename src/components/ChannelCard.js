'use client'

import { useState } from 'react'

export default function ChannelCard({ channel, onPlay }) {
  const [isHover, setIsHover] = useState(false)

  return (
    <div
      onClick={() => onPlay(channel)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      style={{
        background: isHover 
          ? 'linear-gradient(135deg, #16162a 0%, #1a1a32 100%)' 
          : 'linear-gradient(135deg, #12121a 0%, #16161e 100%)',
        borderRadius: 12,
        border: isHover ? '1px solid #00e67644' : '1px solid #1e1e2e',
        padding: '16px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'center',
        userSelect: 'none',
        transform: isHover ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: isHover ? '0 4px 20px rgba(0,230,118,0.08)' : 'none',
      }}
    >
      {/* Channel Logo / Emoji */}
      <div style={{ fontSize: 36, marginBottom: 8, lineHeight: 1, filter: isHover ? 'brightness(1.2)' : 'none' }}>
        {channel.logo}
      </div>
      
      {/* Channel Name */}
      <div style={{ 
        fontSize: 13, 
        fontWeight: 600, 
        color: isHover ? '#fff' : '#e0e0e0',
        transition: 'color 0.2s',
        marginBottom: 4,
      }}>
        {channel.name}
      </div>
      
      {/* Status Badge */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, alignItems: 'center', marginTop: 4 }}>
        {channel.verified && (
          <span style={{ fontSize: 10, color: '#00e676', fontWeight: 600, background: '#00e67615', padding: '2px 8px', borderRadius: 10 }}>
            ✅ Resmi
          </span>
        )}
        {channel.category === 'Indonesia' && (
          <span style={{ fontSize: 10, color: '#00aaff', fontWeight: 600, background: '#00aaff15', padding: '2px 8px', borderRadius: 10 }}>
            🇮🇩 FREE
          </span>
        )}
        {channel.category === 'Sports' && (
          <span style={{ fontSize: 10, color: '#ff6b6b', fontWeight: 600, background: '#ff6b6b15', padding: '2px 8px', borderRadius: 10 }}>
            ⚽ SPORT
          </span>
        )}
      </div>

      {/* Type indicator */}
      <div style={{ fontSize: 10, color: '#555', marginTop: 6 }}>
        {channel.type === 'youtube' ? '▶️ YouTube' : 
         channel.type === 'm3u8' ? '📡 HLS' :
         channel.type === 'iframe' ? '🔗 Embed' : ''}
        {channel.type === 'm3u8' && !channel.verified && ' • Maybe Geo-blocked'}
      </div>
    </div>
  )
}
