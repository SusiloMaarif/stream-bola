# 🎬 Stream Injector — Chrome Extension

## 📥 Cara Install

1. Buka Chrome → `chrome://extensions/`
2. Nyalakan **Developer mode** (pojok kanan atas)
3. Klik **Load unpacked**
4. Pilih folder `chrome-ext/`

## 🎯 Cara Pake

1. Klik icon extension di toolbar 🔲
2. Pastikan status **Active** (dot hijau)
3. Buka situs streaming bola:
   - `airdropglobalz.my.id`
   - `starballtv.pages.dev`
   - Atau situs manapun
4. Klik channel di situs tersebut
5. Buka popup extension → channel yang muncul akan terecord
6. Klik **📋 Copy URL** dapat M3U8
7. Klik **▶ Play** buat test di player

## 📤 Export M3U Playlist

Klik **📥 Export M3U** → file `.m3u` siap diimport ke VLC / IPTV player

## 🧠 Cara Kerja

Extension ini menangkap semua request jaringan dari situs streaming:
- ✅ M3U8 playlist URLs
- ✅ Base64 decode channel paths
- ✅ Iframe embed sources
- ✅ Hidden stream URLs di script tag

Semua tercapture otomatis tanpa perlu config.
