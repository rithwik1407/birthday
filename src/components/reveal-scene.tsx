"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion } from "framer-motion";

function RotatingOrb() {
  return (
    <Sphere args={[1, 100, 200]} scale={1.5}>
      <MeshDistortMaterial
        color="#ff6fa3"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.4}
      />
    </Sphere>
  );
}

export function RevealScene() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={containerRef}
      className="relative w-full h-96 rounded-2xl overflow-hidden shadow-romance"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 75 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <RotatingOrb />
        <OrbitControls autoRotate autoRotateSpeed={4} enableZoom={false} />
      </Canvas>
    </motion.div>
  );
}
