"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, Gamepad2, Gift, Video } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

const iconMap = {
  countdown: Heart,
  game: Gamepad2,
  "wish-jar": Gift,
  videos: Video,
};

export function SidebarNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Toggle */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-6 left-6 z-50 md:hidden p-3 rounded-lg glass-medium backdrop-blur-lg border border-glass-border hover:glow-rose transition-all"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-rose-primary" />
        ) : (
          <Menu className="w-6 h-6 text-rose-primary" />
        )}
      </motion.button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-30 md:hidden bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.nav
        className="fixed left-0 top-0 h-screen w-64 glass-strong backdrop-blur-lg z-40 md:relative md:h-auto md:w-auto md:glass-medium flex flex-col md:flex-row md:items-center md:justify-center gap-2 p-6 md:p-4 border-r border-glass-border md:border-r-0"
        initial={{ x: -256 }}
        animate={{ x: isOpen ? 0 : -256 }}
        exit={{ x: -256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="md:hidden h-12" /> {/* Spacer for mobile */}

        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          {siteConfig.sections.map((section) => {
            const Icon =
              iconMap[section.id as keyof typeof iconMap] || Heart;
            const active = isActive(section.path);

            return (
              <motion.div key={section.id} whileHover={{ scale: 1.05 }}>
                <Link
                  href={section.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                    active
                      ? "glass-strong glow-rose border border-rose-primary/50"
                      : "glass hover:glass-medium border border-glass-border hover:glow-rose"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium text-text-primary">
                    {section.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.nav>
    </>
  );
}
