"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { TypewriterText } from "@/components/typewriter-text";
import { ArrowLeft, Heart } from "lucide-react";
import { ParticleBackground } from "@/components/particle-background";
import { HomeButton } from "@/components/home-button";
import confetti from "canvas-confetti";

interface Wish {
  _id: string;
  senderName: string;
  message: string;
  senderPhoto: string;
  hint: string;
  revealPhoto: string;
  revealMessage: string;
  category: string;
}

function WishRevealContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wishId = searchParams.get("id");
  const [wish, setWish] = useState<Wish | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wishId) {
      router.push("/wish-jar");
      return;
    }

    // Fetch all wishes and find the one with matching ID
    const fetchWish = async () => {
      try {
        const response = await fetch("/api/wishes");
        if (response.ok) {
          const wishes = await response.json();
          const foundWish = wishes.find((w: Wish) => w._id === wishId);
          if (foundWish) {
            setWish(foundWish);
            // Trigger confetti
            confetti({
              particleCount: 150,
              spread: 100,
              origin: { y: 0.6 },
              colors: ["#ff6b9d", "#c77dff", "#ffd60a"],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching wish:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWish();
  }, [wishId, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl"
        >
          💌
        </motion.div>
      </div>
    );
  }

  if (!wish) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary flex items-center justify-center">
        <Button onClick={() => router.push("/wish-jar")} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wishes
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary relative overflow-hidden">
      <HomeButton />
      <ParticleBackground />

      <div className="relative z-10 p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          className="glass-strong rounded-3xl p-8 md:p-12 backdrop-blur-lg shadow-lg border border-glass-border max-w-3xl glow-rose w-full"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
        >
          {/* Back Button */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={() => router.push("/wish-jar")}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </motion.div>

          {/* Reveal Photo */}
          <motion.div
            className="relative rounded-2xl overflow-hidden mb-8 h-96 md:h-[500px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={wish.revealPhoto}
              alt={wish.senderName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          {/* Sender Name */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-text-tertiary text-sm mb-2">From</p>
            <h1 className="font-display text-4xl md:text-5xl text-gradient">
              {wish.senderName}
            </h1>
          </motion.div>

          {/* Reveal Message with Typewriter */}
          <motion.div
            className="mb-8 p-6 glass-medium rounded-xl border border-glass-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <TypewriterText
              text={wish.revealMessage}
              speed={30}
              delay={800}
              className="text-lg md:text-xl text-text-secondary leading-relaxed italic"
            />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <Button onClick={() => router.push("/wish-jar")} size="lg" className="gap-2">
              <Heart className="w-4 h-4" />
              Next Wish
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

export default function WishRevealPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-5xl"
          >
            💌
          </motion.div>
        </div>
      }
    >
      <WishRevealContent />
    </Suspense>
  );
}
