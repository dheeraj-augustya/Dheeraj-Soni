/**
 * Lightweight Three.js Hero Scene
 * Renders a gradient wireframe icosahedron, a Fresnel inner glow core, and an
 * additive particle field (3 draw calls total, zero lights, zero textures).
 * Automatically adapts placement by breakpoint (Desktop right-offset 76%,
 * Tablet top-right, Mobile upper-right), theme, hardware capability, and visibility.
 */
import * as THREE from 'three';

const DARK_COLOR_A = new THREE.Color(0x8b5cf6);
const DARK_COLOR_B = new THREE.Color(0x5b3df5);
const DARK_COLOR_C = new THREE.Color(0x22d3ee);

const LIGHT_COLOR_A = new THREE.Color(0x5b3df5);
const LIGHT_COLOR_B = new THREE.Color(0x4338ca);
const LIGHT_COLOR_C = new THREE.Color(0x0e7490);

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

function getLayoutConfig(width) {
  if (width >= 1200) {
    // Desktop: center at ~76% viewport width, vertically centered on headline block, ~15% smaller
    return {
      u: 0.76,
      v: 0.48,
      scale: 0.85,
      cameraZ: 5.9,
      isDesktopInteractive: true,
    };
  }
  if (width >= 768) {
    // Tablet: a separate right-hand visual beside the introduction.
    return {
      u: 0.82,
      v: 0.5,
      scale: 0.48,
      cameraZ: 6.2,
      isDesktopInteractive: false,
    };
  }
  // Mobile: upper-right, smaller
  return {
    u: 0.65,
    v: 0.5,
    scale: 1.1,
    cameraZ: 6.5,
    isDesktopInteractive: false,
  };
}

export function initHeroThreeScene({ container, stageEl }) {
  if (!container) return null;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return null;
  }

  const testCanvas = document.createElement('canvas');
  const glCheck = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
  if (!glCheck) return null;

  const isSoftwareGl = detectSoftwareWebGL();
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const isTouchOnly = !isFinePointer;

  const lowSpecDevice =
    (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) ||
    (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4);

  const initialWidth = container.clientWidth || window.innerWidth;
  const initialHeight = container.clientHeight || window.innerHeight;
  const initialDesktop = initialWidth >= 768 && isFinePointer;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: initialDesktop && !isSoftwareGl,
      alpha: true,
      powerPreference: 'low-power',
    });
  } catch {
    return null;
  }

  const getMaxDpr = (w) => (isSoftwareGl ? 1 : w >= 768 ? 1.5 : 1.25);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, getMaxDpr(initialWidth)));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setSize(initialWidth, initialHeight, false);
  container.appendChild(renderer.domElement);

  if (stageEl) {
    stageEl.classList.add('has-webgl');
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    44,
    initialWidth / Math.max(initialHeight, 1),
    0.1,
    40
  );

  let layout = getLayoutConfig(initialWidth);
  camera.position.set(0, 0, layout.cameraZ);

  const heroGroup = new THREE.Group();
  scene.add(heroGroup);

  const baseAnchor = { x: 0, y: 0 };

  function updateAnchorFromViewport() {
    const fovRad = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const halfH = layout.cameraZ * Math.tan(fovRad);
    const halfW = halfH * camera.aspect;

    baseAnchor.x = (layout.u * 2 - 1) * halfW;
    baseAnchor.y = (1 - layout.v * 2) * halfH;

    heroGroup.position.set(baseAnchor.x, baseAnchor.y, 0);
    heroGroup.scale.setScalar(layout.scale);
  }

  // 1) Gradient Wireframe Icosahedron (detail 1) -> Draw call 1
  const baseIco = new THREE.IcosahedronGeometry(1.5, 1);
  const wireGeo = new THREE.WireframeGeometry(baseIco);
  baseIco.dispose();

  const wirePos = wireGeo.attributes.position;
  const wireColors = new Float32Array(wirePos.count * 3);
  const wireFractions = new Float32Array(wirePos.count);

  for (let i = 0; i < wirePos.count; i += 1) {
    const y = wirePos.getY(i);
    const x = wirePos.getX(i);
    wireFractions[i] = THREE.MathUtils.clamp((y + x * 0.4 + 1.5) / 3.0, 0, 1);
  }

  wireGeo.setAttribute('color', new THREE.BufferAttribute(wireColors, 3));

  const wireMat = new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    opacity: 0.84,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const wireframeMesh = new THREE.LineSegments(wireGeo, wireMat);
  heroGroup.add(wireframeMesh);

  // 2) Faint Inner Glow Core (Fresnel ShaderMaterial, zero lights/textures) -> Draw call 2
  const coreGeo = new THREE.IcosahedronGeometry(0.7, 1);
  const coreMat = new THREE.ShaderMaterial({
    uniforms: {
      uColorA: { value: DARK_COLOR_A.clone() },
      uColorB: { value: DARK_COLOR_C.clone() },
      uOpacity: { value: 0.46 },
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
        float fresnel = pow(1.0 - max(dot(normalize(vNormalDir), normalize(vViewDir)), 0.0), 1.9);
        vec3 col = mix(uColorA, uColorB, clamp(vNormalDir.y * 0.5 + 0.5, 0.0, 1.0));
        gl_FragColor = vec4(col, (0.10 + fresnel * 0.70) * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  heroGroup.add(coreMesh);

  // 3) Soft Particle Field (<= 900 desktop, <= 350 mobile; halved if low-spec) -> Draw call 3
  const isDesktopInitial = initialWidth >= 768;
  const baseParticles = isDesktopInitial ? 900 : 350;
  let activeParticleCount = lowSpecDevice ? Math.floor(baseParticles * 0.5) : baseParticles;

  const particlesGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(baseParticles * 3);
  const particleColors = new Float32Array(baseParticles * 3);
  const particleTints = new Float32Array(baseParticles);

  for (let i = 0; i < baseParticles; i += 1) {
    const radius = 2.0 + Math.random() * 4.2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta) + 0.65;
    particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.72;
    particlePositions[i * 3 + 2] = radius * Math.cos(phi) - 0.8;
    particleTints[i] = Math.random();
  }

  particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particlesGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
  particlesGeo.setDrawRange(0, activeParticleCount);

  const particlesMat = new THREE.PointsMaterial({
    size: isDesktopInitial ? 0.03 : 0.036,
    vertexColors: true,
    transparent: true,
    opacity: 0.74,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });
  const particlePoints = new THREE.Points(particlesGeo, particlesMat);
  scene.add(particlePoints);

  function applyThemeColors(isLight) {
    const cA = isLight ? LIGHT_COLOR_A : DARK_COLOR_A;
    const cB = isLight ? LIGHT_COLOR_B : DARK_COLOR_B;
    const cC = isLight ? LIGHT_COLOR_C : DARK_COLOR_C;

    const wAttr = wireGeo.attributes.color;
    for (let i = 0; i < wireFractions.length; i += 1) {
      const t = wireFractions[i];
      if (t < 0.55) {
        _tempColor.copy(cA).lerp(cB, t / 0.55);
      } else {
        _tempColor.copy(cB).lerp(cC, (t - 0.55) / 0.45);
      }
      wAttr.setXYZ(i, _tempColor.r, _tempColor.g, _tempColor.b);
    }
    wAttr.needsUpdate = true;

    const pAttr = particlesGeo.attributes.color;
    for (let i = 0; i < baseParticles; i += 1) {
      _tempColor.copy(cA).lerp(cC, particleTints[i]);
      pAttr.setXYZ(i, _tempColor.r, _tempColor.g, _tempColor.b);
    }
    pAttr.needsUpdate = true;

    wireMat.opacity = isLight ? 0.72 : 0.84;
    wireMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    wireMat.needsUpdate = true;

    coreMat.uniforms.uColorA.value.copy(cA);
    coreMat.uniforms.uColorB.value.copy(cC);
    coreMat.uniforms.uOpacity.value = isLight ? 0.24 : 0.46;
    coreMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    coreMat.needsUpdate = true;

    particlesMat.opacity = isLight ? 0.48 : 0.74;
    particlesMat.blending = isLight ? THREE.NormalBlending : THREE.AdditiveBlending;
    particlesMat.needsUpdate = true;
  }

  updateAnchorFromViewport();

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
    if (isTouchOnly || !layout.isDesktopInteractive) return;
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

    layout = getLayoutConfig(w);
    camera.aspect = w / Math.max(h, 1);
    camera.updateProjectionMatrix();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, getMaxDpr(w)));
    renderer.setSize(w, h, false);

    updateAnchorFromViewport();
  }

  function onResize() {
    if (!resizeRafId) {
      resizeRafId = requestAnimationFrame(applyResize);
    }
  }
  window.addEventListener('resize', onResize, { passive: true });

  function syncTheme() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    applyThemeColors(isLight);
  }

  const themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });
  syncTheme();

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

    // Slow auto-rotation + gentle floating around breakpoint-calibrated anchor
    wireframeMesh.rotation.y += dt * 0.16;
    wireframeMesh.rotation.x += dt * 0.08;
    coreMesh.rotation.y -= dt * 0.24;
    coreMesh.rotation.z += dt * 0.1;

    heroGroup.position.x = baseAnchor.x;
    heroGroup.position.y = baseAnchor.y + Math.sin(elapsed * 0.85) * 0.1;
    particlePoints.rotation.y = elapsed * 0.026;

    // Subtle pointer parallax on desktop + scroll drift
    const allowParallax = !isTouchOnly && layout.isDesktopInteractive;
    const targetCamX = allowParallax ? pointerX * 0.22 : 0;
    const targetCamY = (allowParallax ? -pointerY * 0.16 : 0) - scrollProgress * 0.55;
    const targetCamZ = layout.cameraZ + scrollProgress * 1.05;

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

  function onVisibilityChange() {
    isTabVisible = document.visibilityState !== 'hidden';
    if (isTabVisible && isHeroVisible) startLoop();
    else stopLoop();
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  function setScrollProgress(progress) {
    scrollProgress = THREE.MathUtils.clamp(progress, 0, 1);
  }

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
