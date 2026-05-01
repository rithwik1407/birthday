"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  title?: string;
  url?: string;
}

export function MusicPlayer({ title = "Our Song", url }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState<HTMLAudioElement | null>(
    typeof window !== "undefined" && url ? new Audio(url) : null
  );

  const togglePlay = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        // Autoplay might be blocked
      });
    }
    setIsPlaying(!isPlaying);
  };

  if (!url) return null;

  return (
    <motion.button
      onClick={togglePlay}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-5 py-3 rounded-full glass-medium backdrop-blur-lg border border-glass-border hover:glow-rose transition-all duration-300"
      whileHover={{ scale: 1.05, y: -5 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      {isPlaying ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Volume2 className="w-5 h-5 text-rose-primary" />
          </motion.div>
          <span className="text-sm font-medium text-text-primary">{title}</span>
        </>
      ) : (
        <>
          <VolumeX className="w-5 h-5 text-text-tertiary" />
          <span className="text-sm font-medium text-text-secondary">Music</span>
        </>
      )}
    </motion.button>
  );
}
