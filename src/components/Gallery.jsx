import { useState } from 'react';

const REAL_IMGS = [
  { src: 'https://res.cloudinary.com/dysoq8l4d/image/upload/v1782148001/Artificial_turf_at_a_stadium_q6fujf.jpg', label: 'Stadium View', cat: 'football' },
  { src: 'https://res.cloudinary.com/dysoq8l4d/image/upload/v1782148173/artificial-turf-of-soccer-football-field-photo_cwnrpp.jpg', label: 'Football Field', cat: 'football' },
  { src: 'https://res.cloudinary.com/dysoq8l4d/image/upload/v1782148240/photo-1704633785114-52104ce3d626_o0p3rj.avif', label: 'Night Match', cat: 'night' },
  { src: 'https://res.cloudinary.com/dysoq8l4d/image/upload/v1782148311/images-2_qr1ygq.jpg', label: 'Ground Overview', cat: 'football' },
];

const EMOJI_ITEMS = [
  { emoji: '🏏', label: 'Cricket Finals', cat: 'cricket' },
  { emoji: '🌙', label: 'Night Football', cat: 'night' },
  { emoji: '🏆', label: 'Champions Cup', cat: 'celebration' },
  { emoji: '🤸', label: 'Training Drill', cat: 'training' },
  { emoji: '🌃', label: 'Floodlit Arena', cat: 'night' },
  { emoji: '🎉', label: 'Team Victory', cat: 'celebration' },
  { emoji: '🏏', label: 'Batting Practice', cat: 'cricket' },
  { emoji: '💪', label: 'Warm Up Session', cat: 'training' },
  { emoji: '🌙', label: 'Night Tournament', cat: 'night' },
  { emoji: '🥇', label: 'Trophy Lift', cat: 'celebration' },
  { emoji: '🏃', label: 'Sprint Training', cat: 'training' },
  { emoji: '🏏', label: 'Net Session', cat: 'cricket' },
  { emoji: '🔥', label: 'Final Whistle', cat: 'football' },
  { emoji: '📸', label: 'Team Photo', cat: 'celebration' },
];

const CATS = [
  { key: 'all', label: 'All' },
  { key: 'football', label: 'Football Matches' },
  { key: 'cricket', label: 'Cricket Tournaments' },
  { key: 'night', label: 'Night Matches' },
  { key: 'celebration', label: 'Team Celebrations' },
  { key: 'training', label: 'Training Sessions' },
];

export default function Gallery() {
  const [active, setActive] = useState('all');

  const realFiltered = active === 'all' ? REAL_IMGS : REAL_IMGS.filter(i => i.cat === active);
  const emojiFiltered = active === 'all' ? EMOJI_ITEMS : EMOJI_ITEMS.filter(i => i.cat === active);

  return (
    <section id="gallery">
      <div className="container">
        <div className="section-label">Gallery</div>
        <h2 className="section-title">Moments at TURF Arena</h2>
        <div className="gallery-cats">
          {CATS.map(c => (
            <button
              key={c.key}
              className={`gallery-cat${active === c.key ? ' active' : ''}`}
              onClick={() => setActive(c.key)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <div className="gallery-grid">
          {/* Real photos first */}
          {realFiltered.map((item, i) => (
            <div className="gallery-item" key={`real-${i}`}>
              <img
                src={item.src}
                alt={item.label}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
              <div className="gallery-overlay"><span style={{ fontSize: 24 }}>🔍</span></div>
              <div className="gallery-label">{item.label}</div>
            </div>
          ))}
          {/* Emoji placeholders after */}
          {emojiFiltered.map((item, i) => (
            <div className="gallery-item" key={`emoji-${i}`}>
              <div className="gallery-emoji">{item.emoji}</div>
              <div className="gallery-overlay"><span style={{ fontSize: 24 }}>🔍</span></div>
              <div className="gallery-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
