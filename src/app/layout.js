export const metadata = {
  title: 'LiveTV - 24/7 Live Streaming',
  description: 'Live streaming channel TV Indonesia & Internasional',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          * { box-sizing: border-box; }
          body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0a0a12; color: #e0e0e0; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: #0a0a12; }
          ::-webkit-scrollbar-thumb { background: #2a2a3e; border-radius: 3px; }
          input:focus, select:focus { outline: none; border-color: #00e676 !important; }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
