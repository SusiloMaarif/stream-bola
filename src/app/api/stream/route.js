// API route: Stream proxy untuk Stalker Portal
// pake session cookie aja (gak perlu Authorization header)
import { NextResponse } from 'next/server'

const MAC = '00:1A:79:B7:2A:D0'
const HOST = 'xp1.tv'
const PORT = 80
const API = `http://${HOST}:${PORT}/c/server/load.php`

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3',
  'Cookie': `mac=${MAC}; stb_lang=en; timezone=GMT`,
  'X-User-Agent': 'Model: MAG250; Link: WiFi'
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const channelId = searchParams.get('id')

  if (!channelId) {
    return NextResponse.json({ error: 'Missing channel id' }, { status: 400 })
  }

  try {
    // Step 1: Handshake
    const handshakeRes = await fetch(
      `${API}?type=stb&action=handshake&token=&JsHttpRequest=1-xml`,
      { headers: HEADERS, next: { revalidate: 0 }, signal: AbortSignal.timeout(8000) }
    )
    const handshakeData = await handshakeRes.json()
    const token = handshakeData.js?.token

    // Step 2: create_link (gak perlu token di header, cukup cookie mac)
    const streamRes = await fetch(
      `${API}?type=itv&action=create_link&cmd=ffrt%20http://localhost/ch/${channelId}&JsHttpRequest=1-xml`,
      { headers: HEADERS, next: { revalidate: 0 }, signal: AbortSignal.timeout(8000) }
    )
    const streamData = await streamRes.json()
    const streamUrl = streamData.js?.cmd?.replace('ffmpeg ', '')

    if (!streamUrl) {
      return NextResponse.json({ error: 'Stream URL not found' }, { status: 500 })
    }

    return NextResponse.redirect(streamUrl, 302)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
