'use client';

import { useEffect, useRef } from 'react';
import { ALGO_ASSET, useAlgo } from './algo-controller';

export default function AlgoModel() {
  const host = useRef<HTMLDivElement>(null);
  const { controller } = useAlgo();
  const current = useRef(controller);
  useEffect(() => { current.current = controller; }, [controller]);

  useEffect(() => {
    const root = host.current;
    if (!root || !ALGO_ASSET.modelUrl) return;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduced.matches || connection?.saveData || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)) return;
    let cancelled = false;
    let cleanup = () => {};
    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      observer.disconnect();
      void start();
    }, { rootMargin: '150px' });
    observer.observe(root);

    async function start() {
      try {
        const [T, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
          import('three'), import('three/addons/loaders/GLTFLoader.js'), import('three/addons/environments/RoomEnvironment.js'),
        ]);
        if (cancelled || !root) return;
        const renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
        renderer.setClearColor(0xffffff, 0);
        renderer.toneMapping = T.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.25;
        root.appendChild(renderer.domElement);
        const scene = new T.Scene();
        const camera = new T.PerspectiveCamera(30, 1, .1, 100);
        camera.position.set(4, 2, 12);
        camera.lookAt(0, 0, 0);
        const pmrem = new T.PMREMGenerator(renderer);
        const room = new RoomEnvironment();
        const environment = pmrem.fromScene(room);
        scene.environment = environment.texture;
        room.dispose();
        pmrem.dispose();
        scene.add(new T.HemisphereLight(0xffffff, 0x615b80, 2));
        const light = new T.DirectionalLight(0xffffff, 3);
        light.position.set(-3, 5, 6);
        scene.add(light);
        let frame = 0;
        let visible = true;
        const visibility = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; });
        visibility.observe(root);
        const resize = new ResizeObserver(() => {
          const { clientWidth: width, clientHeight: height } = root;
          if (!width || !height) return;
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        });
        resize.observe(root);
        const lost = (event: Event) => { event.preventDefault(); delete root.dataset.ready; cancelAnimationFrame(frame); };
        renderer.domElement.addEventListener('webglcontextlost', lost);
        const release = (object: InstanceType<typeof T.Object3D>) => object.traverse(child => {
          if (child instanceof T.Mesh) {
            child.geometry.dispose();
            (Array.isArray(child.material) ? child.material : [child.material]).forEach(material => material.dispose());
          }
        });
        cleanup = () => {
          cancelAnimationFrame(frame); visibility.disconnect(); resize.disconnect();
          renderer.domElement.removeEventListener('webglcontextlost', lost);
          release(scene); environment.dispose(); renderer.dispose(); renderer.domElement.remove();
          delete root.dataset.ready;
        };
        const gltf = await new GLTFLoader().loadAsync(ALGO_ASSET.modelUrl!);
        if (cancelled) { release(gltf.scene); return; }
        const model = gltf.scene;
        const head = new T.Group();
        head.position.set(0, 3.55, 0);
        const arms = [-1, 1].map(sign => {
          const arm = new T.Group(); arm.position.set(sign * .65, 2.45, 0); return arm;
        });
        model.updateMatrixWorld(true);
        const parts = [...model.children];
        model.add(head, ...arms);
        model.updateMatrixWorld(true);
        parts.forEach(part => {
          const center = new T.Box3().setFromObject(part).getCenter(new T.Vector3());
          if (center.y > 2.75) head.attach(part);
          else if (Math.abs(center.x) > .6 && center.y > 1.05) arms[center.x < 0 ? 0 : 1].attach(part);
        });
        model.position.y = -2.5;
        scene.add(model);
        let last = 0;
        function draw(time: number) {
          frame = requestAnimationFrame(draw);
          if (!visible || document.hidden || time - last < 33) return;
          last = time;
          const state = current.current;
          const still = reduced.matches;
          const t = time / 1000;
          const wave = ['happy', 'success', 'communicating', 'awake'].includes(state.state);
          const thinking = ['thinking', 'analyzing'].includes(state.state);
          head.rotation.y += ((still ? 0 : state.pointer.x * .22) - head.rotation.y) * .1;
          head.rotation.z += ((thinking && !still ? -.1 : 0) - head.rotation.z) * .1;
          arms[0].rotation.z += ((wave && !still ? -1.7 + Math.sin(t * 3) * .12 : 0) - arms[0].rotation.z) * .08;
          arms[1].rotation.x += ((state.state === 'building' && !still ? -.6 + Math.sin(t * 2) * .1 : 0) - arms[1].rotation.x) * .08;
          model.position.y = -2.5 + (still ? 0 : Math.sin(t * 1.6) * .025);
          renderer.render(scene, camera);
          root!.dataset.ready = 'true';
        }
        frame = requestAnimationFrame(draw);
      } catch {
        cleanup();
      }
    }
    return () => { cancelled = true; observer.disconnect(); cleanup(); };
  }, []);
  return <div ref={host} className="algo-model" aria-hidden="true" />;
}
