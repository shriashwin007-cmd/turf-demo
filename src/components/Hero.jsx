const stats = [
  { num: '15K+', label: 'Happy Players' },
  { num: '4.9★', label: 'Rating' },
  { num: '500+', label: 'Monthly Bookings' },
  { num: '3', label: 'Pro Grounds' },
];

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div className="hero-badge">Chennai's Premier Sports Facility</div>
        <h1><span>TURF</span> ARENA</h1>
        <p className="hero-tag">Where Champions Play</p>
        <div className="hero-btns">
          <a href="#booking" className="btn-primary">⚡ Book a Slot</a>
          <a href="#about" className="btn-outline">Explore Facility</a>
        </div>
        <div className="hero-stats">
          {stats.map(s => (
            <div className="hero-stat" key={s.label}>
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-line" />
    </section>
  );
}
