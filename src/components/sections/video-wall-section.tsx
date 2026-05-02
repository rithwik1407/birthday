"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { sampleVideos } from "@/lib/sample-data";
import { Lock, Play, Check } from "lucide-react";

interface Video {
  _id: string;
  title: string;
  url: string;
  thumbnail?: string;
  isSpecial?: boolean;
  recordedBy?: string;
  hint?: string;
  guessedBy?: string;
}

export function VideoWallSection() {
  const [videos, setVideos] = useState<Video[]>(sampleVideos);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [guesses, setGuesses] = useState<Record<string, string>>({});
  const [guessResult, setGuessResult] = useState<{
    videoId: string;
    correct: boolean;
    message: string;
  } | null>(null);
  const [showGuessInput, setShowGuessInput] = useState<string | null>(null);
  const [guessInput, setGuessInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch("/api/videos", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Fetched videos:", data);
          // Use whatever the API returns (empty array or videos)
          // Don't fall back to sample data if array is empty
          const videoList = Array.isArray(data) ? data : sampleVideos;
          setVideos(videoList);
          
          // Restore watched videos from guessedBy field
          const watched = new Set<string>();
          const guessesMap: Record<string, string> = {};
          videoList.forEach((video: Video) => {
            if (video.guessedBy) {
              watched.add(video._id);
              guessesMap[video._id] = video.guessedBy;
            }
          });
          setWatchedVideos(watched);
          setGuesses(guessesMap);
        } else {
          console.error("API response not ok:", response.status);
          setVideos(sampleVideos);
        }
      } catch (error) {
        console.error("Error fetching videos:", error);
        setVideos(sampleVideos);
      }
    };

    fetchVideos();
  }, []);

  const canWatchSpecial = watchedVideos.size === videos.length - 1;
  const progress = Math.round((watchedVideos.size / videos.length) * 100);

  const handleGuessSubmit = async (videoId: string) => {
    const video = videos.find((v) => v._id === videoId);
    if (!video || isSubmitting) return;

    setIsSubmitting(true);

    const isCorrect =
      guessInput.toLowerCase().trim() ===
      (video.recordedBy || video.title).toLowerCase().trim();

    if (isCorrect) {
      // Update MongoDB with the guess
      try {
        const response = await fetch(`/api/videos/${videoId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ guessedBy: guessInput }),
        });

        if (response.ok) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
          
          setGuesses({ ...guesses, [videoId]: guessInput });
          setGuessResult({
            videoId,
            correct: true,
            message: "You know them so well! ❤️",
          });
          setWatchedVideos((prev) => new Set([...prev, videoId]));

          // Close dialog after showing success
          setTimeout(() => {
            setShowGuessInput(null);
            setGuessInput("");
            setGuessResult(null);
          }, 1500);
        }
      } catch (error) {
        console.error("Error updating video:", error);
        setGuessResult({
          videoId,
          correct: false,
          message: "Error saving guess. Try again!",
        });
      }
    } else {
      setGuessResult({
        videoId,
        correct: false,
        message: "Not quite 😄 Try again!",
      });
      setTimeout(() => setGuessResult(null), 1500);
    }

    setGuessInput("");
    setIsSubmitting(false);
  };

  const handlePlayVideo = (video: Video) => {
    if (video.isSpecial && !canWatchSpecial) {
      alert("Watch all other videos first to unlock the special one!");
      return;
    }

    if (!guesses[video._id]) {
      setShowGuessInput(video._id);
    } else {
      setSelectedVideo(video);
    }
  };

  const handleRefreshVideos = async () => {
    if (!window.confirm("Reset all videos to locked state? You'll need to guess again.")) {
      return;
    }

    try {
      // Reset all videos by clearing guessedBy field
      for (const video of videos) {
        if (guesses[video._id]) {
          await fetch(`/api/videos/${video._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ guessedBy: null }),
          });
        }
      }

      // Clear local state
      setWatchedVideos(new Set());
      setGuesses({});
      setGuessResult(null);
      setShowGuessInput(null);
      setGuessInput("");
    } catch (error) {
      console.error("Error refreshing videos:", error);
      alert("Error refreshing videos. Try again!");
    }
  };

  return (
    <div className="space-y-8">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display text-5xl md:text-6xl text-gradient mb-4">
          Video Wall
        </h1>
        <p className="text-lg text-ink-2">
          Guess who recorded each message 🎬
        </p>
      </motion.div>

      {/* Progress */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex justify-between items-center">
          <p className="text-ink-2 font-medium">
            {watchedVideos.size} / {videos.length} memories unlocked 💖
          </p>
          <div className="flex gap-2 items-center">
            <p className="text-rose-1 font-bold text-lg">{progress}%</p>
            {watchedVideos.size > 0 && (
              <motion.button
                onClick={handleRefreshVideos}
                className="px-3 py-1 rounded-full text-sm font-medium glass-strong hover:glass-strong transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Reset all videos to locked state"
              >
                🔄 Refresh
              </motion.button>
            )}
          </div>
        </div>

        <motion.div
          className="glass-strong rounded-full p-1 backdrop-blur-md overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-3 bg-gradient-to-r from-rose-1 to-rose-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </motion.div>
      </motion.div>

      {/* Videos Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        {videos.map((video) => {
          const isGuessed = !!guesses[video._id];

          return (
            <motion.button
              key={video._id}
              onClick={() => handlePlayVideo(video)}
              className="group relative overflow-hidden rounded-2xl shadow-romance hover:shadow-deep transition-all"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Thumbnail */}
              <div className="relative w-full aspect-video bg-gradient-to-br from-rose-1 to-rose-2 overflow-hidden">
                {/* Blurred/Locked State */}
                {!isGuessed ? (
                  <>
                    {video.thumbnail ? (
                      <div className="absolute inset-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover blur-md"
                        />
                        <div className="absolute inset-0 bg-black/40" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-rose-1/80 to-rose-2/80" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-br from-rose-1/80 to-rose-2/80 backdrop-blur-lg flex items-center justify-center">
                      <motion.div
                        className="text-center"
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Lock className="w-12 h-12 text-white mx-auto mb-3" />
                        <p className="text-white font-display text-sm">
                          Guess who?
                        </p>
                      </motion.div>
                    </div>

                    {/* Hint */}
                    <div className="absolute inset-0 flex items-end p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <p className="text-white text-sm italic">
                        {video.hint || "💭 Someone special"}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {video.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-rose-1 to-rose-2" />
                    )}

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all flex items-center justify-center">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Play className="w-12 h-12 text-white fill-white" />
                      </motion.div>
                    </div>

                    {/* Watched Badge */}
                    <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Watched
                    </div>
                  </>
                )}

                {/* Special Badge */}
                {video.isSpecial && (
                  <div className="absolute top-2 left-2 bg-amber-400 text-white px-3 py-1 rounded-full text-xs font-medium">
                    ✨ Special
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="glass-strong p-4 backdrop-blur-md">
                <p className="font-medium text-ink-1">
                  {isGuessed ? video.title : "Mystery Message"}
                </p>
                {isGuessed && (
                  <p className="text-xs text-rose-1 mt-1">
                    From: {guesses[video._id]}
                  </p>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* Guess Input Dialog */}
      <Dialog
        open={!!showGuessInput}
        onOpenChange={() => {
          if (!isSubmitting) {
            setShowGuessInput(null);
            setGuessInput("");
            setGuessResult(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Who recorded this?</DialogTitle>
          </DialogHeader>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Hint */}
            <div className="glass-strong rounded-lg p-4 text-center backdrop-blur-md">
              <p className="text-sm text-ink-2">
                {showGuessInput && videos.find((v) => v._id === showGuessInput)?.hint
                  ? videos.find((v) => v._id === showGuessInput)?.hint
                  : "💭 Someone special"}
              </p>
            </div>

            {/* Guess Result */}
            <AnimatePresence>
              {guessResult && guessResult.videoId === showGuessInput && (
                <motion.div
                  className={`rounded-lg p-4 text-center ${
                    guessResult.correct
                      ? "bg-green-500/20 border border-green-500"
                      : "bg-red-500/20 border border-red-500"
                  }`}
                  initial={{ opacity: 0, scale: 0.9, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.p
                    className={`font-medium text-lg ${
                      guessResult.correct ? "text-green-600" : "text-red-600"
                    }`}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                  >
                    {guessResult.correct ? "✓ Correct!" : "✗ Wrong"} {guessResult.message}
                  </motion.p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input - Hidden when showing result */}
            <AnimatePresence>
              {!guessResult && (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <label className="block text-sm font-medium text-ink-1">
                    Enter their name
                  </label>
                  <input
                    type="text"
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && showGuessInput && !isSubmitting) {
                        handleGuessSubmit(showGuessInput);
                      }
                    }}
                    placeholder="Type name..."
                    className="w-full px-4 py-3 rounded-lg glass-strong text-ink-1 placeholder-ink-2 focus:outline-none focus:ring-2 focus:ring-rose-1 backdrop-blur-md"
                    autoFocus
                    disabled={isSubmitting}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Buttons - Hidden when showing result */}
            <AnimatePresence>
              {!guessResult && (
                <motion.div
                  className="flex gap-2"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    onClick={() => {
                      setShowGuessInput(null);
                      setGuessInput("");
                      setGuessResult(null);
                    }}
                    variant="ghost"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={() => {
                      if (showGuessInput) {
                        handleGuessSubmit(showGuessInput);
                      }
                    }}
                    className="flex-1"
                    disabled={!guessInput.trim() || isSubmitting}
                  >
                    {isSubmitting ? "Checking..." : "Guess"}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Video Player Modal */}
      <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
        <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto p-4">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedVideo?.title}</DialogTitle>
          </DialogHeader>

          <motion.div
            className="w-full bg-black rounded-lg overflow-hidden flex items-center justify-center relative"
            style={{ aspectRatio: "16/9" }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {selectedVideo?.url ? (
              selectedVideo.url.includes("drive.google.com") ? (
                // Google Drive video - use iframe
                <iframe
                  src={selectedVideo.url.replace("/preview", "/preview")}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="autoplay"
                  allowFullScreen
                />
              ) : (
                // Cloudinary or other video - use video tag
                <>
                  <video
                    key={selectedVideo._id}
                    src={selectedVideo.url}
                    controls
                    autoPlay
                    controlsList="nodownload"
                    crossOrigin="anonymous"
                    preload="metadata"
                    playsInline
                    className="w-full h-full"
                    onLoadStart={() => {
                      // Show loading indicator
                    }}
                    onCanPlay={() => {
                      // Hide loading indicator
                    }}
                  />
                  {/* Loading Indicator */}
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center bg-black/50 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                    transition={{ delay: 2 }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-rose-1/30 border-t-rose-1 rounded-full"
                    />
                  </motion.div>
                </>
              )
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-1 to-rose-2">
                <p className="text-white text-lg">Video not available</p>
              </div>
            )}
          </motion.div>

          {selectedVideo?.isSpecial && (
            <motion.div
              className="glass-strong rounded-lg p-4 text-center backdrop-blur-md"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p className="text-sm text-rose-1 font-medium">
                ✨ This is a special message ✨
              </p>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
