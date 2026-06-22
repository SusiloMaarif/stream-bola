'use client'

import { useState, useEffect } from 'react'
import MatchCard from '@/components/MatchCard'
import SourcesPanel from '@/components/SourcesPanel'

export default function Home() {
  const [matches] = useState([
    {
      id: 1,
      league: '🏆 FIFA World Cup 2026 — Final',
      home: 'Brazil',
      away: 'Argentina',
      time: '20:00 WIB',
      date: 'Sabtu, 27 Juni 2026',
      badge: '🔴 LIVE',
      channels: [
        { name: 'TVRI Nasional', src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8', type: 'm3u8' },
        { name: 'beIN Sports USA', src: 'http://23.237.104.106:8080/USA_BEIN/index.m3u8', type: 'm3u8' },
        { name: 'Fox Sports 1', src: 'https://cors-proxy.cooks.fyi/http://190.11.225.124:5000/live/fs1_hd/playlist.m3u8', type: 'm3u8' },
      ]
    },
    {
      id: 2,
      league: '🏆 FIFA World Cup 2026 — Semi Final',
      home: 'Portugal',
      away: 'France',
      time: '02:00 WIB',
      date: 'Minggu, 29 Juni 2026',
      badge: '🔴 LIVE',
      channels: [
        { name: 'beIN SPORTS XTRA', src: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8', type: 'm3u8' },
        { name: 'CBS Sports HQ', src: 'https://propee33f9c2.airspace-cdn.cbsivideo.com/index.m3u8', type: 'm3u8' },
        { name: 'DAZN TV', src: 'https://jmp2.uk/plu-647f07e74cfc2c0008a2e557.m3u8', type: 'm3u8' },
      ]
    },
    {
      id: 3,
      league: '⚽ UEFA Champions League — Semi Final',
      home: 'Real Madrid',
      away: 'Manchester City',
      time: '03:00 WIB',
      date: 'Rabu, 2 Juli 2026',
      badge: '🔴 LIVE',
      channels: [
        { name: 'Fox Sports 2', src: 'https://tvsen7.aynaott.com/foxsports2/index.m3u8', type: 'm3u8' },
        { name: 'Trans TV', src: 'https://video.detik.com/transtv/smil:transtv.smil/index.m3u8', type: 'm3u8' },
        { name: 'Metro TV', src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8', type: 'm3u8' },
      ]
    },
    {
      id: 4,
      league: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League — Matchday 38',
      home: 'Liverpool',
      away: 'Arsenal',
      time: '23:30 WIB',
      date: 'Sabtu, 28 Juni 2026',
      badge: '🔴 LIVE',
      channels: [
        { name: 'NBC Sports NOW', src: 'https://d4whmvwm0rdvi.cloudfront.net/10007/99993008/hls/master.m3u8', type: 'm3u8' },
        { name: 'ESPNU', src: 'http://23.237.104.106:8080/USA_ESPNU/index.m3u8', type: 'm3u8' },
        { name: 'CBS Sports Golazo', src: 'https://proped3fhg87.airspace-cdn.cbsivideo.com/golazo-live-dai/master/golazo-live-dai.m3u8', type: 'm3u8' },
      ]
    },
    {
      id: 5,
      league: '🇪🇸 La Liga — El Clasico',
      home: 'Barcelona',
      away: 'Real Madrid',
      time: '02:00 WIB',
      date: 'Minggu, 29 Juni 2026',
      badge: '🔴 LIVE',
      channels: [
        { name: 'ESPN Deportes', src: 'http://origin.thetvapp.to/hls/espn-deportes/mono.m3u8', type: 'm3u8' },
        { name: 'beIN Sports USA', src: 'http://23.237.104.106:8080/USA_BEIN/index.m3u8', type: 'm3u8' },
        { name: 'Trans7', src: 'https://video.detik.com/trans7/smil:trans7.smil/index.m3u8', type: 'm3u8' },
      ]
    },
    {
      id: 6,
      league: '🇮🇩 Liga 1 Indonesia — El Clasico Indonesia',
      home: 'Persija Jakarta',
      away: 'Persib Bandung',
      time: '15:00 WIB',
      date: 'Minggu, 29 Juni 2026',
      badge: '🔴 LIVE',
      channels: [
        { name: 'TVRI Nasional', src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8', type: 'm3u8' },
        { name: 'Metro TV', src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8', type: 'm3u8' },
        { name: 'CNN Indonesia', src: 'https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/chunklist_w2099542994_b384000_sleng.m3u8', type: 'm3u8' },
      ]
    },
    {
      id: 7,
      league: '🔵 DAZN Combat — UFC 350',
      home: 'McGregor',
      away: 'Chandler',
      time: '09:00 WIB',
      date: 'Minggu, 29 Juni 2026',
      badge: '🔴 LIVE',
      channels: [
        { name: 'DAZN Combat', src: 'https://dazn-combat-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-dazn-combat-rakuten/CDN/master.m3u8', type: 'm3u8' },
        { name: 'ESPN8 The Ocho', src: 'https://d3b6q2ou5kp8ke.cloudfront.net/ESPNTheOcho.m3u8', type: 'm3u8' },
      ]
    },
    {
      id: 8,
      league: '🇮🇹 Serie A — Juventus vs Inter',
      home: 'Juventus',
      away: 'Inter Milan',
      time: '01:45 WIB',
      date: 'Selasa, 1 Juli 2026',
      badge: '📅 UPCOMING',
      channels: [
        { name: 'beIN SPORTS XTRA', src: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8', type: 'm3u8' },
        { name: 'Fox Sports', src: 'https://live-manifest.production-public.tubi.io/live/6035c7fd-efff-4ec7-93dc-aa0c7a58ba47/playlist.m3u8', type: 'm3u8' },
      ]
    },
  ])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a12 0%, #0f0f1a 50%, #0a0a12 100%)',
      color: '#e0e0e0',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(180deg, #00e67615 0%, transparent 100%)',
        borderBottom: '1px solid #1a1a2e',
        padding: '40px 20px 30px',
        textAlign: 'center',
      }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, margin: 0, letterSpacing: -1 }}>
          ⚽ <span style={{ background: 'linear-gradient(135deg, #00e676, #00c853)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stream</span>Bola
        </h1>
        <p style={{ color: '#666', margin: '8px 0 0', fontSize: 14, fontWeight: 500 }}>
          🏆 FIFA World Cup 2026 • Live Streaming • HD Quality
        </p>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          {['World Cup', 'UCL', 'Premier League', 'La Liga', 'Liga 1'].map(tag => (
            <span key={tag} style={{
              padding: '4px 14px',
              borderRadius: 20,
              background: '#1a1a2e',
              border: '1px solid #2a2a3e',
              fontSize: 12,
              color: '#aaa',
              fontWeight: 600,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Match List */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '20px 16px 40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {matches.map(m => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>

        {/* Sources Panel */}
        <SourcesPanel />

        {/* Footer */}
        <footer style={{ marginTop: 40, textAlign: 'center', color: '#444', fontSize: 12, borderTop: '1px solid #1a1a2e', paddingTop: 30 }}>
          <p>⚠️ Semua link streaming bersumber dari publik. Hak siar milik pemilik masing-masing.</p>
          <p style={{ marginTop: 4 }}>Gunakan VPN Indonesia untuk channel yang di-geo-block.</p>
          <p style={{ marginTop: 16, color: '#333' }}>Powered by Nyxar X Breach 🔓💀</p>
        </footer>
      </div>
    </div>
  )
}
