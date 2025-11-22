import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface KeyboardSceneProps {
  isDark: boolean;
}

const KeyboardScene: React.FC<KeyboardSceneProps> = ({ isDark }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const animationRef = useRef<number | null>(null);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!mountRef.current || isInitializedRef.current) return;
    isInitializedRef.current = true;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 4, 9);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const accentLight1 = new THREE.PointLight(isDark ? 0x00ffff : 0x3b82f6, 1.5, 20);
    accentLight1.position.set(4, 3, 4);
    scene.add(accentLight1);

    const accentLight2 = new THREE.PointLight(isDark ? 0xff00ff : 0x8b5cf6, 1, 20);
    accentLight2.position.set(-4, 3, -2);
    scene.add(accentLight2);

    // Keyboard Base
    const baseGeo = new THREE.BoxGeometry(9, 0.4, 3.5);
    const baseMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x1a1a2e : 0x2d3748,
      metalness: 0.3,
      roughness: 0.7,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.2;
    base.receiveShadow = true;
    scene.add(base);

    // LED Strip
    const stripGeo = new THREE.BoxGeometry(9.1, 0.05, 0.1);
    const stripMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x00ffff : 0x3b82f6,
      emissive: isDark ? 0x00ffff : 0x3b82f6,
      emissiveIntensity: 0.5,
    });
    const strip = new THREE.Mesh(stripGeo, stripMat);
    strip.position.set(0, 0.01, 1.7);
    scene.add(strip);

    // Keys
    const keys: THREE.Mesh[] = [];
    const keyGeo = new THREE.BoxGeometry(0.55, 0.35, 0.55);
    const layout = [
      { row: 0, keys: 14, offset: 0 },
      { row: 1, keys: 13, offset: 0.3 },
      { row: 2, keys: 12, offset: 0.5 },
      { row: 3, keys: 11, offset: 0.8 },
    ];

    layout.forEach(({ row, keys: keyCount, offset }) => {
      for (let col = 0; col < keyCount; col++) {
        const keyMat = new THREE.MeshStandardMaterial({
          color: isDark ? 0x16213e : 0x4a5568,
          metalness: 0.2,
          roughness: 0.8,
        });
        const key = new THREE.Mesh(keyGeo, keyMat);
        const startX = -(keyCount * 0.6) / 2 + offset;
        key.position.x = startX + col * 0.6;
        key.position.y = 0.18;
        key.position.z = 1.2 - row * 0.7;
        key.castShadow = true;
        key.userData = {
          originalY: key.position.y,
          delay: Math.random() * Math.PI * 2,
          isPressed: false,
          pressTime: 0,
        };
        keys.push(key);
        scene.add(key);
      }
    });

    // Spacebar
    const spaceGeo = new THREE.BoxGeometry(4, 0.3, 0.55);
    const spaceMat = new THREE.MeshStandardMaterial({
      color: isDark ? 0x16213e : 0x4a5568,
      metalness: 0.2,
      roughness: 0.8,
    });
    const spacebar = new THREE.Mesh(spaceGeo, spaceMat);
    spacebar.position.set(0, 0.15, -1.2);
    spacebar.castShadow = true;
    spacebar.userData = { originalY: 0.15, delay: 0, isPressed: false, pressTime: 0 };
    keys.push(spacebar);
    scene.add(spacebar);

    // Floating Symbols
    const symbols: THREE.Mesh[] = [];
    const codeChars = ["</>", "{}", "()", "[];", "=>", "++", "&&", "||"];
    const colors = isDark 
      ? ["#00ffff", "#ff00ff", "#fbbf24", "#10b981", "#f472b6"]
      : ["#3b82f6", "#8b5cf6", "#f59e0b", "#10b981", "#ec4899"];

    for (let i = 0; i < 10; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = colors[i % colors.length];
        ctx.font = "bold 64px monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(codeChars[i % codeChars.length], 64, 64);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const symMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide,
      });
      const symGeo = new THREE.PlaneGeometry(0.8, 0.8);
      const symbol = new THREE.Mesh(symGeo, symMat);

      const angle = (i / 10) * Math.PI * 2;
      const radius = 5 + Math.random() * 2;
      symbol.position.set(Math.cos(angle) * radius, 1 + Math.random() * 3, Math.sin(angle) * radius - 2);
      symbol.userData = { angle, radius, floatSpeed: 0.3 + Math.random() * 0.3, baseY: symbol.position.y };
      symbols.push(symbol);
      scene.add(symbol);
    }

    // Particles
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(50 * 3);
    for (let i = 0; i < 150; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = Math.random() * 6;
      positions[i + 2] = (Math.random() - 0.5) * 10;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isDark ? 0x00ffff : 0x3b82f6,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Animation
    let time = 0;
    let lastKeyPress = 0;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.016;

      keys.forEach((key) => {
        const wave = Math.sin(time * 2 + key.userData.delay) * 0.015;
        if (key.userData.isPressed) {
          const elapsed = time - key.userData.pressTime;
          if (elapsed < 0.15) {
            key.position.y = key.userData.originalY - 0.08;
            (key.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(isDark ? 0x00ffff : 0x3b82f6);
            (key.material as THREE.MeshStandardMaterial).emissiveIntensity = 0.8;
          } else {
            key.userData.isPressed = false;
            (key.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(0x000000);
            (key.material as THREE.MeshStandardMaterial).emissiveIntensity = 0;
          }
        } else {
          key.position.y = key.userData.originalY + wave;
        }
      });

      if (time - lastKeyPress > 0.08 + Math.random() * 0.12) {
        lastKeyPress = time;
        const available = keys.filter(k => !k.userData.isPressed);
        if (available.length > 0) {
          const key = available[Math.floor(Math.random() * available.length)];
          key.userData.isPressed = true;
          key.userData.pressTime = time;
        }
      }

      symbols.forEach((sym) => {
        sym.userData.angle += 0.003;
        sym.position.x = Math.cos(sym.userData.angle) * sym.userData.radius;
        sym.position.z = Math.sin(sym.userData.angle) * sym.userData.radius - 2;
        sym.position.y = sym.userData.baseY + Math.sin(time * sym.userData.floatSpeed) * 0.5;
        sym.lookAt(camera.position);
      });

      const pos = particles.geometry.attributes.position.array as Float32Array;
      for (let i = 1; i < pos.length; i += 3) {
        pos[i] += 0.005;
        if (pos[i] > 6) pos[i] = 0;
      }
      particles.geometry.attributes.position.needsUpdate = true;

      camera.position.x = Math.sin(time * 0.3) * 0.8;
      camera.position.y = 4 + Math.cos(time * 0.2) * 0.3;
      camera.lookAt(0, 0, 0);

      accentLight1.position.x = 4 + Math.sin(time * 0.5) * 2;
      accentLight2.position.x = -4 + Math.cos(time * 0.4) * 2;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      isInitializedRef.current = false;
      
      // Safe cleanup
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
      
      renderer.dispose();
      scene.traverse((obj: any) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m: any) => m.dispose());
          } else {
            if (obj.material.map) obj.material.map.dispose();
            obj.material.dispose();
          }
        }
      });
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden"
      style={{ 
        background: isDark 
          ? "linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)" 
          : "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)" 
      }}
    />
  );
};

export default KeyboardScene;