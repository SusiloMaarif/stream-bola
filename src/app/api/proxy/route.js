// API route proxy — bypass CORS, mixed-content, dan tambah headers
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 })
  }

  try {
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
      'Origin': new URL(url).origin,
      'Referer': new URL(url).origin + '/',
    }

    const res = await fetch(url, { headers })
    const contentType = res.headers.get('content-type') || 'application/vnd.apple.mpegurl'

    // Kalo M3U8, return text biar bisa diparse hls.js
    const body = await res.text()

    return new NextResponse(body, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'public, max-age=60',
      },
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
