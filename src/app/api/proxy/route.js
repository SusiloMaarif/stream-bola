import { NextResponse } from 'next/server'

// API route proxy — HLS relay with segment rewriting
// Semua TS segment di-rewrite lewat proxy biar gak kena geo-block

const BASE = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')
  const type = searchParams.get('type') || 'auto'

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
      'Referer': new URL(url).origin + '/',
      'Origin': new URL(url).origin,
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
    }

    const res = await fetch(url, { headers, signal: AbortSignal.timeout(30000) })

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || ''

    // Kalo binary (TS segment atau file video) — langsung return
    if (type === 'segment' || url.endsWith('.ts') || url.endsWith('.m4s') || url.endsWith('.mp4') || url.includes('segment')) {
      const buffer = await res.arrayBuffer()
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': contentType || 'video/mp2t',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=3600',
          'Content-Disposition': 'inline',
        },
      })
    }

    let body = await res.text()

    // Kalo M3U8 — rewrite semua URL segment biar lewat proxy
    if (type === 'm3u8' || url.endsWith('.m3u8') || contentType.includes('m3u8') || body.startsWith('#EXTM3U')) {
      const baseUrl = new URL(url)
      
      // Rewrite TS segment URLs (absolute)
      body = body.replace(/^(https?:\/\/[^\s#]+\.ts(?:\?[^\s]*)?)/gm, (match) => {
        return `${BASE}/api/proxy?type=segment&url=${encodeURIComponent(match)}`
      })
      
      // Rewrite m4s/mp4 segment URLs
      body = body.replace(/^(https?:\/\/[^\s#]+\.(m4s|mp4)(?:\?[^\s]*)?)/gm, (match) => {
        return `${BASE}/api/proxy?type=segment&url=${encodeURIComponent(match)}`
      })
      
      // Rewrite relative URLs — combine with base
      const lines = body.split('\n')
      const rewritten = lines.map(line => {
        const trimmed = line.trim()
        if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
          return line
        }
        try {
          const fullUrl = new URL(trimmed, baseUrl.origin + baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf('/') + 1))
          return `${BASE}/api/proxy?type=segment&url=${encodeURIComponent(fullUrl.href)}`
        } catch {
          return line
        }
      }).join('\n')

      return new NextResponse(rewritten, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache, max-age=0',
        },
      })
    }

    // Fallback — return as is
    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType || 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    })

  } catch (err) {
    if (err.name === 'TimeoutError') {
      return NextResponse.json({ error: 'Stream timeout' }, { status: 504 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
