import { useState } from 'react';

const MENU = [
  { id: 1, name: 'Energy Drink', desc: 'Boost before the game', price: 80, emoji: '⚡' },
  { id: 2, name: 'Cold Coffee', desc: 'Chilled & refreshing', price: 70, emoji: '☕' },
  { id: 3, name: 'Fresh Lime Soda', desc: 'Post-game refresher', price: 50, emoji: '🍋' },
  { id: 4, name: 'Coconut Water', desc: 'Natural electrolytes', price: 40, emoji: '🥥' },
  { id: 5, name: 'Protein Bar', desc: 'Quick energy fix', price: 90, emoji: '🍫' },
  { id: 6, name: 'Veg Burger', desc: 'Freshly made', price: 120, emoji: '🍔' },
  { id: 7, name: 'Popcorn (Masala)', desc: 'Crunchy game snack', price: 60, emoji: '🍿' },
  { id: 8, name: 'Banana', desc: 'Natural energy', price: 20, emoji: '🍌' },
  { id: 9, name: 'Mineral Water', desc: '500ml chilled', price: 20, emoji: '💧' },
  { id: 10, name: 'French Fries', desc: 'Crispy & hot', price: 100, emoji: '🍟' },
  { id: 11, name: 'Masala Chai', desc: 'Hot & spiced', price: 30, emoji: '🍵' },
  { id: 12, name: 'Aloo Samosa (2pcs)', desc: 'Crispy & filling', price: 40, emoji: '🥟' },
];

function OrderModal({ cart, onClose }) {
  const [phone, setPhone] = useState('');
  const [delivery, setDelivery] = useState('');
  const [placed, setPlaced] = useState(false);

  const items = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ ...MENU.find(m => m.id === Number(id)), qty }));
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  function place() {
    if (!phone) { alert('Please enter your phone number.'); return; }
    setPlaced(true);
    setTimeout(onClose, 2500);
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h3>🛒 Your Order</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {items.map(i => (
          <div className="order-item" key={i.id}>
            <span className="order-item-name">{i.emoji} {i.name} × {i.qty}</span>
            <span className="order-item-price">₹{i.price * i.qty}</span>
          </div>
        ))}
        <div className="order-total-row"><span>Total</span><span>₹{total}</span></div>
        <div style={{ marginTop: 20 }}>
          <div className="form-group">
            <label>Delivery to (ground / seat)</label>
            <input value={delivery} onChange={e => setDelivery(e.target.value)} placeholder="Ground A, Seat 5..." />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210" />
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={place}>Place Order →</button>
          {placed && <div className="success-msg" style={{ marginTop: 12 }}>✅ Order Placed! Ready in 10–15 minutes.</div>}
        </div>
      </div>
    </div>
  );
}

export default function Snacks() {
  const [cart, setCart] = useState({});
  const [showModal, setShowModal] = useState(false);

  const change = (id, delta) => setCart(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) + delta) }));
  const orderTotal = Object.entries(cart).reduce((s, [id, q]) => s + (MENU.find(m => m.id === Number(id))?.price || 0) * q, 0);

  function closeModal() {
    setShowModal(false);
    setCart({});
  }

  return (
    <>
      <section id="snacks">
        <div className="container">
          <div className="section-label">Refreshment Zone</div>
          <h2 className="section-title">Snacks & Beverages</h2>
          <p className="section-sub">Fuel up before, during, and after your game. Fresh and ready to order.</p>
          <div className="snacks-grid">
            {MENU.map(item => (
              <div className="snack-card" key={item.id}>
                <div className="snack-img">{item.emoji}</div>
                <div className="snack-info">
                  <div className="snack-name">{item.name}</div>
                  <div className="snack-desc">{item.desc}</div>
                  <div className="snack-bottom">
                    <div className="snack-price">₹{item.price}</div>
                    <div className="snack-qty">
                      <button className="qty-btn" onClick={() => change(item.id, -1)}>−</button>
                      <div className="qty-num">{cart[item.id] || 0}</div>
                      <button className="qty-btn" onClick={() => change(item.id, 1)}>+</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {orderTotal > 0 && (
        <button className="order-bar" onClick={() => setShowModal(true)}>
          🛒 View Order — ₹{orderTotal}
        </button>
      )}

      {showModal && <OrderModal cart={cart} onClose={closeModal} />}
    </>
  );
}
