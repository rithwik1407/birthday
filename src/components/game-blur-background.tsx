"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function GameBlurBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x0f0a12);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);

    // Create particles with blur effect
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 200;

      velocities[i] = (Math.random() - 0.5) * 0.5;
      velocities[i + 1] = (Math.random() - 0.5) * 0.5;
      velocities[i + 2] = (Math.random() - 0.5) * 0.5;
    }

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xff6b9d,
      size: 2,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(geometry, material);
    particlesRef.current = particles;
    scene.add(particles);

    // Add glowing orbs
    const orbGeometry = new THREE.IcosahedronGeometry(15, 4);
    const orbMaterial = new THREE.MeshPhongMaterial({
      color: 0x9d4edd,
      emissive: 0x9d4edd,
      wireframe: true,
      transparent: true,
      opacity: 0.1,
    });

    const orb1 = new THREE.Mesh(orbGeometry, orbMaterial);
    orb1.position.set(-60, 40, -50);
    scene.add(orb1);

    const orb2 = new THREE.Mesh(orbGeometry, orbMaterial.clone());
    orb2.position.set(60, -40, -50);
    scene.add(orb2);

    // Lighting
    const light = new THREE.PointLight(0xff6b9d, 1, 500);
    light.position.set(50, 50, 50);
    scene.add(light);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0001;
        particlesRef.current.rotation.y += 0.0002;

        const positionAttribute = geometry.getAttribute("position");
        const positions = positionAttribute.array as Float32Array;

        for (let i = 0; i < particleCount * 3; i += 3) {
          positions[i] += velocities[i];
          positions[i + 1] += velocities[i + 1];
          positions[i + 2] += velocities[i + 2];

          // Wrap around
          if (Math.abs(positions[i]) > 100) velocities[i] *= -1;
          if (Math.abs(positions[i + 1]) > 100) velocities[i + 1] *= -1;
          if (Math.abs(positions[i + 2]) > 100) velocities[i + 2] *= -1;
        }

        positionAttribute.needsUpdate = true;
      }

      // Rotate orbs
      orb1.rotation.x += 0.0005;
      orb1.rotation.y += 0.0003;
      orb2.rotation.x -= 0.0004;
      orb2.rotation.y -= 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10"
      style={{ filter: "blur(40px)" }}
    />
  );
}
