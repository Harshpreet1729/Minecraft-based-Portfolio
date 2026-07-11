import { useEffect, useRef } from "react";
import * as THREE from "three";

const textureUrls = {
  dirt: new URL("../assets/minecraft-textures/block/dirt.png", import.meta.url).href,
  grassSide: new URL("../assets/minecraft-textures/block/grass_block_side.png", import.meta.url).href,
  grassTop: new URL("../assets/minecraft-textures/block/grass_block_top.png", import.meta.url).href,
  leaves: new URL("../assets/minecraft-textures/block/oak_leaves.png", import.meta.url).href,
  log: new URL("../assets/minecraft-textures/block/oak_log.png", import.meta.url).href,
  oak: new URL("../assets/minecraft-textures/block/oak_planks.png", import.meta.url).href,
  spruce: new URL("../assets/minecraft-textures/block/spruce_planks.png", import.meta.url).href,
  stone: new URL("../assets/minecraft-textures/block/stone_bricks.png", import.meta.url).href,
};

function configureTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestMipmapNearestFilter;
  return texture;
}

export function ThreeWorldScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#74b9dc");
    scene.fog = new THREE.Fog("#95c6d5", 19, 48);

    const camera = new THREE.PerspectiveCamera(43, 1, 0.1, 100);
    camera.position.set(11, 7.4, 15);
    camera.lookAt(1.4, 1.8, 0);
    const cameraBase = new THREE.Vector3(11, 7.4, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    mount.appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
    const loadedTextures = Object.fromEntries(
      Object.entries(textureUrls).map(([key, url]) => [key, configureTexture(loader.load(url))]),
    ) as Record<keyof typeof textureUrls, THREE.Texture>;

    const material = (key: keyof typeof textureUrls, options: THREE.MeshStandardMaterialParameters = {}) =>
      new THREE.MeshStandardMaterial({ map: loadedTextures[key], roughness: 0.92, ...options });

    const grassSide = material("grassSide", { color: "#8bbf63" });
    const grassTop = material("grassTop", { color: "#63ad42" });
    const dirt = material("dirt");
    const oak = material("oak");
    const spruce = material("spruce", { color: "#c8a17b" });
    const stone = material("stone", { color: "#d8d7d1" });
    const log = material("log");
    const leaves = material("leaves", { color: "#4d8a35", alphaTest: 0.34, transparent: true, side: THREE.DoubleSide });
    const materials = [grassSide, grassSide, grassTop, dirt, grassSide, grassSide];
    const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);

    const hemi = new THREE.HemisphereLight("#dff4ff", "#43612c", 2.35);
    scene.add(hemi);
    const sun = new THREE.DirectionalLight("#ffd9a3", 4.4);
    sun.position.set(-9, 15, 11);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -18;
    sun.shadow.camera.right = 18;
    sun.shadow.camera.top = 18;
    sun.shadow.camera.bottom = -18;
    scene.add(sun);

    const terrainCount = 29 * 24;
    const terrain = new THREE.InstancedMesh(cubeGeometry, materials, terrainCount);
    terrain.receiveShadow = true;
    const matrix = new THREE.Matrix4();
    let terrainIndex = 0;
    for (let z = -9; z < 15; z += 1) {
      for (let x = -14; x <= 14; x += 1) {
        const rise = z < -5 ? Math.max(0, Math.floor((-z - 5) / 3)) : 0;
        const edge = Math.abs(x) > 11 ? 1 : 0;
        matrix.makeTranslation(x, rise + edge - 0.5, z);
        terrain.setMatrixAt(terrainIndex, matrix);
        terrainIndex += 1;
      }
    }
    terrain.instanceMatrix.needsUpdate = true;
    scene.add(terrain);

    const world = new THREE.Group();
    scene.add(world);

    const addCube = (
      blockMaterial: THREE.Material | THREE.Material[],
      position: [number, number, number],
      scale: [number, number, number] = [1, 1, 1],
      parent: THREE.Object3D = world,
    ) => {
      const mesh = new THREE.Mesh(cubeGeometry, blockMaterial);
      mesh.position.set(...position);
      mesh.scale.set(...scale);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      parent.add(mesh);
      return mesh;
    };

    const pathMaterial = new THREE.MeshStandardMaterial({ color: "#aa8d64", roughness: 1 });
    for (let z = 4; z < 15; z += 1) {
      addCube(pathMaterial, [2 + Math.sin(z * 0.7) * 0.7, 0.04, z], [2.4, 0.08, 1]);
    }

    const house = new THREE.Group();
    house.position.set(2.5, 0, -0.8);
    world.add(house);
    for (let x = -3; x <= 3; x += 1) {
      for (let z = -2; z <= 2; z += 1) addCube(stone, [x, 0.5, z], [1, 1, 1], house);
    }
    for (let y = 1.5; y <= 3.5; y += 1) {
      for (let x = -3; x <= 3; x += 1) {
        const frontOpening = y < 3 && Math.abs(x) < 0.7;
        if (!frontOpening) addCube(x === -3 || x === 3 ? log : oak, [x, y, 2], [1, 1, 1], house);
        addCube(x === -3 || x === 3 ? log : oak, [x, y, -2], [1, 1, 1], house);
      }
      for (let z = -1; z <= 1; z += 1) {
        addCube(log, [-3, y, z], [1, 1, 1], house);
        addCube(log, [3, y, z], [1, 1, 1], house);
      }
    }
    const windowMaterial = new THREE.MeshPhysicalMaterial({
      color: "#9fe4ff",
      transparent: true,
      opacity: 0.52,
      roughness: 0.12,
      transmission: 0.2,
    });
    addCube(windowMaterial, [-1.5, 2.5, 2.52], [1.7, 1.25, 0.08], house);
    addCube(windowMaterial, [1.5, 2.5, 2.52], [1.7, 1.25, 0.08], house);
    addCube(spruce, [0, 1.5, 2.52], [0.95, 2, 0.12], house);

    for (let layer = 0; layer < 4; layer += 1) {
      const width = 8 - layer * 2;
      for (let x = 0; x < width; x += 1) {
        for (let z = -3; z <= 3; z += 1) {
          addCube(spruce, [x - (width - 1) / 2, 4.35 + layer * 0.72, z], [1, 0.72, 1], house);
        }
      }
    }

    const lanternMaterial = new THREE.MeshStandardMaterial({
      color: "#ffd26f",
      emissive: "#ff9d32",
      emissiveIntensity: 2.2,
      roughness: 0.5,
    });
    addCube(lanternMaterial, [-2.2, 1.45, 2.68], [0.35, 0.55, 0.22], house);
    addCube(lanternMaterial, [2.2, 1.45, 2.68], [0.35, 0.55, 0.22], house);
    const warmLight = new THREE.PointLight("#ffb24b", 16, 13, 2);
    warmLight.position.set(2.5, 2.2, 4.2);
    scene.add(warmLight);

    const addTree = (x: number, z: number, height: number, scale = 1) => {
      for (let y = 0; y < height; y += 1) addCube(log, [x, 0.5 + y, z], [0.72 * scale, 1, 0.72 * scale]);
      const top = height + 0.35;
      for (let dx = -1; dx <= 1; dx += 1) {
        for (let dz = -1; dz <= 1; dz += 1) addCube(leaves, [x + dx * scale, top, z + dz * scale], [scale, scale, scale]);
      }
      addCube(leaves, [x, top + scale, z], [scale, scale, scale]);
    };
    addTree(-4.5, 1, 4, 1.15);
    addTree(8.5, -1.5, 5, 1.2);
    addTree(-9, -4, 5, 1.1);
    addTree(10, 6, 4, 1);

    const mountainMaterial = new THREE.MeshStandardMaterial({
      map: loadedTextures.stone,
      color: "#66756a",
      roughness: 1,
    });
    for (let ridge = 0; ridge < 4; ridge += 1) {
      const baseX = -12 + ridge * 8;
      const height = 4 + (ridge % 2) * 2;
      for (let y = 0; y < height; y += 1) {
        for (let x = -height + y; x <= height - y; x += 1) {
          addCube(mountainMaterial, [baseX + x, 0.5 + y, -10 - ridge], [1, 1, 1]);
        }
      }
    }

    const cloudMaterial = new THREE.MeshStandardMaterial({ color: "#f7fbff", roughness: 1 });
    const clouds = new THREE.Group();
    clouds.position.set(-4, 9.5, -8);
    scene.add(clouds);
    addCube(cloudMaterial, [0, 0, 0], [3, 0.55, 0.8], clouds);
    addCube(cloudMaterial, [2.4, 0, 0], [2, 0.55, 0.8], clouds);
    addCube(cloudMaterial, [0.8, 0.55, 0], [1.5, 0.55, 0.8], clouds);

    const pointer = new THREE.Vector2();
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    mount.addEventListener("pointermove", onPointerMove, { passive: true });

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      camera.aspect = Math.max(width, 1) / Math.max(height, 1);
      if (width < 700) {
        cameraBase.set(17, 10, 25);
        camera.fov = 47;
      } else {
        cameraBase.set(11, 7.4, 15);
        camera.fov = 43;
      }
      camera.position.copy(cameraBase);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const startedAt = performance.now();
    const render = () => {
      const elapsed = (performance.now() - startedAt) / 1000;
      if (!reduceMotion) {
        camera.position.x += (cameraBase.x + pointer.x * 0.8 - camera.position.x) * 0.025;
        camera.position.y += (cameraBase.y - pointer.y * 0.35 - camera.position.y) * 0.025;
        camera.position.z += (cameraBase.z - camera.position.z) * 0.025;
        camera.lookAt(1.4, 1.8, 0);
        clouds.position.x = -4 + ((elapsed * 0.35) % 20);
      }
      renderer.render(scene, camera);
      frame = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      renderer.dispose();
      cubeGeometry.dispose();
      Object.values(loadedTextures).forEach((texture) => texture.dispose());
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const objectMaterials = Array.isArray(object.material) ? object.material : [object.material];
          objectMaterials.forEach((entry) => entry.dispose());
        }
      });
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="three-world" role="img" aria-label="Interactive three-dimensional voxel workshop world" />;
}
