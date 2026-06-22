import { useState, useEffect } from 'react';

const timeSlots = [
  { value: '6am', label: '6:00 AM' }, { value: '7am', label: '7:00 AM' },
  { value: '8am', label: '8:00 AM' }, { value: '9am', label: '9:00 AM' },
  { value: '10am', label: '10:00 AM' }, { value: '11am', label: '11:00 AM' },
  { value: '12pm', label: '12:00 PM' }, { value: '1pm', label: '1:00 PM' },
  { value: '2pm', label: '2:00 PM' }, { value: '3pm', label: '3:00 PM' },
  { value: '4pm', label: '4:00 PM' }, { value: '5pm', label: '5:00 PM' },
  { value: '6pm', label: '6:00 PM ⚡' }, { value: '7pm', label: '7:00 PM ⚡' },
  { value: '8pm', label: '8:00 PM ⚡' }, { value: '9pm', label: '9:00 PM ⚡' },
  { value: '10pm', label: '10:00 PM ⚡' },
];
const eveningSlots = ['6pm','7pm','8pm','9pm','10pm'];

function calcRate(dateStr, timeVal) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
  const isEvening = eveningSlots.includes(timeVal);
  if (isWeekend) return isEvening ? 1800 : 1500;
  return isEvening ? 1500 : 1200;
}

export default function Booking() {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({ name: '', phone: '', sport: 'football', date: today, time: '6am', duration: '1', notes: '' });
  const [success, setSuccess] = useState(false);

  const rate = calcRate(form.date, form.time);
  const total = rate * parseInt(form.duration);
  const timeLabel = timeSlots.find(t => t.value === form.time)?.label || '—';
  const sportLabel = form.sport === 'football' ? '⚽ Football' : '🏏 Cricket';

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  function submit() {
    if (!form.name || !form.phone) { alert('Please fill in your name and phone number.'); return; }
    setSuccess(true);
    setTimeout(() => setSuccess(false), 4000);
  }

  return (
    <section id="booking">
      <div className="container">
        <div className="section-label">Online Booking</div>
        <h2 className="section-title">Reserve Your Slot</h2>
        <p className="section-sub">Book instantly online. Confirmation sent via WhatsApp & Email.</p>

        <div className="booking-grid">
          <div className="booking-form">
            <h3>📅 Book a Ground</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Your Name</label>
                <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Rahul S." />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </div>

            <div className="form-group">
              <label>Sport</label>
              <select value={form.sport} onChange={e => set('sport', e.target.value)}>
                <option value="football">⚽ Football (5-a-side)</option>
                <option value="cricket">🏏 Cricket Practice Nets</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} min={today} onChange={e => set('date', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Time Slot</label>
                <select value={form.time} onChange={e => set('time', e.target.value)}>
                  {timeSlots.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Duration (hours)</label>
              <select value={form.duration} onChange={e => set('duration', e.target.value)}>
                <option value="1">1 Hour</option>
                <option value="2">2 Hours</option>
                <option value="3">3 Hours</option>
              </select>
            </div>

            <div className="form-group">
              <label>Special Notes (optional)</label>
              <textarea rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any special requirements..." />
            </div>

            <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={submit}>
              Confirm Booking →
            </button>
            {success && <div className="success-msg">🎉 Booking Confirmed! We'll WhatsApp you the details shortly.</div>}
          </div>

          <div className="booking-summary">
            <h3>📋 Booking Summary</h3>
            <div className="summary-row"><span className="summary-label">Sport</span><span className="summary-val">{sportLabel}</span></div>
            <div className="summary-row"><span className="summary-label">Date</span><span className="summary-val">{form.date || '—'}</span></div>
            <div className="summary-row"><span className="summary-label">Time</span><span className="summary-val">{timeLabel}</span></div>
            <div className="summary-row"><span className="summary-label">Duration</span><span className="summary-val">{form.duration} Hour{form.duration > 1 ? 's' : ''}</span></div>
            <div className="summary-row"><span className="summary-label">Rate</span><span className="summary-val">₹{rate}/hr</span></div>
            <div className="summary-row" style={{ paddingTop: 16 }}>
              <span className="summary-label" style={{ fontWeight: 700, color: 'var(--white)' }}>Total</span>
              <span className="summary-total">₹{total.toLocaleString()}</span>
            </div>

            <div className="event-box">
              <div className="event-box-label">Upcoming Event</div>
              <div className="event-box-title">Chennai Champions Cup 2026</div>
              <div className="event-box-meta">📅 July 20, 2026 &nbsp;|&nbsp; 🏆 ₹50,000 Prize</div>
              <div className="event-box-meta">⚽ 32 Teams</div>
            </div>

            <div className="contact-box">
              <div className="contact-box-label">📞 Need help booking?</div>
              <div className="contact-box-phone">+91 93456 78901</div>
              <div className="contact-box-hours">Mon–Sun, 6 AM – 11 PM</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
