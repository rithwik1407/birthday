"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";
import { shuffleArray } from "@/lib/utils";
import { RotateCcw } from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { GameBlurBackground } from "@/components/game-blur-background";
import { useRouter } from "next/navigation";

interface Card {
  id: number;
  pairId: number;
  isFlipped: boolean;
  isMatched: boolean;
  image: string;
}

interface GameCompletion {
  title: string;
  message: string;
  videoUrl: string;
  thumbnail?: string;
}

export function GameSection() {
  const router = useRouter();
  const totalPairs = 8;
  const [cards, setCards] = useState<Card[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [moves, setMoves] = useState(0);
  const [completion, setCompletion] = useState<GameCompletion | null>(null);
  const [gameImages, setGameImages] = useState<string[]>([]);

  // Fetch game images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("/api/game-images");
        if (response.ok) {
          const data = await response.json();
          setGameImages(data);
        }
      } catch (error) {
        console.error("Error fetching game images:", error);
      }
    };

    fetchImages();
  }, []);

  // Fetch game completion message
  useEffect(() => {
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

  const initializeGame = useCallback(() => {
    const imagesToUse = gameImages.length > 0 ? gameImages : [
      "🌹", "💕", "✨", "🎀", "💐", "🌸", "💖", "🎁",
    ];

    const newCards: Card[] = [];
    for (let i = 0; i < totalPairs; i++) {
      const image = imagesToUse[i];
      newCards.push({
        id: i * 2,
        pairId: i,
        isFlipped: false,
        isMatched: false,
        image,
      });
      newCards.push({
        id: i * 2 + 1,
        pairId: i,
        isFlipped: false,
        isMatched: false,
        image,
      });
    }
    setCards(shuffleArray(newCards));
    setFlipped([]);
    setMatched([]);
    setGameWon(false);
    setMoves(0);
  }, [gameImages]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (index: number) => {
    if (gameWon || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(moves + 1);
      const [first, second] = newFlipped;

      if (cards[first].pairId === cards[second].pairId) {
        setMatched([...matched, first, second]);
        setFlipped([]);

        if (matched.length + 2 === cards.length) {
          setGameWon(true);
          confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 },
            colors: ["#ff6b9d", "#c77dff", "#ffd60a"],
          });
        }
      } else {
        setTimeout(() => setFlipped([]), 600);
      }
    }
  };

  const progress = Math.round((matched.length / cards.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary relative overflow-hidden">
      <GameBlurBackground />
      <ParticleBackground />

      <div className="relative z-10 space-y-8 p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-6xl md:text-7xl text-gradient mb-4">
            Memory Match Game
          </h1>
          <p className="text-lg md:text-xl text-text-secondary">
            Flip cards and match the pairs 💕
          </p>
          <motion.div
            className="mt-4 glass-medium rounded-lg p-3 text-sm text-text-secondary inline-block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ⭐ Complete the game in <span className="font-bold text-rose-1">less than 20 moves</span> for a surprise video!
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="glass-strong rounded-2xl p-6 text-center backdrop-blur-lg border border-glass-border hover:glow-rose transition-all">
            <p className="text-sm text-text-tertiary mb-2">Moves</p>
            <motion.div
              className="text-4xl font-display font-bold text-gradient"
              key={moves}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {moves}
            </motion.div>
          </div>

          <div className="glass-strong rounded-2xl p-6 text-center backdrop-blur-lg border border-glass-border hover:glow-rose transition-all">
            <p className="text-sm text-text-tertiary mb-2">Progress</p>
            <motion.div
              className="text-4xl font-display font-bold text-gradient"
              key={progress}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {progress}%
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="glass-medium rounded-full p-1 backdrop-blur-lg overflow-hidden w-full max-w-2xl border border-glass-border"
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

        <motion.div
          className="grid grid-cols-4 gap-3 md:gap-4 w-full max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.05 }}
        >
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index);
            const isMatched = matched.includes(index);
            const isImageUrl = card.image.startsWith("http");

            return (
              <motion.button
                key={index}
                onClick={() => handleCardClick(index)}
                className="aspect-square"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.02 }}
                whileHover={!isMatched ? { scale: 1.05 } : {}}
                whileTap={!isMatched ? { scale: 0.95 } : {}}
              >
                <motion.div
                  className={`w-full h-full rounded-xl font-display font-bold text-3xl flex items-center justify-center cursor-pointer transition-all overflow-hidden ${
                    isMatched
                      ? "gradient-romantic text-white shadow-lg glow-rose"
                      : "glass-medium text-text-primary hover:glass-strong border border-glass-border hover:glow-rose"
                  }`}
                  animate={{
                    rotateY: isFlipped || isMatched ? 0 : 180,
                  }}
                  transition={{ duration: 0.4 }}
                  style={{ perspective: 1000 }}
                >
                  {isFlipped || isMatched ? (
                    <motion.div
                      className="w-full h-full flex items-center justify-center"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {isImageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={card.image}
                          alt="Game card"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl md:text-5xl">{card.image}</span>
                      )}
                    </motion.div>
                  ) : (
                    <span className="text-2xl md:text-3xl opacity-40">🎴</span>
                  )}
                </motion.div>
              </motion.button>
            );
          })}
        </motion.div>

        <AnimatePresence>
          {gameWon && (
            <motion.div
              className="glass-strong rounded-3xl p-8 md:p-12 text-center backdrop-blur-lg shadow-lg border border-glass-border max-w-2xl glow-rose"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                🎉
              </motion.div>

              <motion.h2
                className="font-display text-4xl md:text-5xl text-gradient mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                You Won!
              </motion.h2>

              <motion.p
                className="text-lg text-text-secondary mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Completed in <span className="font-bold text-rose-primary">{moves} moves</span>
              </motion.p>

              {/* Show Video Only if Moves < 20 */}
              {moves < 20 && completion?.videoUrl && (
                <motion.div
                  className="mb-6 space-y-4"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="glass-medium rounded-lg p-3 text-center text-sm text-rose-1 font-medium">
                    🎁 You unlocked the surprise video!
                  </div>

                  <Button
                    onClick={() => router.push(`/game-completion?moves=${moves}`)}
                    size="lg"
                    className="w-full gap-2"
                  >
                    Watch Video
                  </Button>
                </motion.div>
              )}

              {/* Show Message if Moves >= 20 */}
              {moves >= 20 && (
                <motion.div
                  className="glass-medium rounded-lg p-4 text-center mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <p className="text-text-secondary">
                    Try again in <span className="font-bold text-rose-1">less than 20 moves</span> to unlock the surprise video! 🎁
                  </p>
                </motion.div>
              )}

              {/* Completion Message */}
              <motion.div
                className="space-y-4 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {completion?.title && (
                  <motion.h3
                    className="font-display text-2xl md:text-3xl text-gradient"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    {completion.title}
                  </motion.h3>
                )}

                {completion?.message && (
                  <motion.p
                    className="text-lg text-text-secondary italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {completion.message}
                  </motion.p>
                )}

                {!completion?.message && (
                  <motion.p
                    className="text-text-tertiary italic"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {siteConfig.game.winMessage}
                  </motion.p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <Button onClick={initializeGame} size="lg" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Play Again
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video Player Modal - Removed, using native video controls instead */}

        {!gameWon && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={initializeGame}
              variant="outline"
              size="md"
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Game
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
