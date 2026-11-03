import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useReducedMotion } from 'framer-motion';

interface ThreeStoryCanvasProps {
  activeStep: number;
  mousePos: { x: number; y: number };
}

export const ThreeStoryCanvas: React.FC<ThreeStoryCanvasProps> = ({ activeStep, mousePos }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const shouldReduceMotion = !!prefersReduced;

  // Refs to hold mutable Three.js objects for animation
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Scene elements refs
  const ring1Ref = useRef<THREE.Mesh | null>(null);
  const ring2Ref = useRef<THREE.Mesh | null>(null);
  const ring3Ref = useRef<THREE.Mesh | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const floatingGroupRef = useRef<THREE.Group | null>(null);
  const pointLight1Ref = useRef<THREE.PointLight | null>(null);
  const pointLight2Ref = useRef<THREE.PointLight | null>(null);

  // Target camera poses per stage
  const stageCameraTargets = [
    { x: 0, y: 0, z: 9, lightColor1: 0xc4623a, lightColor2: 0xf0c987, rotSpeed: 0.008 },
    { x: 1.2, y: 0.8, z: 8.5, lightColor1: 0x2563a6, lightColor2: 0x2e7d52, rotSpeed: 0.012 },
    { x: -1.0, y: -0.5, z: 8.2, lightColor1: 0x2563a6, lightColor2: 0xb9382c, rotSpeed: 0.015 },
    { x: 0, y: 0, z: 7.8, lightColor1: 0x2e7d52, lightColor2: 0xc4623a, rotSpeed: 0.024 },
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 360;
    const height = container.clientHeight || 640;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 9);
    cameraRef.current = camera;

    // 3. Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.2);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xc4623a, 3.5, 20);
    pointLight1.position.set(4, 4, 4);
    scene.add(pointLight1);
    pointLight1Ref.current = pointLight1;

    const pointLight2 = new THREE.PointLight(0x2563a6, 2.5, 20);
    pointLight2.position.set(-4, -3, 3);
    scene.add(pointLight2);
    pointLight2Ref.current = pointLight2;

    // 5. 3D Rings around the stage
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0xc4623a,
      metalness: 0.6,
      roughness: 0.2,
      wireframe: false,
      transparent: true,
      opacity: 0.75,
    });
    const ringGeo1 = new THREE.TorusGeometry(3.6, 0.04, 16, 100);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);
    ring1Ref.current = ring1;

    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x2563a6,
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.6,
    });
    const ringGeo2 = new THREE.TorusGeometry(4.2, 0.03, 16, 100);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 5;
    scene.add(ring2);
    ring2Ref.current = ring2;

    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0x2e7d52,
      metalness: 0.5,
      roughness: 0.4,
      transparent: true,
      opacity: 0.55,
    });
    const ringGeo3 = new THREE.TorusGeometry(4.8, 0.025, 16, 100);
    const ring3 = new THREE.Mesh(ringGeo3, ringMat3);
    ring3.rotation.z = Math.PI / 6;
    scene.add(ring3);
    ring3Ref.current = ring3;

    // 6. Floating Category 3D Polyhedra
    const floatingGroup = new THREE.Group();
    scene.add(floatingGroup);
    floatingGroupRef.current = floatingGroup;

    // Octahedron (Newton blue)
    const octGeo = new THREE.OctahedronGeometry(0.35);
    const octMat = new THREE.MeshStandardMaterial({
      color: 0x2563a6,
      metalness: 0.8,
      roughness: 0.15,
      wireframe: false,
    });
    const octMesh = new THREE.Mesh(octGeo, octMat);
    octMesh.position.set(-2.6, 1.8, 0.5);
    floatingGroup.add(octMesh);

    // Icosahedron (Terracotta warm)
    const icoGeo = new THREE.IcosahedronGeometry(0.4);
    const icoMat = new THREE.MeshStandardMaterial({
      color: 0xc4623a,
      metalness: 0.7,
      roughness: 0.2,
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    icoMesh.position.set(2.7, -1.6, 0.8);
    floatingGroup.add(icoMesh);

    // Dodecahedron (Club green)
    const dodGeo = new THREE.DodecahedronGeometry(0.3);
    const dodMat = new THREE.MeshStandardMaterial({
      color: 0x2e7d52,
      metalness: 0.6,
      roughness: 0.25,
    });
    const dodMesh = new THREE.Mesh(dodGeo, dodMat);
    dodMesh.position.set(2.5, 2.0, -0.6);
    floatingGroup.add(dodMesh);

    // Small Gold Sphere
    const sphGeo = new THREE.SphereGeometry(0.25, 32, 32);
    const sphMat = new THREE.MeshStandardMaterial({
      color: 0xf0c987,
      metalness: 0.9,
      roughness: 0.1,
    });
    const sphMesh = new THREE.Mesh(sphGeo, sphMat);
    sphMesh.position.set(-2.4, -2.2, 0.4);
    floatingGroup.add(sphMesh);

    // 7. 3D Particle Constellation
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
      new THREE.Color(0xc4623a), // Terracotta
      new THREE.Color(0x2563a6), // Newton
      new THREE.Color(0x2e7d52), // Club
      new THREE.Color(0xb9382c), // RU Red
      new THREE.Color(0xf0c987), // Gold
    ];

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.5 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.9;

      positions[i * 3] = radius * Math.cos(theta) * Math.cos(phi);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.sin(theta) * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.09,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    particlesRef.current = particles;

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth || 360;
      const newH = container.clientHeight || 640;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      if (!shouldReduceMotion) {
        // Rotate 3D rings
        if (ring1) ring1.rotation.z += 0.005;
        if (ring2) ring2.rotation.x += 0.007;
        if (ring3) ring3.rotation.y += 0.006;

        // Rotate particles
        if (particles) {
          particles.rotation.y += 0.003;
          particles.rotation.x = Math.sin(elapsedTime * 0.4) * 0.08;
        }

        // Float polyhedra group
        if (floatingGroup) {
          floatingGroup.rotation.y += 0.006;
          floatingGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15;
          octMesh.rotation.x += 0.015;
          octMesh.rotation.y += 0.02;
          icoMesh.rotation.y += 0.018;
          dodMesh.rotation.z += 0.012;
        }
      }

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);

      // Clean up geometries and materials
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      ringGeo3.dispose();
      ringMat3.dispose();
      octGeo.dispose();
      octMat.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      dodGeo.dispose();
      dodMat.dispose();
      sphGeo.dispose();
      sphMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [shouldReduceMotion]);

  // Stage transition effect on lights and camera
  useEffect(() => {
    const camera = cameraRef.current;
    const target = stageCameraTargets[activeStep] || stageCameraTargets[0];

    if (camera) {
      camera.position.z = target.z;
    }

    if (pointLight1Ref.current) {
      pointLight1Ref.current.color.setHex(target.lightColor1);
    }
    if (pointLight2Ref.current) {
      pointLight2Ref.current.color.setHex(target.lightColor2);
    }

    // In stage 4, add a momentary brightness flash
    if (activeStep === 3 && pointLight1Ref.current && pointLight2Ref.current) {
      pointLight1Ref.current.intensity = 5.0;
      pointLight2Ref.current.intensity = 4.0;
      setTimeout(() => {
        if (pointLight1Ref.current) pointLight1Ref.current.intensity = 3.5;
        if (pointLight2Ref.current) pointLight2Ref.current.intensity = 2.5;
      }, 600);
    }
  }, [activeStep]);

  // Mouse Parallax effect on Three.js camera position
  useEffect(() => {
    if (shouldReduceMotion || !cameraRef.current) return;
    const target = stageCameraTargets[activeStep] || stageCameraTargets[0];
    const camera = cameraRef.current;
    camera.position.x = target.x + (mousePos.x / 6) * 0.7;
    camera.position.y = target.y + (mousePos.y / 6) * -0.7;
  }, [mousePos, activeStep, shouldReduceMotion]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center overflow-visible"
      aria-hidden="true"
    />
  );
};
