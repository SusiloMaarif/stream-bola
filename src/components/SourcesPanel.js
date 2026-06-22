'use client'

import { useState } from 'react'

export default function SourcesPanel() {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginTop: 30, border: '1px solid #1e1e2e', borderRadius: 16, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          padding: '14px 20px',
          background: '#12121a',
          border: 'none',
          color: '#aaa',
          cursor: 'pointer',
          fontSize: 14,
          fontWeight: 600,
          textAlign: 'left',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span>📡 Sumber Channel & Cara Dapetin Link</span>
        <span style={{ fontSize: 11, color: '#00e676' }}>{open ? '▲ Tutup' : '▼ Buka'}</span>
      </button>

      {open && (
        <div style={{ padding: '20px', background: '#0e0e16', fontSize: 13, lineHeight: 1.8 }}>
          <h3 style={{ color: '#00e676', margin: '0 0 12px' }}>🌍 Sumber M3U Publik (Gratis)</h3>
          
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, margin: '0 0 6px' }}>1. iptv-org — 12,000+ channel global</p>
            <code style={{ background: '#1a1a2e', padding: '6px 10px', borderRadius: 6, display: 'block', fontSize: 12, wordBreak: 'break-all' }}>
              https://iptv-org.github.io/iptv/index.m3u
            </code>
            <p style={{ margin: '4px 0 0', color: '#888', fontSize: 12 }}>• Sport: <code style={{ background: '#1a1a2e', padding: '2px 6px', borderRadius: 4 }}>https://iptv-org.github.io/iptv/categories/sport.m3u</code></p>
            <p style={{ margin: '4px 0 0', color: '#888', fontSize: 12 }}>• Indonesia: <code style={{ background: '#1a1a2e', padding: '2px 6px', borderRadius: 4 }}>https://iptv-org.github.io/iptv/countries/id.m3u</code></p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, margin: '0 0 6px' }}>2. Riotryulianto/iptv-playlists — Khusus Indonesia</p>
            <code style={{ background: '#1a1a2e', padding: '6px 10px', borderRadius: 6, display: 'block', fontSize: 12, wordBreak: 'break-all' }}>
              https://raw.githubusercontent.com/riotryulianto/iptv-playlists/main/playlist.m3u
            </code>
            <p style={{ margin: '4px 0 0', color: '#888', fontSize: 12 }}>Channel: RCTI, SCTV, Indosiar, Trans7, ANTV, Metro TV, TVRI Sport, CNN Indonesia, CNBC, dll.</p>
          </div>

          <div style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: 600, margin: '0 0 6px' }}>3. Pastebin IPTV Indonesia (jendelatv.id)</p>
            <code style={{ background: '#1a1a2e', padding: '6px 10px', borderRadius: 6, display: 'block', fontSize: 12, wordBreak: 'break-all' }}>
              https://pastebin.com/raw/4zUPUCVr
            </code>
          </div>

          <h3 style={{ color: '#ffd700', margin: '16px 0 12px' }}>🔧 Cara Update Link di Web Ini</h3>
          
          <p>Buka <code style={{ background: '#1a1a2e', padding: '2px 6px', borderRadius: 4 }}>src/app/page.js</code> → cari array <code style={{ background: '#1a1a2e', padding: '2px 6px', borderRadius: 4 }}>matches</code> → ganti <code style={{ background: '#1a1a2e', padding: '2px 6px', borderRadius: 4 }}>src</code> dengan link M3U8 baru.</p>

          <p style={{ color: '#888', fontSize: 12, marginTop: 12 }}>
            💡 Format channel:<br/>
            <code style={{ background: '#1a1a2e', padding: '2px 6px', borderRadius: 4 }}>
              {'{ name: "SCTV HD", src: "http://link-m3u8...", type: "m3u8" }'}
            </code>
          </p>

          <h3 style={{ color: '#ff6b6b', margin: '16px 0 12px' }}>⚠️ Catatan</h3>
          <ul style={{ paddingLeft: 18, color: '#888', fontSize: 12 }}>
            <li>Link M3U8 publik sering mati — siapkan backup channel</li>
            <li>Beberapa stream butuh <strong>VPN Indonesia</strong> (geo-block)</li>
            <li>Gunakan <strong>IPTV-org</strong> sebagai sumber utama — update rutin tiap hari</li>
            <li>Untuk source berbayar (Vidio/Mola), stream M3U8 butuh token auth — tidak gratis</li>
          </ul>
        </div>
      )}
    </div>
  )
}
