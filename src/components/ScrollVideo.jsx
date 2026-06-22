import { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 151;
const pad = (n) => String(n).padStart(4, '0');

export default function ScrollVideo() {
  const canvasRef   = useRef(null);
  const framesRef   = useRef([]);
  const sectionRef  = useRef(null);
  const currentRef  = useRef(0);
  const dprRef      = useRef(1);

  const [loaded,      setLoaded]      = useState(0);
  const [ready,       setReady]       = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const [exitOpacity, setExitOpacity] = useState(0);

  // ── Draw one frame ────────────────────────────────────
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const img    = framesRef.current[index];
    if (!canvas || !img || !img.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    const cw  = canvas.width;
    const ch  = canvas.height;

    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let sw, sh, sx, sy;
    if (ir > cr) {
      sh = img.naturalHeight; sw = sh * cr;
      sx = (img.naturalWidth - sw) / 2; sy = 0;
    } else {
      sw = img.naturalWidth; sh = sw / cr;
      sx = 0; sy = (img.naturalHeight - sh) / 2;
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  }, []);

  // ── Preload all frames ────────────────────────────────
  useEffect(() => {
    dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
    const imgs = [];
    let done   = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src   = `/frames/frame_${pad(i)}.jpg`;
      img.onload = img.onerror = () => {
        done++;
        setLoaded(done);
        if (done === TOTAL_FRAMES) setReady(true);
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, []);

  // ── Resize + scroll listeners ─────────────────────────
  useEffect(() => {
    if (!ready) return;

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = dprRef.current;
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      drawFrame(currentRef.current);
    };
    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect     = section.getBoundingClientRect();
      const total    = section.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -rect.top);
      const progress = Math.min(1, scrolled / total);

      // mark that user has scrolled at all
      if (progress > 0.01) setScrolled(true);

      // frame index
      const idx = Math.min(TOTAL_FRAMES - 1, Math.floor(progress * TOTAL_FRAMES));
      if (idx !== currentRef.current) {
        currentRef.current = idx;
        drawFrame(idx);
      }

      // exit fade: start at 88%, full black at 100%
      const exit = Math.max(0, (progress - 0.88) / 0.12);
      setExitOpacity(exit);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, [ready, drawFrame]);

  const pct = Math.round((loaded / TOTAL_FRAMES) * 100);

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: '1000vh', background: '#000' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* Video frame canvas */}
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />

        {/* Dark vignette so edges feel cinematic */}
        {ready && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.65) 100%)',
          }} />
        )}

        {/* Loading screen */}
        {!ready && (
          <div style={{
            position: 'absolute', inset: 0, background: '#000',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 20,
          }}>
            <div style={{
              fontFamily: "'Oswald', sans-serif",
              fontSize: 13, letterSpacing: 6,
              color: '#00c853', textTransform: 'uppercase',
            }}>
              Loading
            </div>
            <div style={{ width: 220, height: 1, background: '#1a1a1a', borderRadius: 1 }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: 'linear-gradient(90deg, #00c853, #00e060)',
                borderRadius: 1, transition: 'width 0.12s linear',
              }} />
            </div>
            <div style={{ color: '#333', fontSize: 11, letterSpacing: 2 }}>{pct}%</div>
          </div>
        )}

        {/* Scroll hint — fades out once user scrolls */}
        {ready && (
          <div style={{
            position: 'absolute', bottom: 40, left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
            opacity: scrolled ? 0 : 1,
            transition: 'opacity 0.6s ease',
            pointerEvents: 'none',
          }}>
            <div style={{
              fontSize: 10, letterSpacing: 6, color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
            }}>
              Scroll to explore
            </div>
            <div style={{
              width: 1, height: 48,
              background: 'linear-gradient(to bottom, #00c853, transparent)',
              animation: 'sv-pulse 1.6s ease-in-out infinite',
            }} />
          </div>
        )}

        {/* Exit black overlay — fades in as section ends */}
        <div style={{
          position: 'absolute', inset: 0,
          background: '#000',
          opacity: exitOpacity,
          pointerEvents: 'none',
          transition: exitOpacity === 0 ? 'none' : 'opacity 0.05s linear',
        }} />
      </div>
    </section>
  );
}
