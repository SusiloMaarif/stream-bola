// HLS Proxy dengan M3U8 URL rewriting
// - Proxy semua request M3U8 dengan headers yang tepat
// - Rewrite relative URLs ke absolute biar hls.js bisa load segment langsung

import { NextResponse } from 'next/server'

const REFERER_MAP = {
  'tvri.go.id': 'https://tvri.go.id/',
  'ott-balancer.tvri.go.id': 'https://tvri.go.id/',
  'video.detik.com': 'https://www.detik.com/',
  'edge.medcom.id': 'https://www.medcom.id/',
  'live.cnnindonesia.com': 'https://www.cnnindonesia.com/',
  'live.cnbcindonesia.com': 'https://www.cnbcindonesia.com/',
  'private-streaming.rri.go.id': 'https://rri.go.id/',
  'stream.convergen.co': 'https://www.convergen.co/',
}

function getHeaders(url) {
  const domain = new URL(url).hostname
  const referer = Object.entries(REFERER_MAP).find(([key]) => domain.includes(key))?.[1] || 'https://www.google.com/'

  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
    'Referer': referer,
    'Origin': new URL(referer).origin,
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
  }
}

/** Resolve relative URL against base URL */
function resolveUrl(base, relative) {
  try {
    return new URL(relative, base).href
  } catch {
    return relative
  }
}

/** Rewrite M3U8 content — convert all relative URLs to absolute */
function rewriteM3U8(content, baseUrl) {
  const lines = content.split('\n')
  const result = lines.map(line => {
    const trimmed = line.trim()
    // Skip comments, tags, empty lines
    if (trimmed.startsWith('#') || trimmed === '') return line
    // This is a URL line — resolve it
    const absolute = resolveUrl(baseUrl, trimmed)
    return line.replace(trimmed, absolute)
  })
  return result.join('\n')
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  try {
    const headers = getHeaders(url)
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(15000) })

    if (!res.ok) {
      return NextResponse.json({ error: `Upstream ${res.status}` }, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || ''
    let body = await res.text()
    let finalContentType = contentType

    // Detect M3U8 by content or URL
    const isM3U8 = body.startsWith('#EXTM3U') || url.endsWith('.m3u8')
    
    if (isM3U8) {
      // Rewrite relative URLs to absolute
      body = rewriteM3U8(body, url)
      finalContentType = 'application/vnd.apple.mpegurl; charset=utf-8'
    }

    return new NextResponse(body, {
      headers: {
        'Content-Type': finalContentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'public, max-age=30',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
