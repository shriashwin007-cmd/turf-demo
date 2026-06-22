import { useState, useRef, useEffect } from 'react';

// ── Knowledge base for general questions ──
const KB = {
  price: '**Weekdays:**\n• 6 AM–6 PM → ₹1,200/hr\n• 6 PM–11 PM → ₹1,500/hr\n\n**Weekends:**\n• 6 AM–6 PM → ₹1,500/hr\n• 6 PM–11 PM → ₹1,800/hr\n\nFloodlights included! 💡',
  sport: 'We offer:\n\n⚽ **5-a-side Football** — FIFA-standard artificial grass\n🏏 **Cricket Practice Nets** — Professional batting & bowling nets',
  hour:  'Open **every day**, **6:00 AM – 11:00 PM** including holidays! 🌅',
  facilit: 'Facilities:\n⚽ Football Ground · 🏏 Cricket Nets\n💡 LED Floodlights · 🚿 Changing Rooms\n🚗 Free Parking · 🥤 Refreshment Zone\n📶 Free WiFi · 📸 Sports Photography',
  cancel: 'Call **+91 93456 78901** at least 2 hours before your slot to cancel. 📞',
  contact: '📞 **+91 93456 78901**\n✉️ **info@turfarena.in**\n📍 Velammal Main Road, Mogappair East, Chennai',
  event:  '🏆 **Chennai Champions Cup 2026**\n📅 July 20, 2026 · 💰 ₹50,000 prize · ⚽ 32 Teams',
  snack:  '⚡ Energy Drink ₹80 · ☕ Cold Coffee ₹70\n🍔 Burger ₹120 · 🍟 Fries ₹100 · 💧 Water ₹20\n\nScroll to **Snacks** to order! 🥤',
  park:   'Yes! **Free parking** for everyone. 🚗',
  wifi:   'Free high-speed WiFi throughout the facility! 📶',
};

function faqResponse(msg) {
  const l = msg.toLowerCase();
  for (const [key, val] of Object.entries(KB)) if (l.includes(key)) return val;
  if (/hello|hi|hey/.test(l)) return "Hey! 👋 I'm Arena AI. Ask me anything or say **\"book a slot\"** and I'll do it for you!";
  if (/thank/.test(l))        return "You're welcome! 🙌 See you on the turf!";
  if (/address|location|where/.test(l)) return "📍 **No. 42, Velammal Main Road**\nMogappair East, Chennai 600037";
  return "For more help call **+91 93456 78901** or email **info@turfarena.in** — open 6 AM–11 PM daily. 😊";
}

// ── Booking flow steps ──
const STEPS = ['sport', 'date', 'time', 'duration', 'name', 'phone', 'confirm'];

const STEP_PROMPTS = {
  sport:    '⚽ Which sport would you like to book?\n\nReply **1** for Football  |  **2** for Cricket',
  date:     '📅 What date? (e.g. **2026-07-20**)\n\nType the date in YYYY-MM-DD format.',
  time:     '🕐 Choose a start time:\n\n**1** 6 AM · **2** 7 AM · **3** 8 AM · **4** 9 AM · **5** 10 AM · **6** 11 AM · **7** 12 PM · **8** 1 PM · **9** 2 PM · **10** 3 PM · **11** 4 PM · **12** 5 PM · **13** 6 PM · **14** 7 PM · **15** 8 PM · **16** 9 PM · **17** 10 PM',
  duration: '⏱ How many hours?\n\nReply **1**, **2**, or **3**',
  name:     '👤 What\'s your name?',
  phone:    '📱 Your phone number?',
};

const TIME_MAP = {
  '1':'6:00 AM','2':'7:00 AM','3':'8:00 AM','4':'9:00 AM','5':'10:00 AM',
  '6':'11:00 AM','7':'12:00 PM','8':'1:00 PM','9':'2:00 PM','10':'3:00 PM',
  '11':'4:00 PM','12':'5:00 PM','13':'6:00 PM ⚡','14':'7:00 PM ⚡',
  '15':'8:00 PM ⚡','16':'9:00 PM ⚡','17':'10:00 PM ⚡',
};

const EVENING_INDICES = ['13','14','15','16','17'];

function calcRate(dateStr, timeIdx) {
  const d = new Date(dateStr);
  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
  const isEvening = EVENING_INDICES.includes(timeIdx);
  if (isWeekend) return isEvening ? 1800 : 1500;
  return isEvening ? 1500 : 1200;
}

function parseDate(val) {
  const d = new Date(val);
  if (!isNaN(d) && val.match(/^\d{4}-\d{2}-\d{2}$/)) return val;
  return null;
}

// ── Bubble renderer ──
function Bubble({ msg }) {
  const html = msg.text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  if (msg.type === 'confirm-card') {
    return (
      <div className="ai-msg bot">
        <div className="ai-bubble ai-confirm-card" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }
  if (msg.type === 'success-card') {
    return (
      <div className="ai-msg bot">
        <div className="ai-bubble ai-success-card" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    );
  }
  return (
    <div className={`ai-msg ${msg.from}`}>
      <div className="ai-bubble" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

// ── Quick replies shown at idle ──
const IDLE_QUICK = [
  { label: '📅 Book a Slot', q: 'I want to book a slot' },
  { label: '💰 Pricing',     q: 'What are the prices?' },
  { label: '⚽ Sports',      q: 'What sports are available?' },
  { label: '🕐 Hours',       q: 'What are the working hours?' },
];

export default function AIAssistant() {
  const [open, setOpen]     = useState(false);
  const [msgs, setMsgs]     = useState([]);
  const [input, setInput]   = useState('');
  const [typing, setTyping] = useState(false);

  // Booking state
  const [booking, setBooking] = useState(null); // null = not booking
  // booking = { step, sport, date, time, duration, name, phone }

  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs, typing]);

  function pushBot(text, type) {
    setMsgs(m => [...m, { from: 'bot', text, type }]);
  }
  function pushUser(text) {
    setMsgs(m => [...m, { from: 'user', text }]);
  }

  function botReply(text, type, delay = 700) {
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      pushBot(text, type);
    }, delay + Math.random() * 300);
  }

  function openChat() {
    setOpen(true);
    if (msgs.length === 0) {
      pushBot("👋 Hey! I'm **Arena AI**, your personal TURF Arena assistant.\n\nI can answer questions OR **book a slot for you** step by step!\n\nWhat would you like to do?");
    }
  }

  // ── Start booking flow ──
  function startBooking() {
    setBooking({ step: 'sport' });
    botReply("Great! Let's book a slot for you. I'll ask a few quick questions.\n\n" + STEP_PROMPTS.sport);
  }

  // ── Handle booking step input ──
  function handleBookingStep(raw, current) {
    const val = raw.trim();

    if (val.toLowerCase() === 'cancel' || val.toLowerCase() === 'stop') {
      setBooking(null);
      botReply("Booking cancelled. No worries! Feel free to ask anything else. 😊");
      return;
    }

    switch (current.step) {
      case 'sport': {
        const sport = val === '1' || /foot/i.test(val) ? 'Football ⚽'
                    : val === '2' || /crick/i.test(val) ? 'Cricket 🏏'
                    : null;
        if (!sport) { botReply("Please reply **1** for Football or **2** for Cricket."); return; }
        setBooking(b => ({ ...b, sport, step: 'date' }));
        botReply(`**${sport}** — great choice! 🎉\n\n` + STEP_PROMPTS.date);
        break;
      }
      case 'date': {
        const date = parseDate(val);
        if (!date) { botReply("Please enter a valid date in **YYYY-MM-DD** format.\nExample: **2026-07-20**"); return; }
        const today = new Date(); today.setHours(0,0,0,0);
        if (new Date(date) < today) { botReply("That date is in the past! Please pick a future date. 📅"); return; }
        setBooking(b => ({ ...b, date, step: 'time' }));
        botReply(`📅 **${date}** — noted!\n\n` + STEP_PROMPTS.time);
        break;
      }
      case 'time': {
        const timeLabel = TIME_MAP[val];
        if (!timeLabel) { botReply("Please reply with a number from **1 to 17** for the time slot."); return; }
        setBooking(b => ({ ...b, time: val, timeLabel, step: 'duration' }));
        botReply(`🕐 **${timeLabel}** — perfect!\n\n` + STEP_PROMPTS.duration);
        break;
      }
      case 'duration': {
        if (!['1','2','3'].includes(val)) { botReply("Please reply **1**, **2**, or **3** for hours."); return; }
        setBooking(b => ({ ...b, duration: val, step: 'name' }));
        botReply(`⏱ **${val} hour${val > 1 ? 's' : ''}** — got it!\n\n` + STEP_PROMPTS.name);
        break;
      }
      case 'name': {
        if (val.length < 2) { botReply("Please enter your full name."); return; }
        setBooking(b => ({ ...b, name: val, step: 'phone' }));
        botReply(`Nice to meet you, **${val}**! 👋\n\n` + STEP_PROMPTS.phone);
        break;
      }
      case 'phone': {
        if (!/^[\d\s\+\-]{8,15}$/.test(val)) { botReply("Please enter a valid phone number."); return; }
        const updated = { ...current, phone: val, step: 'confirm' };
        setBooking(updated);
        const rate = calcRate(updated.date, updated.time);
        const total = rate * parseInt(updated.duration);
        const summary = `🎟️ **Booking Summary**\n\n` +
          `🏟️ Sport: **${updated.sport}**\n` +
          `📅 Date: **${updated.date}**\n` +
          `🕐 Time: **${updated.timeLabel}**\n` +
          `⏱ Duration: **${updated.duration} hr${updated.duration > 1 ? 's' : ''}**\n` +
          `👤 Name: **${updated.name}**\n` +
          `📱 Phone: **${val}**\n` +
          `💰 Rate: **₹${rate}/hr**\n` +
          `✅ Total: **₹${total.toLocaleString()}**\n\n` +
          `Reply **YES** to confirm or **NO** to cancel.`;
        botReply(summary, 'confirm-card', 900);
        break;
      }
      case 'confirm': {
        if (/yes|confirm|ok|sure|book/i.test(val)) {
          setBooking(null);
          const rate = calcRate(current.date, current.time);
          const total = rate * parseInt(current.duration);
          botReply(
            `🎉 **Booking Confirmed!**\n\n` +
            `Your slot has been reserved:\n` +
            `⚽ **${current.sport}** on **${current.date}** at **${current.timeLabel}** for **${current.duration} hr**\n\n` +
            `💰 Total: **₹${total.toLocaleString()}**\n\n` +
            `📱 A WhatsApp confirmation will be sent to **${current.phone}** shortly.\n\n` +
            `See you on the turf, **${current.name}**! 🏆`,
            'success-card',
            800
          );
        } else if (/no|cancel|stop/i.test(val)) {
          setBooking(null);
          botReply("Booking cancelled. No worries! Let me know if you need anything else. 😊");
        } else {
          botReply("Reply **YES** to confirm your booking or **NO** to cancel.");
        }
        break;
      }
    }
  }

  // ── Main send handler ──
  function send(text) {
    const q = (text || input).trim();
    if (!q) return;
    setInput('');
    pushUser(q);

    // If in booking flow
    if (booking) {
      setTimeout(() => handleBookingStep(q, booking), 300);
      return;
    }

    // Detect booking intent
    if (/\bbook\b|reserve|slot|want.*slot|book.*slot|i want to book/i.test(q)) {
      setTimeout(() => startBooking(), 400);
      return;
    }

    // General FAQ
    botReply(faqResponse(q));
  }

  // Dynamic quick replies based on state
  const quickReplies = booking
    ? booking.step === 'sport'    ? [{ label: '⚽ Football', q: '1' }, { label: '🏏 Cricket', q: '2' }]
    : booking.step === 'duration' ? [{ label: '1 Hour', q: '1' }, { label: '2 Hours', q: '2' }, { label: '3 Hours', q: '3' }]
    : booking.step === 'confirm'  ? [{ label: '✅ Yes, Confirm', q: 'YES' }, { label: '❌ Cancel', q: 'NO' }]
    : []
    : IDLE_QUICK;

  return (
    <div className="ai-fab">
      {open && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-avatar">🤖</div>
            <div className="ai-header-info">
              <div className="ai-name">Arena AI Assistant</div>
              <div className="ai-status">
                {booking ? `● Booking in progress — Step ${STEPS.indexOf(booking.step) + 1}/6` : '● Online — Here to help!'}
              </div>
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

          {quickReplies.length > 0 && (
            <div className="ai-quick-replies">
              {quickReplies.map(q => (
                <button key={q.q} className="ai-qr" onClick={() => send(q.q)}>{q.label}</button>
              ))}
            </div>
          )}

          <div className="ai-input-row">
            <input
              className="ai-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={booking ? 'Type your answer...' : 'Ask me anything...'}
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
