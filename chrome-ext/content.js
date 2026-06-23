// Content script — injected into EVERY page (including iframes)
// Captures M3U8 URLs directly and monitors iframe sources

(function() {
  'use strict';

  let discoveredUrls = new Set();

  // Monitor iframe creation/attribute changes
  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.tagName === 'IFRAME') {
          monitorIframe(node);
        }
      }
      // Check for attribute changes (src changes)
      if (mutation.type === 'attributes' && mutation.target.tagName === 'IFRAME') {
        const iframe = mutation.target;
        const src = iframe.src || '';
        captureIframeSrc(src);
      }
    }
  });

  // Start observing
  const startObserver = () => {
    observer.observe(document.documentElement || document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['src'],
    });

    // Scan existing iframes
    document.querySelectorAll('iframe').forEach(f => monitorIframe(f));
  };

  function monitorIframe(iframe) {
    const src = iframe.src || '';
    captureIframeSrc(src);

    // Monitor src changes on existing iframes
    let lastSrc = src;
    Object.defineProperty(iframe, 'src', {
      set: function(value) {
        lastSrc = value;
        captureIframeSrc(value);
        return value;
      },
      get: function() { return lastSrc; }
    });
  }

  function captureIframeSrc(src) {
    if (!src || discoveredUrls.has(src)) return;
    discoveredUrls.add(src);

    // Decode base64 hashes
    let channelInfo = '';
    if (src.includes('#')) {
      const hash = src.split('#')[1];
      try {
        channelInfo = atob(hash);
      } catch(e) {
        channelInfo = hash;
      }
    }

    // Scan page for hidden M3U8 URLs
    scanForM3U8Urls();

    // Send to background
    chrome.runtime.sendMessage({
      action: 'captureStream',
      data: {
        iframeSrc: src,
        channelInfo: channelInfo,
        pageUrl: window.location.href,
        timestamp: new Date().toISOString(),
      }
    }).catch(() => {}); // Silently fail if background not ready
  }

  function scanForM3U8Urls() {
    // Search entire page text for M3U8 URLs
    const pageText = document.documentElement.innerText;
    const m3u8Regex = /https?:\/\/[^\s"']+\.m3u8[^\s"']*/g;
    const matches = pageText.match(m3u8Regex);
    if (matches) {
      matches.forEach(url => {
        if (!discoveredUrls.has(url)) {
          discoveredUrls.add(url);
          chrome.runtime.sendMessage({
            action: 'captureStream',
            data: {
              iframeSrc: '',
              channelInfo: 'auto-discovered',
              m3u8Url: url,
              pageUrl: window.location.href,
              timestamp: new Date().toISOString(),
            }
          }).catch(() => {});
        }
      });
    }

    // Search all script tags for M3U8 references
    document.querySelectorAll('script').forEach(script => {
      const text = script.textContent || script.innerText || '';
      const scriptMatches = text.match(m3u8Regex);
      if (scriptMatches) {
        scriptMatches.forEach(url => {
          if (!discoveredUrls.has(url)) {
            discoveredUrls.add(url);
            chrome.runtime.sendMessage({
              action: 'captureStream',
              data: {
                iframeSrc: '',
                channelInfo: 'from-script',
                m3u8Url: url,
                pageUrl: window.location.href,
                timestamp: new Date().toISOString(),
              }
            }).catch(() => {});
          }
        });
      }
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserver);
  } else {
    startObserver();
  }

  // Periodic scan
  setInterval(scanForM3U8Urls, 3000);
})();
