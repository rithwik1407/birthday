"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { TypingText } from "@/components/typing-text";
import { MusicPlayer } from "@/components/music-player";
import { SidebarNav } from "@/components/sidebar-nav";
import { ParticleBackground } from "@/components/particle-background";
import { siteConfig } from "@/lib/site-config";
import { getTimeRemaining } from "@/lib/utils";
import Link from "next/link";

export default function MainPage() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [showPasscodeInput, setShowPasscodeInput] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const triggerConfetti = () => {
    confetti({
      particleCount: 200,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#ff6b9d", "#c77dff", "#ffd60a"],
    });
  };

  // Update countdown
  useEffect(() => {
    const time = getTimeRemaining(siteConfig.birthdayDate);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimeRemaining(time);

    if (time.isExpired && !isRevealed) {
      setIsRevealed(true);
      triggerConfetti();
    }

    const interval = setInterval(() => {
      const time = getTimeRemaining(siteConfig.birthdayDate);
      setTimeRemaining(time);

      if (time.isExpired && !isRevealed) {
        setIsRevealed(true);
        triggerConfetti();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRevealed]);

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === siteConfig.passcode) {
      setIsRevealed(true);
      triggerConfetti();
    } else {
      setPasscode("");
      alert("Wrong passcode, try again!");
    }
  };

  if (isRevealed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary flex flex-col">
        <SidebarNav />
        <ParticleBackground />

        <main className="flex-1 flex items-center justify-center p-4 md:p-8 relative z-10">
          <motion.div
            className="w-full flex flex-col items-center space-y-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Main Message */}
            <motion.div
              className="text-center space-y-6 max-w-3xl"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <motion.h1
                className="font-display text-6xl md:text-7xl text-gradient"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {siteConfig.revealMessage}
              </motion.h1>

              <motion.p
                className="text-xl md:text-2xl text-text-secondary font-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <TypingText
                  text={siteConfig.revealSubmessage}
                  delay={0.8}
                  duration={0.03}
                />
              </motion.p>
            </motion.div>

            {/* Hint Card */}
            <motion.div
              className="glass-strong rounded-2xl p-8 text-center backdrop-blur-lg border border-glass-border max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <p className="text-text-secondary italic text-lg">
                ✨ {siteConfig.hint}
              </p>
            </motion.div>

            {/* Navigation Grid - Only Bottom Cards */}
            <motion.div
              className="flex justify-center w-full mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, staggerChildren: 0.1 }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl px-4">
              {siteConfig.sections.map((section, idx) => (
                <Link key={section.id} href={section.path}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 1.4 + idx * 0.15, duration: 0.6 }}
                    whileHover={{ scale: 1.08, y: -8 }}
                    whileTap={{ scale: 0.95 }}
                    className="glass-strong rounded-2xl p-8 text-center cursor-pointer group hover:glow-rose transition-all duration-300 border border-glass-border backdrop-blur-lg h-full flex flex-col items-center justify-center"
                  >
                    <motion.div 
                      className="text-5xl md:text-6xl mb-4 group-hover:scale-125 transition-transform duration-300"
                      whileHover={{ rotate: 10 }}
                    >
                      {section.id === "countdown" && "⏱️"}
                      {section.id === "game" && "🎮"}
                      {section.id === "wish-jar" && "💌"}
                      {section.id === "videos" && "🎬"}
                    </motion.div>
                    <p className="text-base md:text-lg font-semibold text-text-primary group-hover:text-rose-1 transition-colors">
                      {section.label}
                    </p>
                  </motion.div>
                </Link>
              ))}
              </div>
            </motion.div>
          </motion.div>
        </main>

        <MusicPlayer
          title={siteConfig.music.title}
          url={siteConfig.music.url}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary flex flex-col overflow-hidden">
      <ParticleBackground />

      <main className="flex-1 flex items-center justify-center p-4 relative z-10">
        <motion.div
          className="max-w-2xl w-full text-center space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Title */}
          <motion.h1
            className="font-display text-6xl md:text-7xl text-gradient"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            {siteConfig.eventTitle}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-2xl md:text-3xl text-text-secondary font-light"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            For {siteConfig.herName}
          </motion.p>

          {/* Countdown Grid */}
          <motion.div
            className="grid grid-cols-4 gap-3 md:gap-4 my-12"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { label: "Days", value: timeRemaining.days },
              { label: "Hours", value: timeRemaining.hours },
              { label: "Minutes", value: timeRemaining.minutes },
              { label: "Seconds", value: timeRemaining.seconds },
            ].map((item) => (
              <motion.div
                key={item.label}
                className="glass-medium rounded-xl p-4 backdrop-blur-lg border border-glass-border group hover:glow-rose transition-all duration-300"
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <motion.div
                  className="text-3xl md:text-4xl font-display font-bold text-gradient"
                  key={item.value}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {String(item.value).padStart(2, "0")}
                </motion.div>
                <p className="text-xs md:text-sm text-text-tertiary mt-2">
                  {item.label}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Passcode Section */}
          {!showPasscodeInput ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <Button
                onClick={() => setShowPasscodeInput(true)}
                variant="outline"
                size="lg"
                className="border-rose-primary text-rose-primary hover:bg-rose-primary/10"
              >
                Have a passcode?
              </Button>
            </motion.div>
          ) : (
            <motion.form
              onSubmit={handlePasscodeSubmit}
              className="flex gap-2 justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode"
                className="px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-primary backdrop-blur-lg border border-glass-border"
                autoFocus
              />
              <Button type="submit" size="md">
                Unlock
              </Button>
            </motion.form>
          )}

          {/* Info Text */}
          <motion.p
            className="text-sm text-text-tertiary italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            The countdown will auto-reveal when the time is up...
          </motion.p>
        </motion.div>
      </main>

      <MusicPlayer
        title={siteConfig.music.title}
        url={siteConfig.music.url}
      />
    </div>
  );
}
