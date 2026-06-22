const facilities = [
  { icon: '⚽', name: '5-a-side Football Ground' },
  { icon: '🏏', name: 'Cricket Practice Nets' },
  { icon: '💡', name: 'High-Power LED Floodlights' },
  { icon: '🚿', name: 'Clean Changing Rooms' },
  { icon: '🚗', name: 'Free Parking' },
  { icon: '🥤', name: 'Refreshment Zone' },
  { icon: '📶', name: 'Free WiFi' },
  { icon: '📸', name: 'Sports Photography' },
  { icon: '🪑', name: 'Spectator Seating' },
  { icon: '🎵', name: 'Music System' },
];

const TURF_IMGS = [
  { src: 'https://res.cloudinary.com/dysoq8l4d/image/upload/v1782148173/artificial-turf-of-soccer-football-field-photo_cwnrpp.jpg', alt: 'Football turf ground' },
  { src: 'https://res.cloudinary.com/dysoq8l4d/image/upload/v1782148311/images-2_qr1ygq.jpg', alt: 'Cricket nets' },
];

export default function About() {
  return (
    <section id="about">
      <div className="container">
        <div className="section-label">About TURF Arena</div>
        <h2 className="section-title">Chennai's Premier<br />Multi-Sport Facility</h2>
        <p className="section-sub">
          TURF Arena is Chennai's premier multi-sport turf facility designed for football, cricket, and fitness
          enthusiasts. Featuring FIFA-standard artificial grass, professional floodlights, modern changing rooms,
          and ample parking — the perfect environment for players of all skill levels.
        </p>

        {/* Photo strip */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '36px 0 0' }}>
          {TURF_IMGS.map(img => (
            <div key={img.alt} style={{
              borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)',
              aspectRatio: '16/9', position: 'relative',
            }}>
              <img
                src={img.src}
                alt={img.alt}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)',
              }} />
            </div>
          ))}
        </div>

        <div className="facilities-grid" style={{ marginTop: 36 }}>
          {facilities.map(f => (
            <div className="facility-card" key={f.name}>
              <div className="facility-icon">{f.icon}</div>
              <div className="facility-name">{f.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
