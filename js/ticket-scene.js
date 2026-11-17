import * as THREE from 'three';

// One geometry, one draw call, no textures; shared with the existing Three.js import.
export function initTicketAccent(host, section) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' }); }
  catch { return; }
  renderer.setPixelRatio(1);
  renderer.setClearColor(0x000000, 0);
  renderer.setSize(220, 140);
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 220 / 140, .1, 20);
  camera.position.z = 5;
  const geometry = new THREE.TorusKnotGeometry(.85, .2, 48, 6);
  const edges = new THREE.WireframeGeometry(geometry);
  geometry.dispose();
  const material = new THREE.LineBasicMaterial({ color: 0x8b5cf6, transparent: true, opacity: .65 });
  const mesh = new THREE.LineSegments(edges, material);
  scene.add(mesh);
  let visible = false;
  let frame = 0;
  let last = 0;
  let disposed = false;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const desktop = matchMedia('(min-width: 768px)');
  function render(time) {
    frame = 0;
    if (disposed || !visible || document.hidden || motion.matches || !desktop.matches) return;
    if (time - last >= 33) {
      mesh.rotation.x += .004;
      mesh.rotation.y += .007;
      renderer.render(scene, camera);
      last = time;
    }
    frame = requestAnimationFrame(render);
  }
  function sync() {
    if (visible && !document.hidden && !motion.matches && desktop.matches && !frame && !disposed) frame = requestAnimationFrame(render);
    else if ((!visible || document.hidden || motion.matches || !desktop.matches) && frame) { cancelAnimationFrame(frame); frame = 0; }
  }
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(section);
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', sync);
  desktop.addEventListener('change', sync);
  renderer.domElement.addEventListener('webglcontextlost', () => { cancelAnimationFrame(frame); frame = 0; });
  window.addEventListener('pagehide', () => {
    disposed = true;
    cancelAnimationFrame(frame);
    observer.disconnect();
    document.removeEventListener('visibilitychange', sync);
    motion.removeEventListener('change', sync);
    desktop.removeEventListener('change', sync);
    edges.dispose(); material.dispose(); renderer.dispose();
  }, { once: true });
}
