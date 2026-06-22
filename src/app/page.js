'use client'

import { useState } from 'react'

export default function Home() {
  const [search, setSearch] = useState('')
  const [filterSport, setFilterSport] = useState('Semua')

  const channels = [
    // 🌍 WORLD CUP 2026
    { name: 'TVRI Nasional', sport: 'World Cup', type: 'Free', quality: 'HD', region: 'Indonesia', url: 'https://tvri.go.id/live', src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8' },
    { name: 'beIN Sports USA', sport: 'World Cup', type: 'IPTV', quality: 'FHD', region: 'USA', src: 'http://23.237.104.106:8080/USA_BEIN/index.m3u8' },
    { name: 'beIN SPORTS XTRA', sport: 'World Cup', type: 'Free', quality: 'HD', region: 'Global', src: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8' },
    { name: 'Fox Sports 1', sport: 'World Cup', type: 'IPTV', quality: 'FHD', region: 'USA', src: 'https://cors-proxy.cooks.fyi/http://190.11.225.124:5000/live/fs1_hd/playlist.m3u8' },
    { name: 'CBS Sports HQ', sport: 'World Cup', type: 'Free', quality: 'HD', region: 'USA', src: 'https://propee33f9c2.airspace-cdn.cbsivideo.com/index.m3u8' },
    { name: 'DAZN TV', sport: 'World Cup', type: 'Free', quality: 'HD', region: 'Global', src: 'https://jmp2.uk/plu-647f07e74cfc2c0008a2e557.m3u8' },

    // ⚽ UEFA CHAMPIONS LEAGUE
    { name: 'Fox Sports 2', sport: 'UCL', type: 'IPTV', quality: 'FHD', region: 'USA', src: 'https://tvsen7.aynaott.com/foxsports2/index.m3u8' },
    { name: 'Trans TV', sport: 'UCL', type: 'Free', quality: 'HD', region: 'Indonesia', url: 'https://transtv.co.id/live', src: 'https://video.detik.com/transtv/smil:transtv.smil/index.m3u8' },
    { name: 'Trans7', sport: 'UCL', type: 'Free', quality: 'HD', region: 'Indonesia', url: 'https://trans7.co.id/live', src: 'https://video.detik.com/trans7/smil:trans7.smil/index.m3u8' },
    { name: 'Metro TV', sport: 'UCL', type: 'Free', quality: 'HD', region: 'Indonesia', url: 'https://metrotv.com/live', src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8' },
    { name: 'ESPNU', sport: 'UCL', type: 'IPTV', quality: 'FHD', region: 'USA', src: 'http://23.237.104.106:8080/USA_ESPNU/index.m3u8' },
    { name: 'CBS Sports Golazo', sport: 'UCL', type: 'Free', quality: 'HD', region: 'USA', src: 'https://proped3fhg87.airspace-cdn.cbsivideo.com/golazo-live-dai/master/golazo-live-dai.m3u8' },

    // 🏴󠁧󠁢󠁥󠁮󠁧󠁿 PREMIER LEAGUE
    { name: 'NBC Sports NOW', sport: 'Premier League', type: 'Free', quality: 'HD', region: 'USA', src: 'https://d4whmvwm0rdvi.cloudfront.net/10007/99993008/hls/master.m3u8' },
    { name: 'ESPN Deportes', sport: 'Premier League', type: 'Free', quality: 'HD', region: 'USA', src: 'http://origin.thetvapp.to/hls/espn-deportes/mono.m3u8' },
    { name: 'Fox Sports', sport: 'Premier League', type: 'Free', quality: 'HD', region: 'USA', src: 'https://live-manifest.production-public.tubi.io/live/6035c7fd-efff-4ec7-93dc-aa0c7a58ba47/playlist.m3u8' },
    { name: 'SCTV', sport: 'Premier League', type: 'IPTV', quality: 'HD', region: 'Indonesia', url: 'https://sctv.co.id/live' },

    // 🇪🇸 LA LIGA
    { name: 'beIN Sports USA', sport: 'La Liga', type: 'IPTV', quality: 'FHD', region: 'USA', src: 'http://23.237.104.106:8080/USA_BEIN/index.m3u8' },
    { name: 'ESPN8 The Ocho', sport: 'La Liga', type: 'Free', quality: 'HD', region: 'USA', src: 'https://d3b6q2ou5kp8ke.cloudfront.net/ESPNTheOcho.m3u8' },
    { name: 'Indosiar', sport: 'La Liga', type: 'IPTV', quality: 'HD', region: 'Indonesia', url: 'https://indosiar.com/live' },

    // 🇮🇹 SERIE A
    { name: 'beIN SPORTS XTRA', sport: 'Serie A', type: 'Free', quality: 'HD', region: 'Global', src: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8' },
    { name: 'Fox Sports 2', sport: 'Serie A', type: 'IPTV', quality: 'FHD', region: 'USA', src: 'https://tvsen7.aynaott.com/foxsports2/index.m3u8' },
    { name: 'RCTI', sport: 'Serie A', type: 'IPTV', quality: 'HD', region: 'Indonesia', url: 'https://rcti.tv/live' },

    // 🇩🇪 BUNDESLIGA
    { name: 'ESPNU', sport: 'Bundesliga', type: 'IPTV', quality: 'FHD', region: 'USA', src: 'http://23.237.104.106:8080/USA_ESPNU/index.m3u8' },
    { name: 'Fox Sports', sport: 'Bundesliga', type: 'Free', quality: 'HD', region: 'USA', src: 'https://live-manifest.production-public.tubi.io/live/6035c7fd-efff-4ec7-93dc-aa0c7a58ba47/playlist.m3u8' },

    // 🇮🇩 LIGA 1
    { name: 'TVRI Nasional', sport: 'Liga 1', type: 'Free', quality: 'HD', region: 'Indonesia', url: 'https://tvri.go.id/live', src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8' },
    { name: 'CNN Indonesia', sport: 'Liga 1', type: 'Free', quality: 'HD', region: 'Indonesia', src: 'https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/chunklist_w2099542994_b384000_sleng.m3u8' },
    { name: 'Metro TV', sport: 'Liga 1', type: 'Free', quality: 'HD', region: 'Indonesia', url: 'https://metrotv.com/live', src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8' },
    { name: 'RRI Net', sport: 'Liga 1', type: 'Free', quality: 'HD', region: 'Indonesia', src: 'https://private-streaming.rri.go.id/memfs/6f77c7b5-feb2-4935-9f89-e7e9fca0a54a_output_0.m3u8' },

    // 🥊 UFC / BOXING
    { name: 'DAZN Combat', sport: 'UFC', type: 'Free', quality: 'HD', region: 'Global', src: 'https://dazn-combat-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-dazn-combat-rakuten/CDN/master.m3u8' },
    { name: 'ESPN8 The Ocho', sport: 'UFC', type: 'Free', quality: 'HD', region: 'USA', src: 'https://d3b6q2ou5kp8ke.cloudfront.net/ESPNTheOcho.m3u8' },
    { name: 'Fox Sports 1', sport: 'UFC', type: 'IPTV', quality: 'FHD', region: 'USA', src: 'https://cors-proxy.cooks.fyi/http://190.11.225.124:5000/live/fs1_hd/playlist.m3u8' },

    // 🏀 NBA
    { name: 'ESPNU', sport: 'NBA', type: 'IPTV', quality: 'FHD', region: 'USA', src: 'http://23.237.104.106:8080/USA_ESPNU/index.m3u8' },
    { name: 'NBC Sports NOW', sport: 'NBA', type: 'Free', quality: 'HD', region: 'USA', src: 'https://d4whmvwm0rdvi.cloudfront.net/10007/99993008/hls/master.m3u8' },
  ]

  const sports = [...new Set(channels.map(c => c.sport))]
  
  const filtered = channels.filter(c => {
    const matchSport = filterSport === 'Semua' || c.sport === filterSport
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                        c.sport.toLowerCase().includes(search.toLowerCase()) ||
                        c.region.toLowerCase().includes(search.toLowerCase())
    return matchSport && matchSearch
  })

  const getBadgeColor = (type) => {
    switch(type) {
      case 'Free': return { bg: '#00e67618', text: '#00e676', border: '#00e67633' }
      case 'IPTV': return { bg: '#ffd70018', text: '#ffd700', border: '#ffd70033' }
      default: return { bg: '#333', text: '#aaa', border: '#333' }
    }
  }

  const getQualityColor = (q) => {
    switch(q) {
      case 'FHD': return '#ffd700'
      case 'HD': return '#00e676'
      default: return '#888'
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a12 0%, #0f0f1a 50%, #0a0a12 100%)',
      color: '#e0e0e0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Header */}
      <div style={{
        borderBottom: '1px solid #1a1a2e',
        padding: '30px 20px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, margin: 0, letterSpacing: -1 }}>
          📡 <span style={{ background: 'linear-gradient(135deg, #00e676, #00c853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sport</span>Channel
        </h1>
        <p style={{ color: '#666', margin: '6px 0 16px', fontSize: 13 }}>
          {channels.length} channel • {sports.length} kompetisi • Direktori Live Streaming
        </p>

        {/* Search */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <input
            placeholder="🔍 Cari channel, liga, atau region..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              padding: '10px 16px',
              borderRadius: 8,
              border: '1px solid #2a2a3e',
              background: '#12121a',
              color: '#fff',
              fontSize: 13,
              width: 280,
              maxWidth: '100%',
              outline: 'none',
            }}
          />
        </div>

        {/* Filter Tags */}
        <div style={{ marginTop: 14, display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => setFilterSport('Semua')} style={{
            padding: '5px 12px', borderRadius: 20, border: '1px solid', fontSize: 11, fontWeight: 700, cursor: 'pointer',
            background: filterSport === 'Semua' ? '#00e67620' : '#1a1a2e',
            color: filterSport === 'Semua' ? '#00e676' : '#888',
            borderColor: filterSport === 'Semua' ? '#00e67644' : '#2a2a3e',
          }}>Semua</button>
          {sports.map(s => (
            <button key={s} onClick={() => setFilterSport(s)} style={{
              padding: '5px 12px', borderRadius: 20, border: '1px solid', fontSize: 11, fontWeight: 700, cursor: 'pointer',
              background: filterSport === s ? '#00e67620' : '#1a1a2e',
              color: filterSport === s ? '#00e676' : '#888',
              borderColor: filterSport === s ? '#00e67644' : '#2a2a3e',
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Channel Grid */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {filtered.map((ch, i) => {
            const b = getBadgeColor(ch.type)
            return (
              <div key={i} style={{
                background: '#12121a',
                border: '1px solid #1e1e2e',
                borderRadius: 12,
                padding: '14px 16px',
                transition: 'all 0.2s',
                cursor: 'default',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>{ch.name}</div>
                    <div style={{ fontSize: 11, color: '#666', marginTop: 3 }}>{ch.sport}</div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 800, color: getQualityColor(ch.quality), border: `1px solid ${getQualityColor(ch.quality)}33`, padding: '2px 6px', borderRadius: 4 }}>
                    {ch.quality}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: b.bg, color: b.text, border: `1px solid ${b.border}` }}>
                    {ch.type}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: '#1a1a2e', color: '#888', border: '1px solid #2a2a3e' }}>
                    {ch.region}
                  </span>
                </div>
                <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                  {ch.src && (
                    <a href={ch.src} target="_blank" rel="noopener noreferrer" style={{
                      padding: '5px 12px',
                      borderRadius: 6,
                      background: '#00e676',
                      color: '#000',
                      fontSize: 11,
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>📡 M3U8</a>
                  )}
                  {ch.url && (
                    <a href={ch.url} target="_blank" rel="noopener noreferrer" style={{
                      padding: '5px 12px',
                      borderRadius: 6,
                      background: '#1a1a2e',
                      color: '#aaa',
                      fontSize: 11,
                      fontWeight: 600,
                      textDecoration: 'none',
                      border: '1px solid #2a2a3e',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}>🌐 Situs</a>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
            ❌ Gak ada channel yang cocok dengan pencarian lo
          </div>
        )}

        {/* Footer */}
        <footer style={{ marginTop: 40, textAlign: 'center', color: '#444', fontSize: 12, borderTop: '1px solid #1a1a2e', paddingTop: 30 }}>
          <p>⚠️ Link bersumber dari publik. Hak siar milik pemilik masing-masing.</p>
          <p style={{ marginTop: 4 }}>Direktori channel sport — bukan penyedia streaming resmi.</p>
          <p style={{ marginTop: 16, color: '#333' }}>Powered by Nyxar X Breach 🔓💀</p>
        </footer>
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0a0a12; }
        ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 3px; }
        * { box-sizing: border-box; }
        body { margin: 0; }
      `}</style>
    </div>
  )
}
