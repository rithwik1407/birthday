"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { RotateCcw, ArrowLeft } from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { HomeButton } from "@/components/home-button";

interface GameCompletion {
  title: string;
  message: string;
  videoUrl: string;
  thumbnail?: string;
}

export default function GameCompletionPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [completion, setCompletion] = useState<GameCompletion | null>(null);
  const [moves, setMoves] = useState<number | null>(null);

  useEffect(() => {
    // Get moves from URL params
    const params = new URLSearchParams(window.location.search);
    const movesParam = params.get("moves");
    if (movesParam) {
      setMoves(parseInt(movesParam));
    }

    // Fetch game completion data
    const fetchCompletion = async () => {
      try {
        const response = await fetch("/api/game-completion");
        if (response.ok) {
          const data = await response.json();
          setCompletion(data);
        }
      } catch (error) {
        console.error("Error fetching game completion:", error);
      }
    };

    fetchCompletion();
  }, []);

  const handlePlayAgain = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary relative overflow-hidden">
      <HomeButton />
      <ParticleBackground />

      <div className="relative z-10 space-y-8 p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          className="glass-strong rounded-3xl p-8 md:p-12 text-center backdrop-blur-lg shadow-lg border border-glass-border max-w-4xl glow-rose w-full"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
        >
          <motion.div
            className="text-5xl mb-6"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5 }}
          >
            🎁
          </motion.div>

          <motion.h1
            className="font-display text-4xl md:text-5xl text-gradient mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            You Unlocked the Surprise!
          </motion.h1>

          {moves !== null && (
            <motion.p
              className="text-lg text-text-secondary mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Completed in <span className="font-bold text-rose-primary">{moves} moves</span>
            </motion.p>
          )}

          {/* Large Video Player */}
          {completion?.videoUrl && (
            <motion.div
              className="relative rounded-2xl overflow-hidden bg-black mb-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <video
                ref={videoRef}
                src={completion.videoUrl}
                controls
                controlsList="nodownload"
                crossOrigin="anonymous"
                className="w-full"
                style={{
                  width: "100%",
                  height: "auto",
                  minHeight: "500px",
                  maxHeight: "700px",
                  objectFit: "contain",
                }}
              />
            </motion.div>
          )}

          {/* Completion Message */}
          {(completion?.title || completion?.message) && (
            <motion.div
              className="space-y-3 text-center mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {completion?.title && (
                <h2 className="font-display text-3xl md:text-4xl text-gradient">
                  {completion.title}
                </h2>
              )}
              {completion?.message && (
                <p className="text-lg text-text-secondary italic">
                  {completion.message}
                </p>
              )}
            </motion.div>
          )}

          {/* Action Buttons */}
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button onClick={handlePlayAgain} size="lg" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              Play Again
            </Button>
            <Button onClick={handleGoBack} variant="outline" size="lg" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
