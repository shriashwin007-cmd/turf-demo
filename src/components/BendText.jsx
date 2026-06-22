import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BendText({ text = 'TURF ARENA' }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene ──────────────────────────────────────────
    const scene  = new THREE.Scene();
    const aspect = container.clientWidth / container.clientHeight;

    // Perfectly frontal orthographic camera — no tilt at all
    const camera = new THREE.OrthographicCamera(
      -10 * aspect, 10 * aspect, 10, -10, 0.1, 1000
    );
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true, alpha: true, powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(renderer.domElement);

    // ── Text textures ───────────────────────────────────
    function makeTexture(shadow = false) {
      const cvs = document.createElement('canvas');
      cvs.width = 1024; cvs.height = 256;
      const ctx = cvs.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      ctx.font         = 'bold 140px "Oswald", system-ui, sans-serif';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';

      if (shadow) {
        ctx.filter    = 'blur(14px)';
        ctx.fillStyle = 'rgba(0,200,83,0.6)';
      } else {
        ctx.fillStyle = '#ffffff';
      }
      ctx.fillText(text, cvs.width / 2, cvs.height / 2);

      const tex = new THREE.CanvasTexture(cvs);
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    }

    const textTex   = makeTexture(false);
    const shadowTex = makeTexture(true);

    // ── Main shader — Y-axis lift displacement ──────────
    // With a frontal orthographic camera, Z displacement is invisible.
    // Y displacement (letters rise upward) is perfectly visible and clean.
    const mainMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture:      { value: textTex },
        uDisplacement: { value: new THREE.Vector2(999, 999) },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform vec2 uDisplacement;

        float easeInOutCubic(float x) {
          return x < 0.5 ? 4.0*x*x*x : 1.0 - pow(-2.0*x+2.0,3.0)/2.0;
        }
        float map(float v,float a,float b,float c,float d){
          return c+(v-a)*(d-c)/(b-a);
        }

        void main(){
          vUv = uv;
          vec3 pos = position;

          // 2-D distance in the XY plane — clean, no Z artifacts
          vec4 world = modelMatrix * vec4(position, 1.0);
          float dist = length(uDisplacement - world.xy);
          float minD = 2.6;

          if(dist < minD){
            float t = easeInOutCubic(map(dist, 0.0, minD, 1.0, 0.0));
            pos.y += t * 0.75;   // lift letters upward
          }

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        void main(){ gl_FragColor = texture2D(uTexture, vUv); }
      `,
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
    });

    // ── Shadow / glow shader ────────────────────────────
    const shadowMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture:      { value: shadowTex },
        uDisplacement: { value: new THREE.Vector2(999, 999) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vDist;
        uniform vec2 uDisplacement;
        void main(){
          vUv = uv;
          vec4 world = modelMatrix * vec4(position, 1.0);
          vDist = length(uDisplacement - world.xy);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying float vDist;
        uniform sampler2D uTexture;
        float map(float v,float a,float b,float c,float d){ return c+(v-a)*(d-c)/(b-a); }
        float easeOutQuad(float x){ return 1.0-(1.0-x)*(1.0-x); }
        void main(){
          vec4 color = texture2D(uTexture, vUv);
          float minD = 2.6;
          if(vDist < minD){
            float n = map(vDist, 0.0, minD, 1.0, 0.0);
            color.a = easeOutQuad(n) * color.a * 0.9;
          } else {
            color.a = 0.0;
          }
          gl_FragColor = color;
        }
      `,
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
    });

    // ── Meshes ──────────────────────────────────────────
    // Wide aspect-ratio geometry (4:1) to match banner-style text
    const geo      = new THREE.PlaneGeometry(18, 4.5, 200, 50);
    const textMesh = new THREE.Mesh(geo, mainMat);
    const shdwMesh = new THREE.Mesh(geo, shadowMat);
    // Slightly above center so text sits in upper hero area
    textMesh.position.y = 2.0;
    shdwMesh.position.y = 2.0;
    shdwMesh.position.z = -0.05;
    scene.add(shdwMesh);
    scene.add(textMesh);

    // Invisible hit plane for raycasting (same plane as text)
    const hitGeo   = new THREE.PlaneGeometry(22, 8);
    const hitMat   = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const hitPlane = new THREE.Mesh(hitGeo, hitMat);
    hitPlane.position.y = 2.0;
    scene.add(hitPlane);

    // ── Mouse → world-space raycasting ─────────────────
    const raycaster = new THREE.Raycaster();
    const pointer   = new THREE.Vector2();

    const onMouseMove = (e) => {
      pointer.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(hitPlane);
      if (hits.length) {
        const p = hits[0].point;
        mainMat.uniforms.uDisplacement.value.set(p.x, p.y);
        shadowMat.uniforms.uDisplacement.value.set(p.x, p.y);
      }
    };
    const onMouseLeave = () => {
      mainMat.uniforms.uDisplacement.value.set(999, 999);
      shadowMat.uniforms.uDisplacement.value.set(999, 999);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // ── Resize ──────────────────────────────────────────
    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      const a = w / h;
      camera.left   = -10 * a;
      camera.right  =  10 * a;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // ── Render loop ─────────────────────────────────────
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ─────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      textTex.dispose(); shadowTex.dispose();
      geo.dispose(); hitGeo.dispose();
      mainMat.dispose(); shadowMat.dispose(); hitMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [text]);

  return (
    <div ref={containerRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />
  );
}
