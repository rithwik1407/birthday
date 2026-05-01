"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { sampleWishes } from "@/lib/sample-data";
import { Heart, ChevronRight, Check, X } from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";

interface Wish {
  _id: string;
  senderName: string;
  message: string;
  senderPhoto: string;
  hint: string;
  revealPhoto: string;
  revealMessage: string;
  category: string;
  isSpecial?: boolean;
  isOpened?: boolean;
}

type GameState = "idle" | "reading" | "guessing";

export function WishJarSection() {
  const router = useRouter();
  const [wishes, setWishes] = useState<Wish[]>(sampleWishes);
  const [currentWishIndex, setCurrentWishIndex] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>("idle");
  const [guessAttempts, setGuessAttempts] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [guessInput, setGuessInput] = useState("");
  const [guessResult, setGuessResult] = useState<"correct" | "incorrect" | null>(null);

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const response = await fetch("/api/wishes");
        if (response.ok) {
          const data = await response.json();
          setWishes(data.length > 0 ? data : sampleWishes);
        }
      } catch (error) {
        console.error("Error fetching wishes:", error);
      }
    };

    fetchWishes();
  }, []);

  const currentWish = currentWishIndex !== null ? wishes[currentWishIndex] : null;
  const unopened = wishes.filter((w) => !w.isOpened);
  const progress = Math.round(((wishes.length - unopened.length) / wishes.length) * 100);

  const handleStartWish = () => {
    if (unopened.length === 0) return;
    const randomIndex = Math.floor(Math.random() * unopened.length);
    const randomWish = unopened[randomIndex];
    setCurrentWishIndex(wishes.findIndex((w) => w._id === randomWish._id));
    setGameState("reading");
    setGuessAttempts(0);
    setShowHint(false);
    setGuessInput("");
    setGuessResult(null);
  };

  const handleWishClick = (wish: Wish) => {
    setCurrentWishIndex(wishes.findIndex((w) => w._id === wish._id));
    setGameState("reading");
    setGuessAttempts(0);
    setShowHint(false);
    setGuessInput("");
    setGuessResult(null);
  };

  const handleRefreshWishes = async () => {
    // Reset all wishes to unopened in database
    try {
      for (const wish of wishes) {
        await fetch(`/api/wishes/${wish._id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isOpened: false }),
        });
      }
      
      // Update local state
      setWishes((prev) =>
        prev.map((w) => ({ ...w, isOpened: false }))
      );
      
      // Reset game state
      setGameState("idle");
      setCurrentWishIndex(null);
      setGuessAttempts(0);
      setShowHint(false);
      setGuessInput("");
      setGuessResult(null);
    } catch (error) {
      console.error("Error refreshing wishes:", error);
    }
  };

  const handleStartGuessing = () => {
    setGameState("guessing");
    setGuessInput("");
    setGuessResult(null);
  };

  const handleGuess = () => {
    if (!guessInput.trim()) return;

    const isCorrect = guessInput.toLowerCase().trim() === (currentWish?.senderName || "").toLowerCase();

    if (isCorrect) {
      setGuessResult("correct");
      
      // Mark wish as opened in database
      const markAsOpened = async () => {
        try {
          await fetch(`/api/wishes/${currentWish!._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isOpened: true }),
          });
          
          // Update local state
          setWishes((prev) =>
            prev.map((w) =>
              w._id === currentWish!._id ? { ...w, isOpened: true } : w
            )
          );
        } catch (error) {
          console.error("Error marking wish as opened:", error);
        }
      };
      
      markAsOpened();
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#ff6b9d", "#c77dff", "#ffd60a"],
      });
      // Redirect to reveal page after delay
      setTimeout(() => {
        router.push(`/wish-reveal?id=${currentWish!._id}`);
      }, 1000);
    } else {
      setGuessResult("incorrect");
      setGuessAttempts((prev) => prev + 1);
      if (guessAttempts >= 1) {
        setShowHint(true);
      }
      setGuessInput("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary relative overflow-hidden">
      <ParticleBackground />

      {/* Refresh Button - Only on Wish Jar */}
      {gameState === "idle" && (
        <motion.div
          className="fixed top-4 right-4 z-50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            onClick={handleRefreshWishes}
            className="glass-strong rounded-full p-3 backdrop-blur-lg border border-glass-border hover:glow-rose transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Refresh all wishes"
          >
            <svg className="w-5 h-5 text-rose-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </motion.button>
        </motion.div>
      )}

      <div className="relative z-10 space-y-8 p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
        {/* Idle State - Show Wishes Grid */}
        {gameState === "idle" && (
          <>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="font-display text-6xl md:text-7xl text-gradient mb-4">
                Wish Jar
              </h1>
              <p className="text-lg md:text-xl text-text-secondary">
                {wishes.length - unopened.length} / {wishes.length} wishes opened
              </p>
            </motion.div>

            {/* Progress Bar */}
            <motion.div
              className="glass-strong rounded-full p-1 backdrop-blur-lg overflow-hidden w-full max-w-2xl border border-glass-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-3 gradient-romantic rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            {/* Start Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleStartWish}
                disabled={unopened.length === 0}
                size="lg"
                className="gap-2"
              >
                <Heart className="w-5 h-5" />
                {unopened.length === 0 ? "All Wishes Opened!" : "Open a Wish"}
              </Button>
            </motion.div>

            {/* Wishes Grid */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.05 }}
            >
              {wishes.map((wish) => {
                const isOpened = wish.isOpened || false;
                return (
                  <motion.div
                    key={wish._id}
                    onClick={() => {
                      handleWishClick(wish);
                    }}
                    className={`h-32 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${
                      isOpened
                        ? "glass-strong glow-rose"
                        : "glass-medium hover:glass-strong border border-glass-border"
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="text-center"
                      animate={!isOpened ? { y: [0, -5, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="text-4xl mb-2">
                        {isOpened ? "📭" : "💌"}
                      </div>
                      <p className="text-xs text-text-secondary">
                        {isOpened ? "Opened" : "Wish"}
                      </p>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}

        {/* Reading State - Show Message */}
        <AnimatePresence>
          {gameState === "reading" && currentWish && (
            <motion.div
              className="glass-strong rounded-3xl p-8 md:p-12 text-center backdrop-blur-lg shadow-lg border border-glass-border max-w-2xl glow-rose"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                className="text-5xl mb-6"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                💌
              </motion.div>

              <motion.h2
                className="font-display text-3xl md:text-4xl text-gradient mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                A Message for You
              </motion.h2>

              <motion.p
                className="text-lg md:text-xl text-text-secondary mb-8 leading-relaxed italic"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                "{currentWish.message}"
              </motion.p>

              <motion.div
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <p className="text-text-tertiary text-sm">
                  Can you guess who sent this? 🤔
                </p>
                <Button
                  onClick={handleStartGuessing}
                  size="lg"
                  className="gap-2"
                >
                  Start Guessing
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Guessing State - Text Input */}
        <AnimatePresence>
          {gameState === "guessing" && currentWish && (
            <motion.div
              className="glass-strong rounded-3xl p-8 md:p-12 text-center backdrop-blur-lg shadow-lg border border-glass-border max-w-2xl glow-rose"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.h2
                className="font-display text-3xl md:text-4xl text-gradient mb-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Who sent this? 🤔
              </motion.h2>

              <motion.p
                className="text-text-secondary mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {guessAttempts === 0
                  ? "Type the sender's name"
                  : guessAttempts === 1
                  ? "Not quite! Try again 😄"
                  : "Here's a hint to help you!"}
              </motion.p>

              {/* Hint */}
              {showHint && (
                <motion.div
                  className="glass-medium rounded-lg p-4 mb-6 text-text-secondary"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm">💡 Hint: {currentWish.hint}</p>
                </motion.div>
              )}

              {/* Guess Result Message */}
              {guessResult === "incorrect" && (
                <motion.div
                  className="glass-medium rounded-lg p-3 mb-6 text-rose-1 text-sm"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  ❌ That's not correct. Try again!
                </motion.div>
              )}

              {/* Text Input */}
              <motion.div
                className="space-y-4 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <input
                  type="text"
                  value={guessInput}
                  onChange={(e) => setGuessInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleGuess();
                    }
                  }}
                  placeholder="Type the sender's name..."
                  className="w-full px-6 py-4 rounded-xl glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1 text-center text-lg"
                  autoFocus
                />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                className="flex gap-3 justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={handleGuess}
                  disabled={!guessInput.trim()}
                  size="lg"
                  className="gap-2"
                >
                  <Check className="w-4 h-4" />
                  Check Answer
                </Button>
                <Button
                  onClick={() => {
                    setGameState("reading");
                    setGuessInput("");
                    setGuessResult(null);
                  }}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Back
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>



        {/* Empty State */}
        {wishes.length === 0 && gameState === "idle" && (
          <motion.div
            className="glass-strong rounded-2xl p-12 text-center backdrop-blur-lg border border-glass-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-text-secondary text-lg">
              No wishes yet. They will appear here soon! 💕
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
