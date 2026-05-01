"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { siteConfig } from "@/lib/site-config";
import { getTimeRemaining } from "@/lib/utils";
import { ParticleBackground } from "@/components/particle-background";

export function CountdownSection() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
    setTimeRemaining(getTimeRemaining(siteConfig.birthdayDate));

    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(siteConfig.birthdayDate));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeRemaining.days },
    { label: "Hours", value: timeRemaining.hours },
    { label: "Minutes", value: timeRemaining.minutes },
    { label: "Seconds", value: timeRemaining.seconds },
  ];

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary relative overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10 space-y-12 p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
          <motion.div className="text-center" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-6xl md:text-7xl text-gradient mb-4">Countdown</h1>
            <p className="text-xl md:text-2xl text-text-secondary">Loading...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary relative overflow-hidden">
      <ParticleBackground />

      <div className="relative z-10 space-y-12 p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-6xl md:text-7xl text-gradient mb-4">
            Countdown
          </h1>
          <p className="text-xl md:text-2xl text-text-secondary">
            {timeRemaining.isExpired
              ? "🎉 The moment has arrived!"
              : "Time until the big day..."}
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              className="glass-strong rounded-2xl p-6 md:p-8 text-center backdrop-blur-lg border border-glass-border group hover:glow-rose transition-all duration-300"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
            >
              <motion.div
                className="text-5xl md:text-6xl font-display font-bold text-gradient"
                key={unit.value}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {String(unit.value).padStart(2, "0")}
              </motion.div>
              <p className="text-sm md:text-base text-text-tertiary mt-3 font-medium">
                {unit.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {!timeRemaining.isExpired && (
          <motion.div
            className="glass-medium rounded-2xl p-8 text-center backdrop-blur-lg border border-glass-border max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <p className="text-text-secondary text-lg">
              Every second brings us closer to your special day 💕
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
