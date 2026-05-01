"use client";

import { motion } from "framer-motion";

export function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-rose-3 via-background to-peach-2">
      <div className="flex flex-col items-center gap-6">
        <motion.div
          className="relative w-16 h-16"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-rose-1 to-peach-1 opacity-75"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div className="absolute inset-2 rounded-full bg-background" />
        </motion.div>
        <motion.p
          className="text-ink-1 font-display text-xl"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading your surprise...
        </motion.p>
      </div>
    </div>
  );
}
