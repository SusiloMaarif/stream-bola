'use client'

export default function MatchCard({ match, isLive, dateStr, onClick }) {
  const home = match.teams?.home?.name || 'TBD'
  const away = match.teams?.away?.name || 'TBD'
  const homeBadge = match.teams?.home?.badge
  const awayBadge = match.teams?.away?.badge

  return (
    <div
      onClick={onClick}
      style={{
        background: isLive ? 'linear-gradient(135deg, #12121a 0%, #1a0e0e 100%)' : '#12121a',
        borderRadius: 14,
        border: isLive ? '1px solid #ff333322' : '1px solid #1e1e2e',
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = isLive ? '#ff444466' : '#333'}
      onMouseLeave={e => e.currentTarget.style.borderColor = isLive ? '#ff333322' : '#1e1e2e'}
    >
      {/* Live indicator */}
      {isLive && (
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          padding: '3px 10px',
          background: '#ff000033',
          color: '#ff4444',
          fontSize: 10,
          fontWeight: 700,
          borderRadius: '0 14px 0 8px',
          letterSpacing: 1,
        }}>
          🔴 LIVE
        </div>
      )}

      {/* League info */}
      <div style={{
        fontSize: 11,
        color: isLive ? '#ff8866' : '#00e676',
        fontWeight: 600,
        marginBottom: 8,
        letterSpacing: 0.5,
      }}>
        {match.title.includes(' vs ') ? match.title.split(' vs ').length > 1 ? '🏆 Pertandingan' : match.title : match.title}
      </div>

      {/* Teams */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
          {homeBadge && (
            <img
              src={homeBadge}
              alt={home}
              style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'contain' }}
              onError={e => e.target.style.display = 'none'}
            />
          )}
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: isLive ? '#fff' : '#e0e0e0',
          }}>
            {home}
          </span>
        </div>

        <div style={{
          background: isLive ? '#ff000022' : '#1a1a2e',
          padding: '3px 10px',
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 700,
          color: isLive ? '#ff6666' : '#666',
        }}>
          VS
        </div>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
          <span style={{
            fontSize: 15,
            fontWeight: 600,
            color: isLive ? '#fff' : '#e0e0e0',
          }}>
            {away}
          </span>
          {awayBadge && (
            <img
              src={awayBadge}
              alt={away}
              style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'contain' }}
              onError={e => e.target.style.display = 'none'}
            />
          )}
        </div>
      </div>

      {/* Date/Time */}
      <div style={{
        marginTop: 8,
        fontSize: 11,
        color: isLive ? '#ff8866' : '#666',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}>
        <span>{dateStr}</span>
        <span style={{ color: '#333' }}>•</span>
        <span style={{ color: '#00e67655', fontSize: 10 }}>Klik untuk nonton ▶</span>
      </div>
    </div>
  )
}
