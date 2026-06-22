import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BendText({ text = 'TURF ARENA' }) {
  const containerRef = useRef(null);
  const sceneRef     = useRef({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Scene ──────────────────────────────────────
    const scene = new THREE.Scene();
    const aspect = container.clientWidth / container.clientHeight;
    const camera = new THREE.OrthographicCamera(
      -10 * aspect, 10 * aspect, 10, -10, 0.1, 1000
    );
    camera.position.set(0.6, 0.8, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;';
    container.appendChild(renderer.domElement);

    // ── Text textures ──────────────────────────────
    function makeTexture(shadow = false) {
      const cvs = document.createElement('canvas');
      cvs.width = 1024; cvs.height = 1024;
      const ctx = cvs.getContext('2d');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, 1024, 1024);

      ctx.font = 'bold 148px "Oswald", system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (shadow) {
        ctx.filter = 'blur(18px)';
        ctx.fillStyle = 'rgba(0,200,83,0.55)';
      } else {
        ctx.fillStyle = '#ffffff';
      }
      ctx.fillText(text, 512, 512);

      const tex = new THREE.CanvasTexture(cvs);
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    }

    const textTex   = makeTexture(false);
    const shadowTex = makeTexture(true);

    // ── Main shader (displacement) ─────────────────
    const mainMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture:      { value: textTex },
        uDisplacement: { value: new THREE.Vector3(999, 999, 999) },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform vec3 uDisplacement;

        float easeInOutCubic(float x) {
          return x < 0.5 ? 4.0*x*x*x : 1.0 - pow(-2.0*x+2.0,3.0)/2.0;
        }
        float map(float v,float a,float b,float c,float d){
          return c+(v-a)*(d-c)/(b-a);
        }

        void main(){
          vUv = uv;
          vec3 pos = position;
          vec4 world = modelMatrix * vec4(position,1.0);
          float dist = length(uDisplacement - world.xyz);
          float minD = 2.8;
          if(dist < minD){
            float t = easeInOutCubic(map(dist, 0.0, minD, 1.0, 0.0));
            pos.z += t * 0.55;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uTexture;
        void main(){ gl_FragColor = texture2D(uTexture, vUv); }
      `,
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
    });

    // ── Shadow shader ──────────────────────────────
    const shadowMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture:      { value: shadowTex },
        uDisplacement: { value: new THREE.Vector3(999, 999, 999) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vDist;
        uniform vec3 uDisplacement;
        void main(){
          vUv = uv;
          vec4 world = modelMatrix * vec4(position,1.0);
          vDist = length(uDisplacement - world.xyz);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
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
          float minD = 2.8;
          if(vDist < minD){
            float n = map(vDist,0.0,minD,1.0,0.0);
            color.a = easeOutQuad(n)*color.a*0.85;
          } else {
            color.a = 0.0;
          }
          gl_FragColor = color;
        }
      `,
      transparent: true, depthWrite: false, side: THREE.DoubleSide,
    });

    // ── Meshes ─────────────────────────────────────
    const geo      = new THREE.PlaneGeometry(15, 15, 150, 150);
    const textMesh = new THREE.Mesh(geo, mainMat);
    const shdwMesh = new THREE.Mesh(geo, shadowMat);
    textMesh.position.y = 1.8;
    shdwMesh.position.y = 1.8;
    shdwMesh.position.z = -0.06;
    scene.add(textMesh);
    scene.add(shdwMesh);

    // invisible hit plane for raycasting
    const hitGeo  = new THREE.PlaneGeometry(20, 20);
    const hitMat  = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 });
    const hitPlane = new THREE.Mesh(hitGeo, hitMat);
    hitPlane.name = 'hit';
    scene.add(hitPlane);

    // ── Raycasting + mouse ─────────────────────────
    const raycaster = new THREE.Raycaster();
    const pointer   = new THREE.Vector2();

    const onMouseMove = (e) => {
      pointer.x =  (e.clientX / window.innerWidth)  * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObject(hitPlane);
      if (hits.length) {
        mainMat.uniforms.uDisplacement.value.copy(hits[0].point);
        shadowMat.uniforms.uDisplacement.value.copy(hits[0].point);
      }
    };
    const onMouseLeave = () => {
      const far = new THREE.Vector3(999, 999, 999);
      mainMat.uniforms.uDisplacement.value.copy(far);
      shadowMat.uniforms.uDisplacement.value.copy(far);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);

    // ── Resize ─────────────────────────────────────
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

    // ── Animation loop ─────────────────────────────
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // ── Cleanup ────────────────────────────────────
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
    <div
      ref={containerRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
    />
  );
}
