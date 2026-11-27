// 3D-двойник станции EnerGo для инструкции «Экстренная остановка».
// Фасад — текстура из оригинального рендера станции (media/station-real.webp), поэтому во фронтальном
// ракурсе модель пиксель-в-пиксель совпадает с фото и подмена незаметна. Дальше камера облетает
// станцию к аварийной кнопке на левой боковой панели (положение кнопки — по фото станции на объекте).
// Мировые единицы = пиксели исходного кадра 940×1024, начало координат в центре кадра на плоскости фасада.
import * as THREE from 'three';
import { RoomEnvironment } from './RoomEnvironment.js';

const IW = 940, IH = 1024;
const fx = (px) => px - IW / 2;
const fy = (py) => IH / 2 - py;
const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

function sideTexture() {
  // u: 0 = rear edge, 1 = front edge (fixed per side below); v: top -> bottom
  const c = document.createElement('canvas'); c.width = 1024; c.height = 2048;
  const g = c.getContext('2d');
  const grd = g.createLinearGradient(0, 0, 1024, 0);
  grd.addColorStop(0, '#141417'); grd.addColorStop(.55, '#1d1d21'); grd.addColorStop(1, '#232327');
  g.fillStyle = grd; g.fillRect(0, 0, 1024, 2048);
  const ao = g.createLinearGradient(0, 0, 0, 2048);
  ao.addColorStop(0, 'rgba(0,0,0,.35)'); ao.addColorStop(.08, 'rgba(0,0,0,0)'); ao.addColorStop(.9, 'rgba(0,0,0,0)'); ao.addColorStop(1, 'rgba(0,0,0,.45)');
  g.fillStyle = ao; g.fillRect(0, 0, 1024, 2048);
  // service door outline
  g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 6; g.beginPath(); g.roundRect(70, 120, 640, 1780, 18); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.06)'; g.lineWidth = 2; g.beginPath(); g.roundRect(76, 126, 640, 1780, 18); g.stroke();
  // louvres
  for (let y = 520; y < 1640; y += 34) {
    g.fillStyle = '#08080a'; g.beginPath(); g.roundRect(150, y, 300, 16, 8); g.fill();
    g.fillStyle = 'rgba(255,255,255,.07)'; g.fillRect(156, y + 17, 288, 2);
  }
  // lock
  g.fillStyle = '#0c0c0e'; g.beginPath(); g.roundRect(620, 980, 34, 120, 10); g.fill();
  g.fillStyle = '#55565c'; g.beginPath(); g.arc(637, 1012, 9, 0, Math.PI * 2); g.fill();
  // stickers near the front edge
  g.fillStyle = '#d8d8d0'; g.fillRect(820, 1220, 70, 250);
  g.fillStyle = '#8f8f88'; for (let y = 1240; y < 1450; y += 24) g.fillRect(830, y, 50, 7);
  g.fillStyle = '#d8d8d0'; g.fillRect(830, 1520, 50, 70);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 12;
  return t;
}

function glowTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  r.addColorStop(0, 'rgba(2,216,102,.55)'); r.addColorStop(.45, 'rgba(2,216,102,.16)'); r.addColorStop(1, 'rgba(2,216,102,0)');
  g.fillStyle = r; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function createStation3D(stage, face, { photo = 'media/station-real.webp', onFrame } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'st3d';
  stage.appendChild(canvas);
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch (e) { canvas.remove(); return null; }
  const dprCap = () => Math.min(devicePixelRatio, innerWidth < 760 ? 3 : 2);
  renderer.setPixelRatio(dprCap());
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
  scene.environmentIntensity = .45;

  const camera = new THREE.PerspectiveCamera(18, 1, 10, 40000);

  /* ---------- materials ---------- */
  const tex = new THREE.TextureLoader().load(photo, () => render());
  tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
  const fronts = [];
  const frontMat = (x0, y0, x1, y1) => {
    const t = tex.clone();
    t.repeat.set((x1 - x0) / IW, (y1 - y0) / IH);
    t.offset.set(x0 / IW, 1 - y1 / IH);
    const m = new THREE.MeshBasicMaterial({ map: t, toneMapped: false });
    fronts.push(m); return m;
  };
  const sideTex = sideTexture();
  const side = new THREE.MeshStandardMaterial({ map: sideTex, roughness: .62, metalness: .35 });
  const sideFlip = side.clone(); sideFlip.map = sideTex.clone(); sideFlip.map.wrapS = THREE.RepeatWrapping; sideFlip.map.repeat.x = -1; sideFlip.map.offset.x = 1;
  const dark = new THREE.MeshStandardMaterial({ color: 0x141416, roughness: .5, metalness: .45 });
  const darker = new THREE.MeshStandardMaterial({ color: 0x0d0d0f, roughness: .7, metalness: .2 });
  const rubber = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: .45, metalness: .05 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x6d6e73, roughness: .3, metalness: .9 });

  const root = new THREE.Group(); scene.add(root);
  // BoxGeometry material order: +x, -x, +y, -y, +z (front), -z
  const box = (x0, y0, x1, y1, zFront, depth, mats) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(x1 - x0, y1 - y0, depth), mats);
    m.position.set(fx((x0 + x1) / 2), fy((y0 + y1) / 2), zFront - depth / 2);
    root.add(m); return m;
  };
  const D = 250;
  // canopy, body, holster pods, base — fronts textured from the render
  const gc = document.createElement('canvas'); gc.width = gc.height = 256;
  const gg = gc.getContext('2d'); gg.fillStyle = '#1b1b1e'; gg.fillRect(0, 0, 256, 256); gg.fillStyle = '#060607';
  for (let y = 6; y < 256; y += 12) for (let x = (y / 12 % 2) * 6 + 4; x < 256; x += 12) { gg.beginPath(); gg.arc(x, y, 3.6, 0, 7); gg.fill(); }
  const grillTex = new THREE.CanvasTexture(gc); grillTex.colorSpace = THREE.SRGBColorSpace; grillTex.wrapS = grillTex.wrapT = THREE.RepeatWrapping; grillTex.repeat.set(5, 3);
  const grill = new THREE.MeshStandardMaterial({ map: grillTex, roughness: .55, metalness: .5 });
  const capSide = new THREE.MeshStandardMaterial({ color: 0x2a2a2f, roughness: .32, metalness: .7 });
  {
    const CW = 414, yT = fy(30), yB = fy(128), OV = 74; // overhang of the lamp edge in front of the body
    const sh = new THREE.Shape();
    sh.moveTo(OV, yT); sh.lineTo(-D - 14, yT - 16); sh.lineTo(-D - 14, yB); sh.lineTo(0, yB); sh.closePath();
    const eg = new THREE.ExtrudeGeometry(sh, { depth: CW, bevelEnabled: true, bevelThickness: 3, bevelSize: 3, bevelSegments: 2, curveSegments: 1 });
    eg.rotateY(-Math.PI / 2); eg.translate(CW / 2 + fx(465), 0, 0);
    root.add(new THREE.Mesh(eg, [capSide, dark]));
    // textured lamp face (grill + logo zone of the render) on the inclined plane
    const q = new THREE.PlaneGeometry(1, 1);
    const pa = q.attributes.position, x0 = fx(258), x1 = fx(672);
    pa.setXYZ(0, x0, yT, OV + 3.5); pa.setXYZ(1, x1, yT, OV + 3.5); pa.setXYZ(2, x0, yB, 3.5); pa.setXYZ(3, x1, yB, 3.5);
    q.computeVertexNormals();
    root.add(new THREE.Mesh(q, frontMat(258, 30, 672, 128)));
    // the lamp glows down onto the front face
    const lampGlow = new THREE.Mesh(new THREE.PlaneGeometry(CW - 20, 6), new THREE.MeshBasicMaterial({ color: 0xbfffe0, toneMapped: false, transparent: true, opacity: .55 }));
    lampGlow.rotation.x = Math.PI / 2; lampGlow.position.set(fx(465), yB - 1, OV * .6); root.add(lampGlow);
  }
  box(262, 128, 668, 955, 0, D, [sideFlip, side, dark, dark, frontMat(262, 128, 668, 955), dark]);
  box(212, 145, 262, 238, 0, 160, [dark, dark, dark, dark, frontMat(212, 145, 262, 238), dark]);
  box(668, 145, 718, 238, 0, 160, [dark, dark, dark, dark, frontMat(668, 145, 718, 238), dark]);
  box(268, 955, 662, 1024, -4, D - 12, [darker, darker, darker, darker, frontMat(268, 955, 662, 1024), darker]);

  // signature light strips on the front corners (also visible from the side)
  const stripMat = new THREE.MeshBasicMaterial({ color: 0x35ff98, toneMapped: false });
  for (const px of [263.5, 666.5]) {
    const s = new THREE.Mesh(new THREE.BoxGeometry(5, 700, 10), stripMat);
    s.position.set(fx(px), fy(530), -4); root.add(s);
  }

  /* ---------- emergency stop button (left side panel) ---------- */
  const btn = new THREE.Group();
  const plate = new THREE.Mesh(new THREE.BoxGeometry(4, 92, 92), new THREE.MeshStandardMaterial({ color: 0x2a2a2e, roughness: .4, metalness: .6 }));
  const bezel = new THREE.Mesh(new THREE.CylinderGeometry(30, 32, 10, 48), metal);
  bezel.rotation.z = Math.PI / 2; bezel.position.x = -6;
  const capMat = new THREE.MeshStandardMaterial({ color: 0xd91f1f, roughness: .28, metalness: .05, emissive: 0xff2a2a, emissiveIntensity: .25 });
  const cap = new THREE.Group();
  const capBody = new THREE.Mesh(new THREE.CylinderGeometry(21, 23, 14, 48), capMat); capBody.rotation.z = Math.PI / 2;
  const dome = new THREE.Mesh(new THREE.SphereGeometry(21, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2), capMat);
  dome.rotation.z = Math.PI / 2; dome.scale.set(1, .45, 1); dome.position.x = -7;
  cap.add(capBody, dome); cap.position.x = -16;
  const halo = new THREE.Mesh(new THREE.TorusGeometry(40, 2.2, 12, 72), new THREE.MeshBasicMaterial({ color: 0xff4d4d, transparent: true, opacity: 0, toneMapped: false }));
  halo.rotation.y = Math.PI / 2; halo.position.x = -14;
  btn.add(plate, bezel, cap, halo);
  const BTN = new THREE.Vector3(fx(262) - 2, fy(430), -62);
  btn.position.copy(BTN); root.add(btn);

  /* ---------- holsters, connectors, cables ---------- */
  const gun = (sideSign) => {
    const g = new THREE.Group();
    const s = -sideSign; // outward
    const cradle = new THREE.Mesh(new THREE.CapsuleGeometry(16, 46, 8, 20), dark);
    cradle.rotation.x = Math.PI / 2; cradle.position.set(10 * s, 6, 0);
    const lip = new THREE.Mesh(new THREE.TorusGeometry(19, 4, 10, 32), metal);
    lip.position.set(10 * s, 6, 30);
    // barrel sits in the cradle, grip angles down and out, boot leads into the cable
    const barrel = new THREE.Mesh(new THREE.CapsuleGeometry(17, 40, 8, 24), rubber);
    barrel.rotation.x = Math.PI / 2; barrel.position.set(30 * s, 8, 10);
    const grip = new THREE.Mesh(new THREE.CapsuleGeometry(13, 58, 8, 20), rubber);
    grip.position.set(44 * s, -30, -18); grip.rotation.z = .5 * s; grip.rotation.x = -.35;
    const boot = new THREE.Mesh(new THREE.CylinderGeometry(9, 12, 26, 16), rubber);
    boot.position.set(56 * s, -64, -30); boot.rotation.z = .5 * s;
    const latch = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 22), metal);
    latch.position.set(32 * s, 26, 4);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0x02d866, emissive: 0x02d866, emissiveIntensity: .45, roughness: .4 });
    const ring = new THREE.Mesh(new THREE.TorusGeometry(14, 2.4, 10, 32), ringMat); ring.position.set(30 * s, 8, 34);
    g.add(cradle);
    return g;
  };
  const gl = gun(1); gl.position.set(fx(262) - 14, fy(500), -46); root.add(gl);
  const gunSprite = (file, x0, y0, x1, y1, z) => {
    const m = new THREE.TextureLoader().load(file, () => render()); m.colorSpace = THREE.SRGBColorSpace; m.anisotropy = 8;
    const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: m, toneMapped: false, transparent: true, alphaTest: .02 }));
    sp.scale.set(x1 - x0, y1 - y0, 1); sp.position.set(fx((x0 + x1) / 2), fy((y0 + y1) / 2), z);
    root.add(sp); return sp;
  };
  gunSprite('media/gun-l.png', 140, 470, 270, 605, -24);
  gunSprite('media/gun-r.png', 665, 470, 790, 605, -24);
  const gr = gun(-1); gr.position.set(fx(668) + 14, fy(500), -46); root.add(gr);
  const cable = (pts) => {
    const curve = new THREE.CatmullRomCurve3(pts.map(([x, y, z]) => new THREE.Vector3(fx(x), fy(y), z)));
    root.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 8, 12, false), rubber));
  };
  const L = [[238, 238, -60], [228, 330, -56], [204, 470, -52], [168, 690, -58], [176, 860, -72], [222, 900, -86], [248, 800, -80], [238, 660, -60], [226, 590, -40]];
  cable(L); cable(L.map(([x, y, z]) => [IW - x, y, z]));

  /* ---------- floor ---------- */
  const floor = new THREE.Mesh(new THREE.CircleGeometry(620, 64), new THREE.MeshBasicMaterial({ map: glowTexture(), transparent: true, depthWrite: false, toneMapped: false }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, fy(1024) + 1, -125); root.add(floor);
  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const sg = sc.getContext('2d'); const srg = sg.createRadialGradient(64, 64, 0, 64, 64, 64);
  srg.addColorStop(0, 'rgba(0,0,0,.75)'); srg.addColorStop(.6, 'rgba(0,0,0,.35)'); srg.addColorStop(1, 'rgba(0,0,0,0)'); sg.fillStyle = srg; sg.fillRect(0, 0, 128, 128);
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(560, 400), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false }));
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, fy(1024) + 2, -125); root.add(shadow);

  /* ---------- lights ---------- */
  scene.add(new THREE.AmbientLight(0xffffff, .35));
  const key = new THREE.DirectionalLight(0xffffff, 2.4); key.position.set(-900, 700, 900); scene.add(key);
  const fill = new THREE.DirectionalLight(0xcfe8ff, .6); fill.position.set(700, 200, 600); scene.add(fill);
  const rim = new THREE.PointLight(0x02d866, 1.1, 0, 0); rim.position.set(-500, 100, -600); scene.add(rim);

  /* ---------- camera rig ---------- */
  const state = { t: 0, from: 0, to: 0, t0: 0, dur: 1900, active: false, dragAz: 0, dragEl: 0, dragging: false, phase: '' };
  let W = 1, H = 1, front = { x: 0, y: 0, D: 3000 };
  function layout() {
    const r = stage.getBoundingClientRect(), f = face.getBoundingClientRect();
    W = r.width; H = r.height;
    renderer.setPixelRatio(dprCap());
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    const s = IH / f.height; // world units per css px
    const fov0 = 18;
    const Dc = (H * s / 2) / Math.tan(THREE.MathUtils.degToRad(fov0 / 2));
    const cx = f.left - r.left + f.width / 2, cy = f.top - r.top + f.height / 2;
    front = { x: -(cx - W / 2) * s, y: (cy - H / 2) * s, D: Dc, s };
    render();
  }

  const P = new THREE.Vector3(), Q = new THREE.Vector3(), tmp = new THREE.Vector3();
  function place() {
    const e = ease(state.t);
    const mob = W < 640;
    const fov = 18;
    const az = lerp(0, -0.95, e) + state.dragAz;
    const el = lerp(0, .07, e) + state.dragEl;
    // pivot: from the frame centre to the emergency button
    P.set(front.x, front.y, -125);
    Q.set(BTN.x * .3, -10, -125);
    tmp.copy(P).lerp(Q, e);
    const R0 = front.D + 125;
    const tn = 2 * Math.tan(THREE.MathUtils.degToRad(9));
    const R1 = Math.max(1240 / tn, 820 / (tn * camera.aspect));
    const R = lerp(R0, R1, e);
    camera.fov = fov; camera.updateProjectionMatrix();
    camera.position.set(tmp.x + R * Math.sin(az) * Math.cos(el), tmp.y + R * Math.sin(el), tmp.z + R * Math.cos(az) * Math.cos(el));
    camera.lookAt(tmp);
    // key light glides with the camera for a studio sweep
    key.position.set(-900 - 600 * e, 700, 900 - 900 * e);
    const shade = 1 - .28 * e;
    for (const m of fronts) m.userData.shade = shade;
  }

  function render() {
    place();
    renderer.render(scene, camera);
    if (onFrame) {
      btn.getWorldPosition(tmp).project(camera);
      onFrame({ t: state.t, bx: (tmp.x * .5 + .5) * W, by: (-tmp.y * .5 + .5) * H });
    }
  }

  let raf = 0, last = 0;
  function loop(now) {
    raf = 0;
    if (state.from !== state.to) {
      const k = Math.min(1, (now - state.t0) / state.dur);
      state.t = lerp(state.from, state.to, k);
      if (k >= 1) { state.from = state.to; state.t = state.to; if (state.to === 0) stage.classList.remove('is-3d'); }
    }
    if (!state.dragging) { state.dragAz *= .9; state.dragEl *= .9; }
    // pressed / stopped visual states
    const time = now / 1000;
    const pulse = state.phase === 'press' ? (Math.sin(time * 6) * .5 + .5) : 0;
    halo.material.opacity = state.t > .8 ? (state.phase === 'press' ? .35 + pulse * .65 : .25) : 0;
    halo.scale.setScalar(1 + pulse * .25);
    cap.position.x = lerp(cap.position.x, state.phase === 'stopped' ? -9 : -16, .2);
    capMat.emissiveIntensity = state.phase === 'stopped' ? .9 : .25 + pulse * .5;
    const off = state.phase === 'stopped' || state.phase === 'callstop';
    stripMat.color.lerp(new THREE.Color(off ? 0x3a1414 : 0x35ff98), .08);
    const sh = fronts[0].userData.shade ?? 1;
    fronts.forEach((m, i) => { const target = (i === 1 && off ? .38 : 1) * sh; m.userData.v = lerp(m.userData.v ?? 1, target, .08); m.color.setScalar(m.userData.v); });
    render();
    if (state.active || state.from !== state.to || Math.abs(state.dragAz) > .001) raf = requestAnimationFrame(loop);
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };

  function go(on) {
    if (on === state.active) return;
    state.active = on;
    state.from = state.t; state.to = on ? 1 : 0; state.t0 = performance.now() + (on ? 220 : 0);
    state.dur = 1900 * Math.abs(state.to - state.from) + 1;
    if (on) stage.classList.add('is-3d');
    kick();
  }

  // drag to look around while the side view is open
  let sx = 0, sy = 0;
  canvas.addEventListener('pointerdown', (e) => { if (!state.active) return; state.dragging = true; sx = e.clientX; sy = e.clientY; canvas.setPointerCapture(e.pointerId); });
  canvas.addEventListener('pointermove', (e) => {
    if (!state.dragging) return;
    state.dragAz = THREE.MathUtils.clamp((e.clientX - sx) / -220, -.9, 1.2);
    state.dragEl = THREE.MathUtils.clamp((e.clientY - sy) / 600, -.08, .3);
    kick();
  });
  const end = () => { state.dragging = false; kick(); };
  canvas.addEventListener('pointerup', end); canvas.addEventListener('pointercancel', end);

  new ResizeObserver(layout).observe(stage);
  layout();
  return {
    show: go,
    setPhase(p) { state.phase = p; kick(); },
  };
}
