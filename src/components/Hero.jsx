import GlowButton from './GlowButton';
import BendText from './BendText';

const HERO_BG = 'https://res.cloudinary.com/dysoq8l4d/image/upload/v1782148001/Artificial_turf_at_a_stadium_q6fujf.jpg';

const stats = [
  { num: '15K+', label: 'Happy Players' },
  { num: '4.9★', label: 'Rating' },
  { num: '500+', label: 'Monthly Bookings' },
  { num: '3', label: 'Pro Grounds' },
];

export default function Hero() {
  return (
    <section
      className="hero"
      id="home"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.78) 0%, rgba(0,15,0,0.84) 55%, rgba(0,0,0,0.92) 100%)',
        zIndex: 0,
      }} />

      {/* Three.js BendText — "TURF ARENA" bends with mouse */}
      <div style={{ position: 'absolute', inset: 0, top: '-18%', zIndex: 0, pointerEvents: 'none' }}>
        <BendText text="TURF ARENA" />
      </div>

      {/* Hero content sits above the 3D layer */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-badge">Chennai's Premier Sports Facility</div>

        {/* Invisible spacer so BendText text is visible behind the h1 */}
        <div style={{ height: 8 }} />

        <h1 style={{ opacity: 0, pointerEvents: 'none', userSelect: 'none', margin: 0, lineHeight: 1 }}>
          <span>TURF</span> ARENA
        </h1>

        <p className="hero-tag">Where Champions Play</p>

        <div className="hero-btns">
          <GlowButton href="#booking">⚡ Book a Slot</GlowButton>
          <a href="#about" className="btn-outline">Explore Facility</a>
        </div>

        <div className="hero-stats">
          {stats.map(s => (
            <div className="hero-stat" key={s.label}>
              <div className="hero-stat-num">{s.num}</div>
              <div className="hero-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-line" />
    </section>
  );
}
