const rows = [
  { slot: '6:00 AM – 6:00 PM', weekday: '₹1,200/hr', weekend: '₹1,500/hr', peak: false },
  { slot: '6:00 PM – 11:00 PM ⚡ Peak', weekday: '₹1,500/hr', weekend: '₹1,800/hr', peak: true },
];

export default function Pricing() {
  return (
    <section id="pricing">
      <div className="container">
        <div className="section-label">Transparent Pricing</div>
        <h2 className="section-title">Affordable Hourly Rates</h2>
        <p className="section-sub">Book for any duration. No hidden charges. Floodlights included for evening slots.</p>
        <table className="pricing-table">
          <thead>
            <tr>
              <th>Time Slot</th>
              <th>Weekdays</th>
              <th>Weekends</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.slot} className={r.peak ? 'peak' : ''}>
                <td>{r.slot}</td>
                <td><span className="price-tag">{r.weekday}</span></td>
                <td><span className="price-tag">{r.weekend}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
