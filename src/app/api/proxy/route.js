// Universal proxy — proxy ANY URL, rewrite HTML/JS/CSS to bypass framing checks
import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://stream-bola.vercel.app/',
        'Origin': 'https://stream-bola.vercel.app',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
    })

    const contentType = res.headers.get('content-type') || ''
    const body = await res.text()

    // If HTML, inject meta tag to allow framing + strip framing checks
    if (contentType.includes('text/html')) {
      const modified = body
        // Strip frame-busting
        .replace(/window\.top\s*===\s*window\.self/g, 'false')
        .replace(/window\.top!==window\.self/g, 'true')
        .replace(/window\.top\s*!==\s*window\.self/g, 'true')
        .replace(/top\s*!==\s*self/g, 'false')
        .replace(/top===self/g, 'false')
        // Inject CSP allow
        .replace('</head>', '<meta http-equiv="Content-Security-Policy" content="frame-ancestors *">\n</head>')

      return new NextResponse(modified, {
        headers: {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*',
          'X-Frame-Options': 'ALLOWALL',
          'Content-Security-Policy': "frame-ancestors *",
          'Cache-Control': 'no-cache',
        },
      })
    }

    // For non-HTML (JS, TS, M3U8, etc.) — just pass through
    // If M3U8 playlist, rewrite segments to go through proxy
    let finalBody = body
    if (contentType.includes('mpegurl') || url.endsWith('.m3u8')) {
      // Rewrite relative paths to absolute + proxy
      const baseUrl = url.substring(0, url.lastIndexOf('/') + 1)
      finalBody = body.split('\n').map(line => {
        const trimmed = line.trim()
        if (trimmed.startsWith('#')) return line // Keep M3U tags
        if (trimmed.startsWith('http')) return `/api/proxy?url=${encodeURIComponent(trimmed)}`
        if (trimmed) return `/api/proxy?url=${encodeURIComponent(baseUrl + trimmed)}`
        return line
      }).join('\n')
    }

    return new NextResponse(finalBody, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': "frame-ancestors *",
        'Cache-Control': 'no-cache',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
