'use client'

import { useState, useRef, useEffect } from 'react'

const CHANNELS = [
  { name: 'TVRI Nasional 🇮🇩', src: 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8' },
  { name: 'Metro TV 🇮🇩', src: 'https://edge.medcom.id/live-edge/smil:metro.smil/playlist.m3u8' },
  { name: 'CNN Indonesia 🇮🇩', src: 'https://live.cnnindonesia.com/livecnn/smil:cnntv.smil/chunklist_w2099542994_b384000_sleng.m3u8' },
  { name: 'CNBC Indonesia 🇮🇩', src: 'https://live.cnbcindonesia.com/livecnbc/smil:cnbctv.smil/chunklist.m3u8' },
  { name: 'Trans TV 🇮🇩', src: 'https://video.detik.com/transtv/smil:transtv.smil/index.m3u8' },
  { name: 'Trans7 🇮🇩', src: 'https://video.detik.com/trans7/smil:trans7.smil/index.m3u8' },
  { name: 'TVRI World 🇮🇩', src: 'https://ott-balancer.tvri.go.id/live/eds/Dunia/hls/Dunia.m3u8' },
  { name: 'RRI Net 🇮🇩', src: 'https://private-streaming.rri.go.id/live/rrinet/master.m3u8' },
  { name: 'TV Edukasi 🇮🇩', src: 'https://tve.kemdikbud.go.id/live/tve/tve.m3u8' },
  { name: '30A Golf 🏌️', src: 'https://30a-tv.com/feeds/vidaa/golf.m3u8' },
  { name: 'DraftKings Network 🏀', src: 'https://na.linear.zype.com/e0bd0e23-a958-4e43-8164-4f2fef8876a8/fd3614bd-90bf-4530-a277-65ae3a1720c8-zype/live.m3u8' },
  { name: 'NASA TV 🚀', src: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8' },
  { name: 'Bloomberg TV 💹', src: 'https://live-berglive.livebg.eu/out/u/1.m3u8' },
  { name: 'France 24 🇫🇷', src: 'https://france24-lh.akamaihd.net/i/f24_en_@89322/index_1200_av-p.m3u8' },
  { name: 'EuroNews 🌍', src: 'https://euronews-euronews-1-fra-1.cdn.jwplayer.com/hls/euronews_en/playlist.m3u8' },
  { name: 'DW News 🇩🇪', src: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8' },
  { name: 'Al Jazeera 🌍', src: 'https://live-hls-web-aja.getaj.net/VIA/index.m3u8' },
  { name: 'Reuters TV 📡', src: 'https://reuters-live-hls.s3-accelerate.amazonaws.com/out/v1/0405d6fe4c5a4dce8a1d9527a8e10639.m3u8' },
  { name: 'AFN Sports 🎖️', src: 'https://afn-iceberg.nos.pt/out/v1/afb87babe104432fbf6728d44e04793f/index.m3u8' },
  { name: 'USA Today Sports 🏈', src: 'https://content.uplynk.com/channel/00cf0819c6c44f2590098dfb3b1da0b1.m3u8' },
  { name: 'Astro SuperSport 🇲🇾', src: 'https://unifi-live05.secureswiftcontent.com/UnifiHD/live22.m3u8' },
  { name: 'beIN SPORTS XTRA 🌍', src: 'https://bein-xtra-bein.amagi.tv/playlist.m3u8' },
]

export default function Channels247({ onPlay }) {
  const [search, setSearch] = useState('')

  const filtered = search
    ? CHANNELS.filter(ch => ch.name.toLowerCase().includes(search.toLowerCase()))
    : CHANNELS

  return (
    <div>
      <input
        type="text" placeholder="🔍 Cari channel..."
        value={search} onChange={e => setSearch(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', borderRadius: 10,
          border: '1px solid #2a2a3e', background: '#12121a', color: '#e0e0e0',
          fontSize: 13, outline: 'none', boxSizing: 'border-box', marginBottom: 12 }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {filtered.map((ch, i) => (
          <button key={i} onClick={() => onPlay(ch)} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 10,
            border: '1px solid #1e1e2e', background: '#12121a',
            color: '#ccc', cursor: 'pointer', fontSize: 13, fontWeight: 500,
            textAlign: 'left', transition: 'all 0.15s',
          }}>
            <span style={{ fontSize: 14, width: 24, textAlign: 'center', flexShrink: 0 }}>📺</span>
            <span style={{ flex: 1 }}>{ch.name}</span>
            <span style={{ fontSize: 11, color: '#00e67655' }}>▶ Nonton</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 8, fontSize: 11, color: '#444', textAlign: 'center' }}>
        {CHANNELS.length} channel • Klik untuk nonton langsung
      </div>
    </div>
  )
}
