/**
 * Lightweight Three.js Hero Scene
 * Renders a gradient wireframe icosahedron, a Fresnel glowing core, and an
 * additive particle field (3 draw calls total, zero lights, zero textures).
 * Automatically adapts to hardware capability, software WebGL, visibility, and scroll.
 */
import * as THREE from 'three';

const VIOLET = new THREE.Color(0x7c5cff);
const CYAN = new THREE.Color(0x22d3ee);
const _tempColor = new THREE.Color();

function detectSoftwareWebGL() {
  try {
    const probeCanvas = document.createElement('canvas');
    const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    const loseExt = gl.getExtension('WEBGL_lose_context');
    if (loseExt) loseExt.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function initHeroThreeScene({ container, stageEl }) {
  if (!container) return null;

  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  // Test WebGL support
  const testCanvas = document.createElement('canvas');
  const glCheck = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
  if (!glCheck) return null;

  const isSoftwareGl = detectSoftwareWebGL();
  const isDesktop = window.innerWidth >= 768 && window.matchMedia('(pointer: fine)').matches;
  const isTouchOnly = !window.matchMedia('(pointer: fine)').matches;

  const lowSpecDevice =
    (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) ||
    (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: isDesktop && !isSoftwareGl,
      alpha: true,
      powerPreference: 'low-power',
    });
  } catch {
    return null;
  }

  const maxDpr = isSoftwareGl ? 1 : isDesktop ? 1.5 : 1.25;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, maxDpr));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;
  renderer.setSize(width, height, false);
  container.appendChild(renderer.domElement);

  if (stageEl) {
    stageEl.classList.add('has-webgl');
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(44, width / Math.max(height, 1), 0.1, 40);
  const baseCameraZ = isDesktop ? 5.8 : 6.5;
  camera.position.set(0, 0, baseCameraZ);

  const heroGroup = new THREE.Group();
  heroGroup.position.set(isDesktop ? 1.45 : 0, isDesktop ? 0.08 : 0.35, 0);
  scene.add(heroGroup);

  // 1) Gradient Wireframe Icosahedron (detail 1) -> Draw call 1
  const baseIco = new THREE.IcosahedronGeometry(1.5, 1);
  const wireGeo = new THREE.WireframeGeometry(baseIco);
  baseIco.dispose();

  const wirePos = wireGeo.attributes.position;
  const wireColors = new Float32Array(wirePos.count * 3);
  for (let i = 0; i < wirePos.count; i += 1) {
    const y = wirePos.getY(i);
    const x = wirePos.getX(i);
    const t = THREE.MathUtils.clamp((y + x * 0.4 + 1.5) / 3.0, 0, 1);
    _tempColor.copy(VIOLET).lerp(CYAN, t);
    wireColors[i * 3] = _tempColor.r;
    wireColors[i * 3 + 1] = _tempColor.g;
    wireColors[i * 3 + 2] = _tempColor.b;
  }
  wireGeo.setAttribute('color', new THREE.BufferAttribute(wireColors, 3));

  const wireMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: document.documentElement.getAttribute('data-theme') === 'light' ? 0.72 : 0.56,
  });
  const wireframeMesh = new THREE.LineSegments(wireGeo, wireMat);
  heroGroup.add(wireframeMesh);

  // 2) Glowing Core (Fresnel ShaderMaterial, zero lights/textures) -> Draw call 2
  const coreGeo = new THREE.IcosahedronGeometry(0.72, 1);
  const coreMat = new THREE.ShaderMaterial({
    uniforms: {
      uColorA: { value: VIOLET.clone() },
      uColorB: { value: CYAN.clone() },
      uOpacity: { value: 0.42 },
    },
    vertexShader: `
      varying vec3 vNormalDir;
      varying vec3 vViewDir;
      void main() {
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vNormalDir = normalize(normalMatrix * normal);
        vViewDir = normalize(-mvPosition.xyz);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform float uOpacity;
      varying vec3 vNormalDir;
      varying vec3 vViewDir;
      void main() {
        float fresnel = pow(1.0 - max(dot(normalize(vNormalDir), normalize(vViewDir)), 0.0), 1.8);
        vec3 col = mix(uColorA, uColorB, clamp(vNormalDir.y * 0.5 + 0.5, 0.0, 1.0));
        gl_FragColor = vec4(col, (0.12 + fresnel * 0.68) * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  heroGroup.add(coreMesh);

  // 3) Soft Particle Field (<= 900 desktop, <= 350 mobile; halved if low-spec) -> Draw call 3
  const baseParticles = isDesktop ? 900 : 350;
  let activeParticleCount = lowSpecDevice ? Math.floor(baseParticles * 0.5) : baseParticles;

  const particlesGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(baseParticles * 3);
  const particleColors = new Float32Array(baseParticles * 3);

  for (let i = 0; i < baseParticles; i += 1) {
    const radius = 2.1 + Math.random() * 4.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
    particlePositions[i * 3 + 2] = radius * Math.cos(phi) - 0.8;

    _tempColor.copy(VIOLET).lerp(CYAN, Math.random());
    particleColors[i * 3] = _tempColor.r;
    particleColors[i * 3 + 1] = _tempColor.g;
    particleColors[i * 3 + 2] = _tempColor.b;
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particlesGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
  particlesGeo.setDrawRange(0, activeParticleCount);

  const particlesMat = new THREE.PointsMaterial({
    size: isDesktop ? 0.032 : 0.04,
    vertexColors: true,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const particlePoints = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particlePoints);

  // State for pointer parallax, scroll drift, pause/resume, and adaptive quality
  let pointerX = 0;
  let pointerY = 0;
  let scrollProgress = 0;
  let isHeroVisible = true;
  let isTabVisible = document.visibilityState !== 'hidden';
  let isDisposed = false;
  let frameId = 0;
  let resizeRafId = 0;
  let lastTime = performance.now();
  let elapsed = 0;
  let slowFrameStreak = 0;
  let qualityReduced = lowSpecDevice;

  function onPointerMove(e) {
    if (isTouchOnly) return;
    pointerX = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
    pointerY = (e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
  }

  if (!isTouchOnly) {
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  function applyResize() {
    resizeRafId = 0;
    if (isDisposed) return;
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    const nowDesktop = w >= 768;

    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSoftwareGl ? 1 : nowDesktop ? 1.5 : 1.25));
    renderer.setSize(w, h, false);

    heroGroup.position.x = nowDesktop ? 1.45 : 0;
    heroGroup.position.y = nowDesktop ? 0.08 : 0.35;
  }

  function onResize() {
    if (!resizeRafId) {
      resizeRafId = requestAnimationFrame(applyResize);
    }
  }
  window.addEventListener('resize', onResize, { passive: true });

  // Theme update support
  function syncTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    wireMat.opacity = isLight ? 0.78 : 0.56;
    particlesMat.opacity = isLight ? 0.55 : 0.72;
    particlesMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    particlesMat.needsUpdate = true;
  }

  const themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  syncTheme();

  // Software WebGL frame pacing helper
  function afterDraw(cb) {
    const gl = renderer.getContext();
    if (gl && typeof gl.fenceSync === 'function') {
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    } else {
      frameId = window.setTimeout(cb, 80);
    }
  }

  function tick(now) {
    if (isDisposed || !isHeroVisible || !isTabVisible) return;

    const rawDeltaMs = (now || performance.now()) - lastTime;
    lastTime = now || performance.now();
    const dt = Math.min(Math.max(rawDeltaMs / 1000, 0.001), 0.05);
    elapsed += dt;

    // Adaptive quality guard: if frame time > 24ms consistently, halve particles
    if (!qualityReduced && rawDeltaMs > 24) {
      slowFrameStreak += 1;
      if (slowFrameStreak >= 18) {
        qualityReduced = true;
        activeParticleCount = Math.max(120, Math.floor(activeParticleCount * 0.5));
        particlesGeo.setDrawRange(0, activeParticleCount);
      }
    } else if (rawDeltaMs <= 20) {
      slowFrameStreak = Math.max(0, slowFrameStreak - 1);
    }

    // Slow auto-rotation + gentle floating
    wireframeMesh.rotation.y += dt * 0.16;
    wireframeMesh.rotation.x += dt * 0.08;
    coreMesh.rotation.y -= dt * 0.24;
    coreMesh.rotation.z += dt * 0.1;

    heroGroup.position.y = (window.innerWidth >= 768 ? 0.08 : 0.35) + Math.sin(elapsed * 0.85) * 0.12;
    particlePoints.rotation.y = elapsed * 0.028;

    // Desktop pointer parallax + GSAP scroll drift
    const targetCamX = isTouchOnly ? 0 : pointerX * 0.28;
    const targetCamY = (isTouchOnly ? 0 : -pointerY * 0.2) - scrollProgress * 0.65;
    const targetCamZ = baseCameraZ + scrollProgress * 1.15;

    camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamX, 4.5, dt);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamY, 4.5, dt);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamZ, 4.5, dt);
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);

    if (isSoftwareGl) {
      afterDraw(() => tick(performance.now()));
    } else {
      frameId = requestAnimationFrame(tick);
    }
  }

  function startLoop() {
    if (isDisposed || !isHeroVisible || !isTabVisible) return;
    cancelAnimationFrame(frameId);
    clearTimeout(frameId);
    lastTime = performance.now();
    if (isSoftwareGl) {
      tick(lastTime);
    } else {
      frameId = requestAnimationFrame(tick);
    }
  }

  function stopLoop() {
    cancelAnimationFrame(frameId);
    clearTimeout(frameId);
  }

  // Pause when hero scrolls offscreen
  const heroObserver = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      const nextVisible = Boolean(entry && entry.isIntersecting);
      if (nextVisible !== isHeroVisible) {
        isHeroVisible = nextVisible;
        if (isHeroVisible && isTabVisible) startLoop();
        else stopLoop();
      }
    },
    { threshold: 0.02 }
  );
  heroObserver.observe(stageEl || container);

  // Pause when tab is hidden
  function onVisibilityChange() {
    isTabVisible = document.visibilityState !== 'hidden';
    if (isTabVisible && isHeroVisible) startLoop();
    else stopLoop();
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Scroll drift hook (updated via GSAP ScrollTrigger or scroll listener)
  function setScrollProgress(progress) {
    scrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
  }

  // Kick off render loop
  startLoop();

  return {
    setScrollProgress,
    dispose() {
      isDisposed = true;
      stopLoop();
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      heroObserver.disconnect();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('resize', onResize);
      if (!isTouchOnly) window.removeEventListener('pointermove', onPointerMove);

      wireGeo.dispose();
      wireMat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      if (stageEl) stageEl.classList.remove('has-webgl');
    },
  };
}
