import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface KeyboardSceneProps {
  isDark: boolean;
}

const KeyboardScene: React.FC<KeyboardSceneProps> = ({ isDark }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 2.2, 5.5);
    camera.lookAt(0, 0.6, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    container.appendChild(renderer.domElement);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const directional = new THREE.DirectionalLight(0xffffff, 0.7);
    directional.position.set(4, 5, 4);
    scene.add(directional);

    const accent1 = new THREE.PointLight(isDark ? 0x00ffff : 0x3b82f6, 1.5, 20);
    accent1.position.set(3, 2, 4);
    scene.add(accent1);

    const accent2 = new THREE.PointLight(isDark ? 0xff00ff : 0x9333ea, 1.2, 20);
    accent2.position.set(-3, 2, -3);
    scene.add(accent2);

    // Base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(9, 0.4, 3.5),
      new THREE.MeshStandardMaterial({
        color: isDark ? 0x10121a : 0xd0d4df,
        roughness: 0.7,
        metalness: 0.2,
      })
    );
    base.position.set(0, -0.2, 0);
    scene.add(base);

    // LED Strip
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(9.1, 0.05, 0.12),
      new THREE.MeshStandardMaterial({
        color: isDark ? 0x00ffff : 0x3b82f6,
        emissive: isDark ? 0x00ffff : 0x3b82f6,
        emissiveIntensity: 0.6,
      })
    );
    strip.position.set(0, 0.01, 1.7);
    scene.add(strip);

    // Keys
    const keys: THREE.Mesh[] = [];
    const keyGeo = new THREE.BoxGeometry(0.55, 0.35, 0.55);
    const rows = [
      { count: 14, offset: 0 },
      { count: 13, offset: 0.3 },
      { count: 12, offset: 0.5 },
      { count: 11, offset: 0.8 },
    ];

    rows.forEach((row, rowIndex) => {
      for (let i = 0; i < row.count; i++) {
        const mat = new THREE.MeshStandardMaterial({
          color: isDark ? 0x151a2e : 0x4b5563,
          roughness: 0.8,
          metalness: 0.2,
        });

        const key = new THREE.Mesh(keyGeo, mat);
        const startX = -(row.count * 0.6) / 2 + row.offset;

        key.position.set(startX + i * 0.6, 0.18, 1.2 - rowIndex * 0.7);

        key.userData = {
          originalY: 0.18,
          delay: Math.random() * Math.PI * 2,
          isPressed: false,
          pressTime: 0,
        };

        keys.push(key);
        scene.add(key);
      }
    });

    // Spacebar
    const space = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.3, 0.55),
      new THREE.MeshStandardMaterial({
        color: isDark ? 0x151a2e : 0x4b5563,
      })
    );
    space.position.set(0, 0.15, -1.2);
    space.userData = {
      originalY: 0.15,
      delay: Math.random() * Math.PI,
      isPressed: false,
      pressTime: 0,
    };
    keys.push(space);
    scene.add(space);

    // Floating symbols
    const symbols: THREE.Mesh[] = [];
    const symbolsList = ["<>", "{}", "()", "=>", "</>", "++", "&&", "||"];
    const symbolColors = isDark
      ? ["#00ffff", "#ff00ff", "#10b981", "#f59e0b"]
      : ["#3b82f6", "#9333ea", "#10b981", "#f59e0b"];

    for (let i = 0; i < 10; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 128;
      const ctx = canvas.getContext("2d")!;
      // @ts-ignore
      ctx.fillStyle = symbolColors[i % symbolColors.length];
      ctx.font = "bold 64px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";      // @ts-ignore
      ctx.fillText(symbolsList[i % symbolsList.length], 64, 64);

      const symMat = new THREE.MeshBasicMaterial({
        map: new THREE.CanvasTexture(canvas),
        transparent: true,
        opacity: 0.75,
      });

      const sym = new THREE.Mesh(
        new THREE.PlaneGeometry(1, 1),
        symMat
      );

      const angle = (i / 10) * Math.PI * 2;
      const radius = 5 + Math.random() * 2;

      sym.userData = {
        angle,
        radius,
        baseY: 1 + Math.random() * 2,
        floatSpeed: 0.3 + Math.random() * 0.4,
      };

      sym.position.set(
        Math.cos(angle) * radius,
        sym.userData.baseY,
        Math.sin(angle) * radius - 3
      );

      symbols.push(sym);
      scene.add(sym);
    }

    // Particles
    const pGeo = new THREE.BufferGeometry();
    const pCount = 120;
    const pos = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount * 3; i += 3) {
      pos[i] = (Math.random() - 0.5) * 15;
      pos[i + 1] = Math.random() * 6;
      pos[i + 2] = (Math.random() - 0.5) * 10;
    }

    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const pMat = new THREE.PointsMaterial({
      color: isDark ? 0x00ffff : 0x3b82f6,
      size: 0.05,
      transparent: true,
      opacity: 0.7,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Animation
    let time = 0;
    let lastPress = 0;

    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.016;

      // Key animations
      keys.forEach((key) => {
        const ud = key.userData;

        // Press animation
        if (ud.isPressed) {
          const elapsed = time - ud.pressTime;
          if (elapsed < 0.15) {
            key.position.y = ud.originalY - 0.1;
            const mat = key.material as THREE.MeshStandardMaterial;
            mat.emissive.setHex(isDark ? 0x00ffff : 0x3b82f6);
            mat.emissiveIntensity = 0.9;
          } else {
            ud.isPressed = false;
            const mat = key.material as THREE.MeshStandardMaterial;
            mat.emissiveIntensity = 0;
          }
        } else {
          // Idle wave
          key.position.y = ud.originalY + Math.sin(time * 3 + ud.delay) * 0.05;
        }
      });

      // Random key press
      if (time - lastPress > 0.22) {
        lastPress = time;
        const k = keys[Math.floor(Math.random() * keys.length)];
              // @ts-ignore
        k.userData.isPressed = true;
              // @ts-ignore
        k.userData.pressTime = time;
      }

      // Floating symbols
      symbols.forEach((sym) => {
        const ud = sym.userData;
        ud.angle += 0.01;
        sym.position.x = Math.cos(ud.angle) * ud.radius;
        sym.position.z = Math.sin(ud.angle) * ud.radius - 2;
        sym.position.y = ud.baseY + Math.sin(time * ud.floatSpeed) * 0.4;

        sym.lookAt(camera.position);
      });

      // Particle rising
      if(!pGeo) return;
      if(!pGeo.attributes)return ;
      //@ts-ignore
      const arr = pGeo?.attributes?.position.array as Float32Array;
      for (let i = 1; i < arr.length; i += 3) {
              // @ts-ignore
        arr[i] += 0.02;
              // @ts-ignore
        if (arr[i] > 6) arr[i] = 0;
      }
      //@ts-ignore
      pGeo.attributes.position.needsUpdate = true;

      // Camera subtle hover
    camera.position.x = Math.sin(time * 0.2) * 0.3; 
camera.position.y = 2.2 + Math.cos(time * 0.2) * 0.1;
      camera.lookAt(0, 0.6, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      scene.clear();
      renderer.domElement.remove();
    };
  }, [isDark]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden"
      style={{
        background: isDark
          ? "linear-gradient(135deg,#0a0a1a,#1a1a3e)"
          : "linear-gradient(135deg,#dbeafe,#bfdbfe)",
      }}
    />
  );
};

export default KeyboardScene;
