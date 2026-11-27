"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/**
 * WebGL-сцена первого экрана: знак EnerGo, выдавленный в 3D из ОРИГИНАЛЬНОГО вектора
 * (public/brand/mark.svg, извлечён из брендбука без изменений геометрии).
 * Каждая «капля» знака — отдельный объект с глянцевым материалом и отражениями окружения.
 * По скроллу знак «раскрывается» (exploded view), по курсору — мягко наклоняется.
 *
 * progress — ref со значением 0..1 (прогресс пиннинга hero), обновляется снаружи без ререндера.
 */
export default function MarkScene({ progress }: { progress: React.RefObject<number> }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.toneMapping = THREE.NeutralToneMapping; // сохраняет фирменный Malachite без «выцветания»
    renderer.toneMappingExposure = 1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);
    renderer.domElement.style.cssText = "width:100%;height:100%;display:block";

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0, 14);

    // Свет: тёплый ключевой сверху, голубой контровой (Non-Photo Blue), зелёный заполняющий (Malachite)
    const key = new THREE.SpotLight(0xffffff, 140, 40, Math.PI / 5, 0.6, 1.4);
    key.position.set(-4, 8, 9);
    scene.add(key);
    const rim = new THREE.PointLight(0x98daf7, 60, 30, 1.6);
    rim.position.set(6, 2, -4);
    scene.add(rim);
    const fill = new THREE.PointLight(0x02d866, 30, 30, 1.6);
    fill.position.set(-6, -4, 4);
    scene.add(fill);

    const group = new THREE.Group();
    scene.add(group);

    const material = new THREE.MeshPhysicalMaterial({
      color: 0x02d866,
      metalness: 0.15,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      emissive: 0x02d866,
      emissiveIntensity: 0.18,
    });

    type Piece = { mesh: THREE.Mesh; dir: THREE.Vector3; spin: THREE.Vector3; base: THREE.Vector3 };
    const pieces: Piece[] = [];
    let disposed = false;

    new SVGLoader().load("/brand/mark.svg", (data) => {
      if (disposed) return;
      const box = new THREE.Box2();
      data.paths.forEach((p) => p.subPaths.forEach((s) => s.getPoints().forEach((pt) => box.expandByPoint(pt))));
      const size = new THREE.Vector2();
      const center = new THREE.Vector2();
      box.getSize(size);
      box.getCenter(center);
      const scale = 4.6 / Math.max(size.x, size.y);

      data.paths.forEach((path) => {
        SVGLoader.createShapes(path).forEach((shape) => {
          const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 9,
            bevelEnabled: true,
            bevelThickness: 2.2,
            bevelSize: 1.4,
            bevelSegments: 6,
            curveSegments: 24,
          });
          geo.translate(-center.x, -center.y, -4.5);
          geo.scale(scale, -scale, -scale); // SVG: ось Y вниз; Z тоже отражаем, чтобы сохранить ориентацию граней
          geo.computeBoundingBox();
          const c = new THREE.Vector3();
          geo.boundingBox!.getCenter(c);
          geo.translate(-c.x, -c.y, -c.z);
          const mesh = new THREE.Mesh(geo, material);
          mesh.position.copy(c);
          group.add(mesh);
          const dir = c.clone().setZ(0);
          const len = dir.length();
          dir.normalize().multiplyScalar(0.35 + len * 0.3).setZ((Math.random() - 0.5) * 2.2);
          pieces.push({
            mesh,
            base: c.clone(),
            dir,
            spin: new THREE.Vector3((Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 2.2, (Math.random() - 0.5) * 1.2),
          });
        });
      });
    });

    const resize = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    // Рисуем только когда сцена видна
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(el);

    const clock = new THREE.Clock();
    let smoothP = 0;
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const dt = Math.min(clock.getDelta(), 0.1);
      const t = clock.elapsedTime;
      const p = progress.current ?? 0;
      smoothP += (p - smoothP) * (1 - Math.exp(-dt * 7)); // демпфирование не зависит от FPS
      const k = 1 - Math.exp(-dt * 3);
      pointer.x += (pointer.tx - pointer.x) * k;
      pointer.y += (pointer.ty - pointer.y) * k;

      // раскрытие знака: 0 на первом экране, 1 к середине сцены
      const explode = THREE.MathUtils.smoothstep(smoothP, 0.12, 0.6);
      for (const piece of pieces) {
        piece.mesh.position.copy(piece.base).addScaledVector(piece.dir, explode * 1.25);
        piece.mesh.rotation.set(piece.spin.x * explode, piece.spin.y * explode, piece.spin.z * explode);
      }

      // в первом кадре знак стоит за станцией (справа), затем вместе с ней уходит в центр
      const vh = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
      const move = 1 - THREE.MathUtils.smoothstep(smoothP, 0.24, 0.48);
      group.position.x = vh * camera.aspect * 0.16 * move;
      group.rotation.y = -0.45 + Math.sin(t * 0.25) * 0.12 + pointer.x * 0.25 + smoothP * 1.2;
      group.rotation.x = 0.12 + Math.cos(t * 0.3) * 0.05 + pointer.y * 0.15;
      group.position.y = 0.35 + Math.sin(t * 0.6) * 0.08;
      camera.position.z = 14 - smoothP * 3;
      rim.position.x = 6 + Math.sin(t * 0.7) * 2;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      pieces.forEach((p) => p.mesh.geometry.dispose());
      material.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [progress]);

  return <div ref={host} className="absolute inset-0" aria-hidden />;
}
