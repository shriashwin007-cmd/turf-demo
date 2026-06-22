import GlowButton from './GlowButton';

export default function Event() {
  return (
    <section id="event">
      <div className="container">
        <div className="section-label">Upcoming Tournament</div>
        <h2 className="section-title">Chennai Champions Cup 2026</h2>
        <div className="event-card">
          <div className="event-icon">🏆</div>
          <div className="event-details">
            <div className="event-title-big">Chennai Champions Cup 2026</div>
            <div className="event-meta">
              <div className="event-meta-item">📅 July 20, 2026</div>
              <div className="event-meta-item">⚽ 32 Teams</div>
              <div className="event-meta-item">📍 TURF Arena, Chennai</div>
            </div>
            <div style={{ marginTop: 20 }}>
              <GlowButton href="#booking">Register Now →</GlowButton>
            </div>
          </div>
          <div>
            <div className="event-prize">
              ₹50,000
              <small>Prize Pool</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
