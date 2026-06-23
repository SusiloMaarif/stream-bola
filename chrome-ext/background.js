// Background service worker — handle stream fetching with proxy
const MAC = '00:1A:79:B7:2A:D0';
const PORTAL = 'http://xp1.tv/c/server/load.php';
const STREAM_BASE = 'http://xp1.tv';

// Fetch fresh token & stream URL
async function getStreamUrl(channelId) {
  try {
    // Step 1: Handshake
    const handshakeRes = await fetch(`${PORTAL}?type=stb&action=handshake&token=&JsHttpRequest=1-xml`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3',
      }
    });
    const handshakeData = await handshakeRes.json();
    const token = handshakeData.js?.token;
    if (!token) throw new Error('Auth failed');

    // Step 2: Create link
    const linkRes = await fetch(
      `${PORTAL}?type=itv&action=create_link&cmd=ffrt%20http://localhost/ch/${channelId}&JsHttpRequest=1-xml`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (QtEmbedded; U; Linux; C) AppleWebKit/533.3',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    const linkData = await linkRes.json();
    const streamUrl = linkData.js?.cmd?.replace('ffmpeg ', '');
    if (!streamUrl) throw new Error('No stream URL');
    
    return streamUrl;
  } catch (e) {
    // Fallback: use direct URL (may or may not work without fresh token)
    return `${STREAM_BASE}/play/live.php?mac=${MAC}&stream=${channelId}&extension=ts`;
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getStream' && request.channelId) {
    getStreamUrl(request.channelId).then(url => {
      sendResponse({ streamUrl: url });
    }).catch(err => {
      sendResponse({ error: err.message });
    });
    return true; // Keep channel open for async response
  }
});
