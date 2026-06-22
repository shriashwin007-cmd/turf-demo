import { useEffect, useRef, useState } from 'react';

const TOTAL_FRAMES = 151;
const FRAMES_DIR = '/frames/';

function pad(n) {
  return String(n).padStart(4, '0');
}

export default function ScrollVideo() {
  const canvasRef     = useRef(null);
  const framesRef     = useRef([]);
  const sectionRef    = useRef(null);
  const currentRef    = useRef(0);
  const [loaded, setLoaded]   = useState(0);
  const [ready, setReady]     = useState(false);

  // ── Preload all frames ──────────────────────────────
  useEffect(() => {
    const imgs = [];
    let done = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `${FRAMES_DIR}frame_${pad(i)}.jpg`;
      img.onload = () => {
        done++;
        setLoaded(done);
        if (done === TOTAL_FRAMES) setReady(true);
      };
      img.onerror = () => {
        done++;
        setLoaded(done);
        if (done === TOTAL_FRAMES) setReady(true);
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, []);

  // ── Draw a frame to canvas ──────────────────────────
  const drawFrame = (index) => {
    const canvas = canvasRef.current;
    const img = framesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;

    // Cover: maintain aspect ratio, crop to fill
    const ir = img.naturalWidth / img.naturalHeight;
    const cr = cw / ch;
    let sw, sh, sx, sy;
    if (ir > cr) {
      sh = img.naturalHeight;
      sw = sh * cr;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    } else {
      sw = img.naturalWidth;
      sh = sw / cr;
      sx = 0;
      sy = (img.naturalHeight - sh) / 2;
    }
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
  };

  // ── Scroll handler ──────────────────────────────────
  useEffect(() => {
    if (!ready) return;

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      canvas.style.width  = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(currentRef.current);
    };

    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      const idx = Math.min(
        TOTAL_FRAMES - 1,
        Math.floor(progress * TOTAL_FRAMES)
      );
      if (idx !== currentRef.current) {
        currentRef.current = idx;
        drawFrame(idx);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resize);
    };
  }, [ready]);

  const pct = Math.round((loaded / TOTAL_FRAMES) * 100);

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: '450vh', background: '#000' }}
    >
      {/* Sticky canvas container */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%' }}
        />

        {/* Loading overlay */}
        {!ready && (
          <div style={{
            position: 'absolute', inset: 0,
            background: '#000',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 16,
          }}>
            <div style={{ color: 'var(--green)', fontSize: 13, letterSpacing: 4, textTransform: 'uppercase' }}>
              Loading
            </div>
            <div style={{ width: 200, height: 2, background: '#222', borderRadius: 2 }}>
              <div style={{
                height: '100%',
                width: `${pct}%`,
                background: 'var(--green)',
                borderRadius: 2,
                transition: 'width 0.1s linear',
              }} />
            </div>
            <div style={{ color: '#555', fontSize: 12 }}>{pct}%</div>
          </div>
        )}

        {/* Overlay text — fades in when loaded */}
        {ready && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.65) 100%)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-end',
            paddingBottom: 60,
            pointerEvents: 'none',
          }}>
            <p style={{
              color: 'rgba(255,255,255,0.55)',
              fontSize: 13,
              letterSpacing: 5,
              textTransform: 'uppercase',
              margin: 0,
            }}>
              Scroll to explore
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
