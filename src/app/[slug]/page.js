export default function MatchDetail({ params }) {
  const slug = params.slug
  return (
    <div style={{ padding: 20, maxWidth: 1000, margin: '0 auto' }}>
      <a href="/" style={{ color: '#00e676', textDecoration: 'none' }}>← Kembali</a>
      <h1 style={{ marginTop: 20 }}>Match Detail: {slug}</h1>
      <div style={{ aspectRatio: '16/9', background: '#1a1a2e', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
        <p style={{ color: '#666' }}>Player akan muncul di sini</p>
      </div>
    </div>
  )
}
