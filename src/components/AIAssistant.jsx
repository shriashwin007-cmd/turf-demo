import { useState, useRef, useEffect } from 'react';

const KB = {
  book: 'To book a slot, go to the **Book a Slot** section! Choose your sport, pick your date and time, enter your name and phone, then hit **Confirm Booking**. You\'ll get a WhatsApp confirmation shortly! 📱',
  price: '**Weekdays:**\n• 6 AM–6 PM → ₹1,200/hr\n• 6 PM–11 PM → ₹1,500/hr\n\n**Weekends:**\n• 6 AM–6 PM → ₹1,500/hr\n• 6 PM–11 PM → ₹1,800/hr\n\nFloodlights included! 💡',
  sport: 'We offer:\n\n⚽ **5-a-side Football** — FIFA-standard artificial grass\n🏏 **Cricket Practice Nets** — Professional batting & bowling nets',
  hour: 'We\'re open **every day** from **6:00 AM to 11:00 PM** — including holidays! 🌅',
  facilit: 'Facilities:\n⚽ Football Ground\n🏏 Cricket Nets\n💡 LED Floodlights\n🚿 Changing Rooms\n🚗 Free Parking\n🥤 Refreshment Zone\n📶 Free WiFi\n📸 Sports Photography\n🪑 Spectator Seating\n🎵 Music System',
  cancel: 'For cancellations, call **+91 93456 78901** at least 2 hours before your slot. 📞',
  contact: '📞 **+91 93456 78901**\n✉️ **info@turfarena.in**\n📍 No. 42, Velammal Main Road, Mogappair East, Chennai 600037',
  event: '🏆 **Chennai Champions Cup 2026!**\n📅 July 20, 2026\n💰 Prize Pool: ₹50,000\n⚽ 32 Teams\n\nHead to the booking section to register!',
  snack: 'Our Refreshment Zone has:\n⚡ Energy Drinks (₹80) ☕ Cold Coffee (₹70)\n🍔 Veg Burger (₹120) 🍟 French Fries (₹100)\n💧 Water (₹20) ...and more!\n\nScroll to **Snacks** section to order! 🥤',
  park: 'Yes! **Free parking** for all players and spectators. No charges! 🚗',
  wifi: 'Free high-speed WiFi throughout the facility! 📶',
};

function getResponse(msg) {
  const lower = msg.toLowerCase();
  for (const [key, val] of Object.entries(KB)) {
    if (lower.includes(key)) return val;
  }
  if (/hello|hi|hey/.test(lower)) return "Hey! 👋 Welcome to TURF Arena! I can help with bookings, pricing, facilities, events, or snacks. What would you like to know?";
  if (/thank/.test(lower)) return "You're welcome! 🙌 See you on the turf!";
  if (/address|location|where/.test(lower)) return "📍 **No. 42, Velammal Main Road**\nMogappair East, Chennai, Tamil Nadu 600037";
  return "For more details, call **+91 93456 78901** or email **info@turfarena.in**. Available 6 AM – 11 PM daily. 😊";
}

function Bubble({ msg }) {
  const html = msg.text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  return (
    <div className={`ai-msg ${msg.from}`}>
      <div className="ai-bubble" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

const QUICK = [
  { label: '📅 How to book?', q: 'How do I book a slot?' },
  { label: '💰 Pricing', q: 'What are the prices?' },
  { label: '⚽ Sports', q: 'What sports are available?' },
  { label: '🕐 Hours', q: 'What are the working hours?' },
];

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  function openChat() {
    setOpen(true);
    if (msgs.length === 0) {
      setMsgs([{ from: 'bot', text: "👋 Hey! I'm Arena AI, your TURF Arena assistant.\n\nI can help with bookings, pricing, facilities, events, and more. What do you need?" }]);
    }
  }

  function send(text) {
    const q = text || input.trim();
    if (!q) return;
    setInput('');
    setMsgs(m => [...m, { from: 'user', text: q }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { from: 'bot', text: getResponse(q) }]);
    }, 700 + Math.random() * 500);
  }

  return (
    <div className="ai-fab">
      {open && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-avatar">🤖</div>
            <div className="ai-header-info">
              <div className="ai-name">Arena AI Assistant</div>
              <div className="ai-status">● Online — Here to help!</div>
            </div>
            <button className="ai-close-btn" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="ai-messages">
            {msgs.map((m, i) => <Bubble key={i} msg={m} />)}
            {typing && (
              <div className="ai-msg bot">
                <div className="ai-bubble">
                  <div className="ai-typing">
                    <div className="ai-dot" /><div className="ai-dot" /><div className="ai-dot" />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="ai-quick-replies">
            {QUICK.map(q => (
              <button key={q.q} className="ai-qr" onClick={() => send(q.q)}>{q.label}</button>
            ))}
          </div>

          <div className="ai-input-row">
            <input
              className="ai-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask me anything..."
            />
            <button className="ai-send-btn" onClick={() => send()}>➤</button>
          </div>
        </div>
      )}
      <button className="ai-fab-btn" onClick={() => open ? setOpen(false) : openChat()} title="AI Assistant">
        {open ? '✕' : '🤖'}
      </button>
    </div>
  );
}
