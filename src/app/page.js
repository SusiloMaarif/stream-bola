'use client'

import { useState, useEffect } from 'react'
import MatchCard from '@/components/MatchCard'
import SourcesPanel from '@/components/SourcesPanel'

export default function Home() {
  const [matches, setMatches] = useState([
    {
      id: 1,
      league: '⚽ Piala Dunia 2026',
      home: 'Argentina',
      away: 'Brazil',
      time: '20:00 WIB',
      date: 'Hari Ini',
      channels: [
        { 
          name: 'TVRI Sport HD', 
          src: 'https://tvrijakarta-i.akamaihd.net/hls/live/791232/tvrijktv3/playlist.m3u8',
          type: 'm3u8'
        },
        { 
          name: 'CNN Indonesia', 
          src: 'https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/chunklist_w2099542994_b384000_sleng.m3u8',
          type: 'm3u8'
        },
      ]
    },
    {
      id: 2,
      league: '🏆 Premier League',
      home: 'Manchester United',
      away: 'Chelsea',
      time: '23:30 WIB',
      date: 'Nanti Malam',
      channels: [
        { name: 'SCTV HD', src: 'http://iptv12k.com:35461/654321/123456/3266', type: 'm3u8' },
        { name: 'Trans TV', src: 'http://iptv12k.com:35461/654321/123456/2183', type: 'm3u8' },
      ]
    },
    {
      id: 3,
      league: '🇮🇩 Liga 1',
      home: 'Persija Jakarta',
      away: 'Persib Bandung',
      time: '15:00 WIB',
      date: 'Besok',
      channels: [
        { name: 'Indosiar HD', src: 'http://iptv12k.com:35461/654321/123456/3270', type: 'm3u8' },
        { name: 'tvOne', src: 'http://iptv12k.com:35461/654321/123456/2181', type: 'm3u8' },
      ]
    },
    {
      id: 4,
      league: '🇪🇸 La Liga',
      home: 'Barcelona',
      away: 'Real Madrid',
      time: '02:00 WIB',
      date: 'Besok',
      channels: [
        { name: 'RCTI', src: 'http://iptv12k.com:35461/654321/123456/2185', type: 'm3u8' },
        { name: 'MNC TV', src: 'http://iptv12k.com:35461/654321/123456/2184', type: 'm3u8' },
      ]
    },
  ])

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h1 style={{ fontSize: 28, margin: 0 }}>
          ⚽ <span style={{ color: '#00e676' }}>Stream</span>Bola
        </h1>
        <div style={{ fontSize: 12, color: '#666' }}>Live Football Streaming</div>
      </header>

      {/* Match List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {matches.map(m => (
          <MatchCard key={m.id} match={m} />
        ))}
      </div>

      {/* Panel Sumber Channel */}
      <SourcesPanel />

      {/* Footer */}
      <footer style={{ marginTop: 50, textAlign: 'center', color: '#444', fontSize: 13 }}>
        <p>⚠️ Semua link bersumber dari publik. Hak cipta milik pemilik masing-masing.</p>
        <p style={{ fontSize: 11, marginTop: 5 }}>
          Gunakan VPN Indonesia jika streaming tidak berjalan.
        </p>
      </footer>
    </div>
  )
}
