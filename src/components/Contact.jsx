const info = [
  { icon: '📍', label: 'Address', val: 'No. 42, Velammal Main Road, Mogappair East, Chennai, Tamil Nadu 600037' },
  { icon: '📞', label: 'Phone', val: '+91 93456 78901' },
  { icon: '✉️', label: 'Email', val: 'info@turfarena.in' },
  { icon: '🕐', label: 'Working Hours', val: 'Monday – Sunday: 6:00 AM – 11:00 PM' },
];

export default function Contact() {
  return (
    <section id="contact">
      <div className="container">
        <div className="section-label">Get in Touch</div>
        <h2 className="section-title">Visit Us</h2>
        <div className="contact-grid">
          <div className="contact-info-card">
            {info.map(i => (
              <div className="contact-info-item" key={i.label}>
                <div className="contact-info-icon">{i.icon}</div>
                <div>
                  <div className="contact-info-label">{i.label}</div>
                  <div className="contact-info-val">{i.val}</div>
                </div>
              </div>
            ))}
            <div className="social-row">
              <a href="#" className="social-btn">📸 Instagram</a>
              <a href="#" className="social-btn">👥 Facebook</a>
              <a href="#" className="social-btn">▶ YouTube</a>
            </div>
          </div>
          <div className="map-card">
            <span className="map-icon">🗺️</span>
            <span className="map-city">Mogappair East, Chennai</span>
            <span className="map-addr">No. 42, Velammal Main Road<br />Tamil Nadu 600037</span>
            <a href="#" className="btn-outline" style={{ marginTop: 12, fontSize: 13, padding: '10px 20px' }}>
              Get Directions →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
