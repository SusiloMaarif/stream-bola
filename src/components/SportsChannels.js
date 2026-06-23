'use client'

import { useState } from 'react'
import channelsData from '@/data/channels.json'

const ALL_CHANNELS = channelsData.channels || []

export default function SportsChannels({ onPlayChannel }) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  // Extract categories from channel names
  const categories = ['all', ...new Set(
    ALL_CHANNELS.map(ch => {
      const match = ch.name.match(/^\((\w+)\)/)
      return match ? match[1] : 'other'
    })
  )].slice(0, 20) // Max 20 categories

  const filtered = ALL_CHANNELS.filter(ch => {
    if (category !== 'all') {
      const cat = ch.name.match(/^\((\w+)\)/)
      if (!cat || cat[1] !== category) return false
    }
    if (search) {
      const q = search.toLowerCase()
      if (!ch.name.toLowerCase().includes(q)) return false
    }
    return true
  })

  return (
    <div>
      {/* Search */}
      <div style={{ marginBottom: 12 }}>
        <input
          type="text"
          placeholder="🔍 Cari channel..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 10,
            border: '1px solid #2a2a3e', background: '#12121a', color: '#e0e0e0',
            fontSize: 13, outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12, maxHeight: 80, overflowY: 'auto' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '4px 10px', borderRadius: 6, border: 'none',
            background: category === cat ? '#00e676' : '#1a1a2e',
            color: category === cat ? '#000' : '#888',
            fontWeight: 600, fontSize: 11, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            {cat === 'all' ? '🏆 Semua' : cat}
          </button>
        ))}
      </div>

      {/* Channel list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 30, color: '#555', fontSize: 13 }}>
            Channel tidak ditemukan
          </div>
        )}
        {filtered.map((ch, i) => (
          <button
            key={ch.id || i}
            onClick={() => onPlayChannel(ch)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '8px 12px', borderRadius: 8,
              border: '1px solid #1e1e2e', background: '#12121a',
              color: '#ccc', cursor: 'pointer', fontSize: 12, fontWeight: 500,
              textAlign: 'left', transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#333'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e2e'}
          >
            <span style={{ fontSize: 10, color: '#555', width: 24, flexShrink: 0 }}>📡</span>
            <span style={{ flex: 1 }}>{ch.name}</span>
            <span style={{ fontSize: 10, color: '#00e67655' }}>▶</span>
          </button>
        ))}
      </div>

      <div style={{ marginTop: 8, fontSize: 11, color: '#444', textAlign: 'center' }}>
        {ALL_CHANNELS.length} channel • Klik untuk nonton
      </div>
    </div>
  )
}
