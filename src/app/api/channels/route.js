import { NextResponse } from 'next/server'
import channelsData from '@/data/channels.json'

export async function GET() {
  return NextResponse.json(channelsData, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=300',
    }
  })
}
