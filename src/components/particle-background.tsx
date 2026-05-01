"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  xOffset: number;
  isRose: boolean;
}

// Generate particles with deterministic seeded randomness
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function generateParticles(): Particle[] {
  return Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: seededRandom(i * 1.1) * 100,
    y: seededRandom(i * 2.3) * 100,
    size: seededRandom(i * 3.7) * 3 + 1,
    duration: seededRandom(i * 4.2) * 20 + 20,
    delay: seededRandom(i * 5.1) * 5,
    xOffset: seededRandom(i * 6.4) * 50 - 25,
    isRose: seededRandom(i * 7.8) > 0.5,
  }));
}

export function ParticleBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    setParticles(generateParticles());
  }, []);

  if (!isClient) {
    return <div className="fixed inset-0 pointer-events-none overflow-hidden" />;
  }

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: particle.isRose
              ? "rgba(255, 107, 157, 0.3)"
              : "rgba(157, 78, 221, 0.3)",
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, particle.xOffset, 0],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Gradient Orbs */}
      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(255, 107, 157, 0.5) 0%, transparent 70%)",
          left: "-10%",
          top: "-10%",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(157, 78, 221, 0.5) 0%, transparent 70%)",
          right: "-10%",
          bottom: "-10%",
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
