"use client";

import { motion } from "framer-motion";
import { Home } from "lucide-react";
import Link from "next/link";

export function HomeButton() {
  return (
    <motion.div
      className="fixed top-4 left-4 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Link href="/">
        <motion.button
          className="glass-strong rounded-full p-3 backdrop-blur-lg border border-glass-border hover:glow-rose transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="Go to Home"
        >
          <Home className="w-5 h-5 text-rose-1" />
        </motion.button>
      </Link>
    </motion.div>
  );
}
