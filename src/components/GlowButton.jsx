import { useId, useState } from 'react';

export default function GlowButton({ children = 'Book Now', onClick, href, style = {} }) {
  const id = useId().replace(/:/g, '');
  const [hovered, setHovered] = useState(false);
  const [active, setActive]   = useState(false);

  const glowOpacity = active ? 1 : hovered ? 0.85 : 0.55;
  const animClass   = hovered ? 'glow-spin' : '';

  const filters = {
    f1: `ga-${id}`,
    f2: `gb-${id}`,
    f3: `gc-${id}`,
  };

  const inner = (
    <div
      style={{ position: 'relative', display: 'inline-block', margin: '0 4px', ...style }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
    >
      {/* SVG Filters */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter width="300%" x="-100%" height="300%" y="-100%" id={filters.f1}>
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 9 0" />
          </filter>
          <filter width="300%" x="-100%" height="300%" y="-100%" id={filters.f2}>
            <feColorMatrix values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 0" />
          </filter>
          <filter width="300%" x="-100%" height="300%" y="-100%" id={filters.f3}>
            <feColorMatrix values="1 0 0 0.1 0  0 1 0 0.3 0  0 0 1 0.1 0  0 0 0 2 0" />
          </filter>
        </defs>
      </svg>

      {/* Outer glow */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: -2,
        opacity: glowOpacity, overflow: 'hidden',
        filter: `blur(2em) url(#${filters.f1})`,
        transition: 'opacity 0.3s',
      }}>
        <div className={animClass} style={{
          position: 'absolute', inset: '-150%',
          background: 'linear-gradient(90deg, #00c853 20%, transparent 50%, #00ff88 80%)',
        }} />
      </div>

      {/* Middle glow */}
      <div style={{
        position: 'absolute', inset: '-0.125em', zIndex: -2,
        opacity: glowOpacity, overflow: 'hidden',
        filter: `blur(0.25em) url(#${filters.f2})`,
        borderRadius: '0.875em',
        transition: 'opacity 0.3s',
      }}>
        <div className={animClass} style={{
          position: 'absolute', inset: '-150%',
          background: 'linear-gradient(90deg, #00e060 20%, transparent 45%, transparent 55%, #b9f6ca 80%)',
        }} />
      </div>

      {/* Button border shell */}
      <div style={{
        padding: '2px',
        background: 'rgba(0,0,0,0.4)',
        borderRadius: '17px',
      }}>
        <div style={{ position: 'relative' }}>
          {/* Inner glow */}
          <div style={{
            position: 'absolute', inset: '-2px', zIndex: -1,
            opacity: glowOpacity, overflow: 'hidden',
            filter: `blur(2px) url(#${filters.f3})`,
            borderRadius: '15px',
            transition: 'opacity 0.3s',
          }}>
            <div className={animClass} style={{
              position: 'absolute', inset: '-150%',
              background: 'linear-gradient(90deg, #b9f6ca 30%, transparent 45%, transparent 55%, #00c853 70%)',
            }} />
          </div>

          {/* Button surface */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '12px 28px',
            background: active ? '#0d1a0d' : hovered ? '#111a11' : '#0f1a0f',
            color: '#ffffff',
            borderRadius: '15px',
            fontSize: '15px',
            fontWeight: 700,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: '0.3px',
            cursor: 'pointer',
            userSelect: 'none',
            transition: 'background 0.2s',
            whiteSpace: 'nowrap',
          }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return <a href={href} style={{ textDecoration: 'none' }} onClick={onClick}>{inner}</a>;
  }
  return <div style={{ display: 'inline-block', cursor: 'pointer' }} onClick={onClick}>{inner}</div>;
}
