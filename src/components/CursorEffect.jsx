import { useEffect, useRef, useCallback } from 'react';

export default function CursorEffect({
  brushSize = 90,
  lifetime = 900,
  rStart = 6,
  rVary = 0.45,
  stampStep = 10,
  maxStamps = 180,
  segments = 32,
  wobble = [0.13, 0.08, 0.05],
}) {
  const canvasRef   = useRef(null);
  const stampsRef   = useRef([]);
  const runningRef  = useRef(false);
  const lastPosRef  = useRef(null);

  // ── resize canvas to viewport ──
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width  = Math.round(window.innerWidth  * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    canvas.style.width  = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  // ── draw one ink stamp (green glow) ──
  const drawStamp = useCallback((ctx, x, y, r, seed, alpha) => {
    const g = ctx.createRadialGradient(x, y, r * 0.08, x, y, r);
    g.addColorStop(0,   `rgba(0,230,80,${0.55 * alpha})`);
    g.addColorStop(0.4, `rgba(0,200,83,${0.28 * alpha})`);
    g.addColorStop(1,   `rgba(0,200,83,0)`);
    ctx.fillStyle = g;

    ctx.beginPath();
    for (let i = 0; i <= segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      const w =
        0.78 +
        wobble[0] * Math.sin(a * 3 + seed) +
        wobble[1] * Math.sin(a * 5 + seed * 2.1) +
        wobble[2] * Math.sin(a * 7 + seed * 0.7);
      const px = x + Math.cos(a) * r * w;
      const py = y + Math.sin(a) * r * w;
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }, [segments, wobble]);

  // ── add a stamp to the list ──
  const addStamp = useCallback((x, y) => {
    const stamps = stampsRef.current;
    if (stamps.length >= maxStamps) stamps.shift();
    stamps.push({
      x, y,
      born: performance.now(),
      seed: Math.random() * Math.PI * 2,
      rmax: brushSize * (1 - rVary + Math.random() * rVary),
    });
  }, [brushSize, rVary, maxStamps]);

  // ── stamp continuously along mouse path ──
  const stampAlong = useCallback((x, y) => {
    const last = lastPosRef.current;
    if (!last) {
      addStamp(x, y);
    } else {
      const dx = x - last.x;
      const dy = y - last.y;
      const dist = Math.hypot(dx, dy);
      const steps = Math.max(1, Math.ceil(dist / stampStep));
      for (let i = 1; i <= steps; i++) {
        addStamp(last.x + (dx * i) / steps, last.y + (dy * i) / steps);
      }
    }
    lastPosRef.current = { x, y };
  }, [addStamp, stampStep]);

  // ── animation loop ──
  const loop = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const now = performance.now();
    const stamps = stampsRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = stamps.length - 1; i >= 0; i--) {
      const t = (now - stamps[i].born) / lifetime;
      if (t >= 1) { stamps.splice(i, 1); continue; }
      const ease  = 1 - Math.pow(1 - t, 3);
      const r     = rStart + (stamps[i].rmax - rStart) * ease;
      const alpha = 1 - t * t;
      drawStamp(ctx, stamps[i].x, stamps[i].y, r, stamps[i].seed, alpha);
    }

    if (stamps.length) {
      requestAnimationFrame(loop);
    } else {
      runningRef.current = false;
    }
  }, [drawStamp, lifetime, rStart]);

  const startLoop = useCallback(() => {
    if (!runningRef.current) {
      runningRef.current = true;
      requestAnimationFrame(loop);
    }
  }, [loop]);

  // ── attach global listeners ──
  useEffect(() => {
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      stampAlong(e.clientX, e.clientY);
      startLoop();
    };
    const onLeave = () => { lastPosRef.current = null; };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [resize, stampAlong, startLoop]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    />
  );
}
