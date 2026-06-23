// API route: Stream proxy untuk Stalker Portal
// Memanggil create_link dengan fresh token tiap request
import { NextResponse } from 'next/server'

const MAC = '00:1A:79:B7:2A:D0'
const HOST = 'xp1.tv'
const PORT = 80
const API = `http://${HOST}:${PORT}/c/server/load.php`

async function getToken() {
  const headers = {
    'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3 (KHTML, like Gecko) MAG200 stbapp ver: 2 rev: 250 Safari/533.3',
    'Cookie': `mac=${MAC}; stb_lang=en; timezone=GMT`,
    'X-User-Agent': 'Model: MAG250; Link: WiFi'
  }
  const res = await fetch(`${API}?type=stb&action=handshake&token=&JsHttpRequest=1-xml`, { headers, next: { revalidate: 0 } })
  const data = await res.json()
  return data.js?.token || ''
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const channelId = searchParams.get('id')

  if (!channelId) {
    return NextResponse.json({ error: 'Missing channel id' }, { status: 400 })
  }

  try {
    const token = await getToken()
    if (!token) {
      return NextResponse.json({ error: 'Failed to authenticate' }, { status: 500 })
    }

    // Get fresh stream URL
    const headers = {
      'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3',
      'Cookie': `mac=${MAC}; stb_lang=en; timezone=GMT`,
      'Authorization': `Bearer ${token}`,
      'X-User-Agent': 'Model: MAG250; Link: WiFi'
    }
    
    const streamRes = await fetch(
      `${API}?type=itv&action=create_link&cmd=ffrt%20http://localhost/ch/${channelId}&JsHttpRequest=1-xml`,
      { headers, next: { revalidate: 0 } }
    )
    const streamData = await streamRes.json()
    const streamUrl = streamData.js?.cmd?.replace('ffmpeg ', '')

    if (!streamUrl) {
      return NextResponse.json({ error: 'Stream URL not found' }, { status: 500 })
    }

    // Redirect to actual stream
    return NextResponse.redirect(streamUrl, 302)
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
