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
        <div className="facilities-grid">
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
