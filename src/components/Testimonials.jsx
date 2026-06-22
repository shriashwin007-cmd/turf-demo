const reviews = [
  { name: 'Rahul S.', text: '"One of the best football turfs in Chennai. Excellent lighting and well-maintained ground."' },
  { name: 'Praveen K.', text: '"Perfect place for weekend cricket with friends. Easy booking process."' },
  { name: 'Arjun M.', text: '"Professional facilities and great atmosphere. Highly recommended."' },
];

export default function Testimonials() {
  return (
    <section id="testimonials">
      <div className="container">
        <div className="section-label">What Players Say</div>
        <h2 className="section-title">Loved by Champions</h2>
        <div className="testi-grid">
          {reviews.map(r => (
            <div className="testi-card" key={r.name}>
              <div className="testi-stars">★★★★★</div>
              <p className="testi-text">{r.text}</p>
              <div className="testi-name">{r.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
