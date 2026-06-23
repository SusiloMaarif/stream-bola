document.addEventListener('DOMContentLoaded', function() {
  const streamList = document.getElementById('streamList');
  const count = document.getElementById('count');
  const clearBtn = document.getElementById('clearBtn');
  const exportBtn = document.getElementById('exportBtn');
  const toggleBtn = document.getElementById('toggleBtn');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');
  const toast = document.getElementById('toast');

  let streams = [];
  let enabled = true;

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  function copy(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('✅ Copied!');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('✅ Copied!');
    });
  }

  function openInPlayer(url) {
    // Open in VLC web player or directly
    window.open('https://liveplayer.org/?url=' + encodeURIComponent(url), '_blank');
  }

  function testUrl(url) {
    fetch(url, { method: 'HEAD', mode: 'no-cors' }).then(() => {
      showToast('✅ Stream reachable');
    }).catch(() => {
      showToast('❌ Stream unreachable');
    });
  }

  function render() {
    if (streams.length === 0) {
      streamList.innerHTML = `
        <div class="empty">
          <div class="icon">🕵️</div>
          <h3>Waiting for streams...</h3>
          <p>Buka situs streamingbola<br>
          lalu klik channel — stream akan muncul di sini</p>
        </div>
      `;
      count.textContent = '0 streams';
      return;
    }

    let html = '';
    streams.forEach((s, idx) => {
      const hasM3U8 = s.m3u8Url || (s.url && s.url.endsWith('.m3u8'));
      const typeClass = hasM3U8 ? 'm3u8' : (s.channelInfo ? 'auto' : 'embed');
      const channelName = s.channel || s.channelInfo || 'Unknown';
      const streamUrl = s.m3u8Url || s.url || s.iframeSrc || '';
      const time = s.timestamp ? new Date(s.timestamp).toLocaleTimeString() : '';

      html += `
        <div class="stream-item ${typeClass}">
          <div class="channel">
            📺 ${channelName}
            ${hasM3U8 ? '<span class="badge">M3U8</span>' : '<span class="badge" style="background:#ffd70022;color:#ffd700">EMBED</span>'}
          </div>
          <div class="url">${streamUrl.substring(0, 100)}${streamUrl.length > 100 ? '...' : ''}</div>
          <div class="meta">
            <span>🕐 ${time}</span>
            ${s.source ? `<span>🔗 ${s.source.substring(0, 40)}...</span>` : ''}
          </div>
          <div class="actions">
            <button class="copy" data-url="${streamUrl}">📋 Copy URL</button>
            ${hasM3U8 ? `<button class="play" data-url="${streamUrl}">▶ Play</button>` : ''}
            <button class="test" data-url="${streamUrl}">🔍 Test</button>
          </div>
        </div>
      `;
    });

    streamList.innerHTML = html;
    count.textContent = `${streams.length} streams`;

    // Attach event listeners
    streamList.querySelectorAll('.copy').forEach(btn => {
      btn.addEventListener('click', () => copy(btn.dataset.url));
    });
    streamList.querySelectorAll('.play').forEach(btn => {
      btn.addEventListener('click', () => openInPlayer(btn.dataset.url));
    });
    streamList.querySelectorAll('.test').forEach(btn => {
      btn.addEventListener('click', () => testUrl(btn.dataset.url));
    });
  }

  function refresh() {
    chrome.runtime.sendMessage({ action: 'getStreams' }, (response) => {
      if (response && response.streams) {
        streams = response.streams;
        render();
      }
    });
  }

  clearBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'clearStreams' }, () => {
      streams = [];
      render();
      showToast('🗑 Streams cleared');
    });
  });

  exportBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'exportPlaylist' }, (response) => {
      if (response && response.playlist) {
        // Download playlist
        const blob = new Blob([response.playlist], { type: 'application/x-mpegurl' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'captured_streams.m3u';
        a.click();
        URL.revokeObjectURL(url);
        showToast('📥 Playlist downloaded!');
      }
    });
  });

  toggleBtn.addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'toggleCapture' }, (response) => {
      enabled = response.enabled;
      toggleBtn.textContent = enabled ? '⏸ Pause' : '▶ Resume';
      statusDot.className = 'dot ' + (enabled ? 'on' : 'off');
      statusText.textContent = enabled ? 'Active' : 'Paused';
    });
  });

  // Listen for content script captures
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'captureStream') {
      // New stream captured — add to list
      streams.unshift(request.data);
      render();
      showToast('📡 New stream captured!');
    }
  });

  // Initial load
  refresh();
  setInterval(refresh, 2000);
});
