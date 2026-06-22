// HLS Proxy FULL — proxy M3U8 + rewrite segment URLs
// Biar hls.js gak kena CORS di browser

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
  'etv-cdn.kdb.co.id': 'https://www.kdb.co.id/',
  'b1news.beritasatumedia.com': 'https://www.beritasatu.com/',
  'b1world.beritasatumedia.com': 'https://www.beritasatu.com/',
  'd3b6q2ou5kp8ke.cloudfront.net': 'https://www.google.com/',
  'dazn.combat-amagi': 'https://www.dazn.com/',
  'amagi.tv': 'https://www.amagi.tv/',
  '23.237.104.106': 'https://www.google.com/',
  '190.11.225.124': 'https://www.google.com/',
  'jmp2.uk': 'https://www.jmp2.uk/',
  'd4whmvwm0rdvi.cloudfront.net': 'https://www.google.com/',
  'bcovlive-a.akamaihd.net': 'https://www.google.com/',
}

const BASE_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3000'

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

function resolveUrl(base, relative) {
  try {
    return new URL(relative, base).href
  } catch {
    return relative
  }
}

/** Rewrite M3U8 content — convert ALL URLs to go through our proxy */
function rewriteM3U8(content, baseUrl) {
  const proxyBase = `${BASE_URL}/api/proxy?url=`
  const lines = content.split('\n')
  const result = lines.map(line => {
    const trimmed = line.trim()
    // Skip comments, tags, empty lines
    if (trimmed.startsWith('#') || trimmed === '') return line
    
    // Check it's actually a URL
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
      // Could be a relative URL without scheme — resolve it
      const resolved = resolveUrl(baseUrl, trimmed)
      return line.replace(trimmed, `${proxyBase}${encodeURIComponent(resolved)}`)
    }
    
    // Absolute URL
    const absolute = trimmed.startsWith('http') ? trimmed : resolveUrl(baseUrl, trimmed)
    return line.replace(trimmed, `${proxyBase}${encodeURIComponent(absolute)}`)
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
      // Coba tanpa custom headers
      const res2 = await fetch(url, { signal: AbortSignal.timeout(10000) })
      if (!res2.ok) {
        return NextResponse.json({ error: `Upstream ${res.status}` }, { status: res.status })
      }
      return proxyResponse(res2, url)
    }

    return proxyResponse(res, url)
  } catch (err) {
    // Last try: fetch tanpa signal timeout
    try {
      const res = await fetch(url)
      if (res.ok) return proxyResponse(res, url)
    } catch {}

    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

async function proxyResponse(res, originalUrl) {
  const contentType = res.headers.get('content-type') || ''
  let body = await res.arrayBuffer()
  let finalContentType = contentType

  // Check if this is an M3U8 playlist (text-based)
  const buf = Buffer.from(body)
  const text = buf.toString('utf-8')
  
  // Only rewrite M3U8 playlists
  const isM3U8 = text.startsWith('#EXTM3U') || originalUrl.includes('.m3u8')
  
  if (isM3U8) {
    finalContentType = 'application/vnd.apple.mpegurl; charset=utf-8'
    const rewritten = rewriteM3U8(text, originalUrl)
    return new NextResponse(rewritten, {
      headers: {
        'Content-Type': finalContentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Cache-Control': 'public, max-age=5',
      },
    })
  }

  // Binary data (TS segments, etc.)
  return new NextResponse(body, {
    headers: {
      'Content-Type': finalContentType || 'video/MP2T',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  })
}
