import { useState } from 'react';

const ALL_ITEMS = [
  { emoji: '⚽', label: 'Goal Celebration', cat: 'football' },
  { emoji: '🏏', label: 'Cricket Finals', cat: 'cricket' },
  { emoji: '🌙', label: 'Night Football', cat: 'night' },
  { emoji: '🏆', label: 'Champions Cup', cat: 'celebration' },
  { emoji: '🤸', label: 'Training Drill', cat: 'training' },
  { emoji: '⚽', label: '5-a-side Match', cat: 'football' },
  { emoji: '🌃', label: 'Floodlit Arena', cat: 'night' },
  { emoji: '🎉', label: 'Team Victory', cat: 'celebration' },
  { emoji: '🏏', label: 'Batting Practice', cat: 'cricket' },
  { emoji: '💪', label: 'Warm Up Session', cat: 'training' },
  { emoji: '⚽', label: 'Penalty Shootout', cat: 'football' },
  { emoji: '🌙', label: 'Night Tournament', cat: 'night' },
  { emoji: '🥇', label: 'Trophy Lift', cat: 'celebration' },
  { emoji: '🏃', label: 'Sprint Training', cat: 'training' },
  { emoji: '🏏', label: 'Net Session', cat: 'cricket' },
  { emoji: '🔥', label: 'Final Whistle', cat: 'football' },
  { emoji: '📸', label: 'Team Photo', cat: 'celebration' },
  { emoji: '🤝', label: 'Pre-match Huddle', cat: 'training' },
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
  const items = active === 'all' ? ALL_ITEMS : ALL_ITEMS.filter(i => i.cat === active);

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
          {items.map((item, i) => (
            <div className="gallery-item" key={i}>
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
