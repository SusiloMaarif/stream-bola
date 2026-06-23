// IPTV Stream Injector — Popup script
const M3U_URL = 'https://stream-bola.vercel.app/iptv-sports.m3u';
const API_BASE = 'https://stream-bola.vercel.app/api';

let channels = [];
let filtered = [];

// Load channels from M3U
async function loadChannels() {
  try {
    // Try loading from channels.json first
    const res = await fetch(`${API_BASE}/channels`);
    if (res.ok) {
      const data = await res.json();
      channels = data.channels || [];
    } else {
      // Fallback: parse M3U
      const m3uRes = await fetch(M3U_URL);
      const m3uText = await m3uRes.text();
      const lines = m3uText.split('\n');
      let currentName = '';
      for (const line of lines) {
        if (line.startsWith('#EXTINF:-1')) {
          const nameMatch = line.match(/,([^,]+)$/);
          currentName = nameMatch ? nameMatch[1].trim() : '';
        } else if (line.startsWith('http') && currentName) {
          const idMatch = line.match(/stream=(\d+)/);
          if (idMatch) {
            channels.push({
              id: idMatch[1],
              name: currentName,
              url: line
            });
          }
          currentName = '';
        }
      }
    }
    
    document.getElementById('stats').textContent = `${channels.length} sport channels • beIN • ESPN • DAZN • Sky • BT Sport`;
    renderChannels(channels);
  } catch (e) {
    document.getElementById('stats').textContent = `Error: ${e.message}`;
  }
}

function renderChannels(list) {
  const el = document.getElementById('ch-list');
  el.innerHTML = list.map((ch, i) => `
    <div class="ch-item" onclick="playChannel(${i})">
      📡 ${ch.name}
      <span class="play">▶</span>
    </div>
  `).join('');
  filtered = list;
}

function filterChannels() {
  const q = document.getElementById('search').value.toLowerCase();
  if (!q) return renderChannels(channels);
  const filtered = channels.filter(ch => ch.name.toLowerCase().includes(q));
  renderChannels(filtered);
}

async function playChannel(index) {
  const ch = filtered[index];
  if (!ch) return;

  document.getElementById('list-view').style.display = 'none';
  document.getElementById('player-container').style.display = 'block';
  document.getElementById('back').style.display = 'inline-block';
  document.getElementById('stats').textContent = `Connecting to ${ch.name}...`;

  const player = document.getElementById('player');

  // Try to get fresh stream via background service worker
  chrome.runtime.sendMessage(
    { action: 'getStream', channelId: ch.id },
    (response) => {
      if (response?.streamUrl) {
        document.getElementById('stats').textContent = `Now Playing: ${ch.name}`;
        player.src = response.streamUrl;
        player.play().catch(() => {});
      } else {
        // Fallback: direct URL
        const fallback = ch.url || `http://xp1.tv/play/live.php?mac=00:1A:79:B7:2A:D0&stream=${ch.id}&extension=ts`;
        document.getElementById('stats').textContent = `Now Playing: ${ch.name} (direct)`;
        player.src = fallback;
        player.play().catch(() => {});
      }
    }
  );
}

function showList() {
  document.getElementById('list-view').style.display = 'block';
  document.getElementById('player-container').style.display = 'none';
  document.getElementById('back').style.display = 'none';
  document.getElementById('stats').textContent = `${channels.length} sport channels`;
}

// Channel API endpoint
chrome.runtime.onInstalled?.addListener(() => {
  console.log('IPTV Stream Injector installed');
});

loadChannels();
