"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CloudinaryUpload } from "@/components/cloudinary-upload";
import { LocalUpload } from "@/components/local-upload";
import { Upload } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"wishes" | "videos" | "game" | "game-images" | "settings">("wishes");
  const [uploadMethod, setUploadMethod] = useState<"cloudinary" | "local">("cloudinary");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Wish form
  const [wishForm, setWishForm] = useState({
    senderName: "",
    message: "",
    hint: "",
    revealPhoto: "",
    revealMessage: "",
    category: "friend",
  });

  // Video form
  const [videoForm, setVideoForm] = useState({
    title: "",
    url: "",
    thumbnail: "",
    recordedBy: "",
    hint: "",
  });

  // Game completion form
  const [gameForm, setGameForm] = useState({
    title: "",
    message: "",
    videoUrl: "",
    thumbnail: "",
  });

  // Game images form
  const [gameImages, setGameImages] = useState<string[]>(Array(8).fill(""));

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    backgroundImage: "",
    backgroundBlur: "8",
  });

  const handleAddWish = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wishForm),
      });

      if (response.ok) {
        setMessage("✅ Wish added successfully!");
        setWishForm({ senderName: "", message: "", hint: "", revealPhoto: "", revealMessage: "", category: "friend" });
      } else {
        setMessage("❌ Failed to add wish");
      }
    } catch (error) {
      setMessage("❌ Error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const adminToken = prompt("Enter admin token:");
      if (!adminToken) {
        setMessage("❌ Admin token required");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/videos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(videoForm),
      });

      if (response.ok) {
        setMessage("✅ Video added successfully!");
        setVideoForm({
          title: "",
          url: "",
          thumbnail: "",
          recordedBy: "",
          hint: "",
        });
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.error || "Failed to add video"}`);
      }
    } catch (error) {
      setMessage("❌ Error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleCloudinaryUpload = (videoUrl: string, thumbnail: string) => {
    setVideoForm({
      ...videoForm,
      url: videoUrl,
      thumbnail: thumbnail,
    });
    setMessage("✅ Video URL set! Now fill in other details and submit.");
  };

  const handleLocalVideoUpload = (videoUrl: string, thumbnail?: string) => {
    setVideoForm({
      ...videoForm,
      url: videoUrl,
      thumbnail: thumbnail || "",
    });
    setMessage("✅ Video uploaded! Now fill in other details and submit.");
  };

  const handleAddGameCompletion = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const adminToken = prompt("Enter admin token:");
      if (!adminToken) {
        setMessage("❌ Admin token required");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/game-completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(gameForm),
      });

      if (response.ok) {
        setMessage("✅ Game completion message added successfully!");
        setGameForm({
          title: "",
          message: "",
          videoUrl: "",
          thumbnail: "",
        });
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.error || "Failed to add game completion"}`);
      }
    } catch (error) {
      setMessage("❌ Error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleGameCompletionVideoUpload = (videoUrl: string, thumbnail?: string) => {
    setGameForm({
      ...gameForm,
      videoUrl: videoUrl,
      thumbnail: thumbnail || "",
    });
    setMessage("✅ Video uploaded! Now fill in title and message.");
  };

  const handleAddGameImages = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const adminToken = prompt("Enter admin token:");
      if (!adminToken) {
        setMessage("❌ Admin token required");
        setLoading(false);
        return;
      }

      if (gameImages.some((img) => !img)) {
        setMessage("❌ All 8 images are required");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/game-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ images: gameImages }),
      });

      if (response.ok) {
        setMessage("✅ All 8 game images added successfully!");
        setGameImages(Array(8).fill(""));
      } else {
        const error = await response.json();
        setMessage(`❌ ${error.error || "Failed to add game images"}`);
      }
    } catch (error) {
      setMessage("❌ Error: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-tertiary p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-display text-5xl md:text-6xl text-gradient mb-4">
            Admin Panel
          </h1>
          <p className="text-text-secondary">Manage wishes and videos</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap">
          <button
            onClick={() => setActiveTab("wishes")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "wishes"
                ? "glass-strong glow-rose"
                : "glass-medium hover:glass-strong"
            }`}
          >
            📝 Wishes
          </button>
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "videos"
                ? "glass-strong glow-rose"
                : "glass-medium hover:glass-strong"
            }`}
          >
            🎥 Videos
          </button>
          <button
            onClick={() => setActiveTab("game-images")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "game-images"
                ? "glass-strong glow-rose"
                : "glass-medium hover:glass-strong"
            }`}
          >
            🎮 Game Images
          </button>
          <button
            onClick={() => setActiveTab("game")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "game"
                ? "glass-strong glow-rose"
                : "glass-medium hover:glass-strong"
            }`}
          >
            🎬 Game Completion
          </button>
          <button
            onClick={() => setActiveTab("settings")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "settings"
                ? "glass-strong glow-rose"
                : "glass-medium hover:glass-strong"
            }`}
          >
            ⚙️ Settings
          </button>
        </div>

        {/* Message */}
        {message && (
          <motion.div
            className="glass-strong rounded-lg p-4 mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.div>
        )}

        {/* Wishes Form */}
        {activeTab === "wishes" && (
          <motion.form
            onSubmit={handleAddWish}
            className="glass-strong rounded-2xl p-8 backdrop-blur-lg space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Sender&apos;s Name
              </label>
              <input
                type="text"
                value={wishForm.senderName}
                onChange={(e) => setWishForm({ ...wishForm, senderName: e.target.value })}
                placeholder="e.g., Sarah, Mom, Best Friend"
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Message
              </label>
              <textarea
                value={wishForm.message}
                onChange={(e) => setWishForm({ ...wishForm, message: e.target.value })}
                placeholder="Write a heartfelt message..."
                rows={5}
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Hint (for guessing game)
              </label>
              <input
                type="text"
                value={wishForm.hint}
                onChange={(e) => setWishForm({ ...wishForm, hint: e.target.value })}
                placeholder="e.g., 💭 The one who always supports you"
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1"
              />
            </div>

            <div className="border-t border-white/20 pt-6">
              <p className="text-sm text-text-secondary mb-4 font-medium">
                📸 Reveal Section (shown after correct guess)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Reveal Photo URL
              </label>
              <input
                type="url"
                value={wishForm.revealPhoto}
                onChange={(e) => setWishForm({ ...wishForm, revealPhoto: e.target.value })}
                placeholder="https://example.com/reveal-photo.jpg"
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Reveal Message
              </label>
              <textarea
                value={wishForm.revealMessage}
                onChange={(e) => setWishForm({ ...wishForm, revealMessage: e.target.value })}
                placeholder="Write a special message to show with the photo..."
                rows={3}
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1 resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Category
              </label>
              <select
                value={wishForm.category}
                onChange={(e) => setWishForm({ ...wishForm, category: e.target.value })}
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-rose-1"
              >
                <option value="friend">Friend</option>
                <option value="family">Family</option>
                <option value="you">Personal</option>
              </select>
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? "Adding..." : "Add Wish"}
            </Button>
          </motion.form>
        )}

        {/* Videos Form */}
        {activeTab === "videos" && (
          <motion.form
            onSubmit={handleAddVideo}
            className="glass-strong rounded-2xl p-8 backdrop-blur-lg space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Upload Method Selection */}
            <div className="space-y-3">
              <div className="flex gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setUploadMethod("cloudinary")}
                  className={`flex-1 min-w-32 px-4 py-2 rounded-lg font-medium transition-all ${
                    uploadMethod === "cloudinary"
                      ? "glass-strong glow-rose"
                      : "glass-medium hover:glass-strong"
                  }`}
                >
                  ☁️ Cloudinary
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod("local")}
                  className={`flex-1 min-w-32 px-4 py-2 rounded-lg font-medium transition-all ${
                    uploadMethod === "local"
                      ? "glass-strong glow-rose"
                      : "glass-medium hover:glass-strong"
                  }`}
                >
                  💾 Local Device (Max 300MB)
                </button>
              </div>
              <p className="text-xs text-text-tertiary bg-black/30 rounded-lg p-2">
                💡 <strong>Tip:</strong> For files larger than 100MB, use "Local Device" option for reliable uploads
              </p>
            </div>

            {/* Upload Component */}
            <div>
              {uploadMethod === "cloudinary" ? (
                <CloudinaryUpload
                  onUploadSuccess={handleCloudinaryUpload}
                  onUploadError={(error) => setMessage(`❌ Upload error: ${error}`)}
                />
              ) : (
                <LocalUpload
                  onUploadSuccess={handleLocalVideoUpload}
                  onUploadError={(error) => setMessage(`❌ Upload error: ${error}`)}
                  acceptType="video/*"
                  label="📤 Upload Video (Max 300MB)"
                  uploadId="video-upload"
                />
              )}
            </div>

            <div className="border-t border-white/20 pt-6">
              <p className="text-sm text-text-secondary mb-4">
                Fill in video details:
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Video Title
              </label>
              <input
                type="text"
                value={videoForm.title}
                onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                placeholder="e.g., Sarah's Birthday Message"
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Video URL
              </label>
              <input
                type="url"
                value={videoForm.url}
                onChange={(e) => setVideoForm({ ...videoForm, url: e.target.value })}
                placeholder="Auto-filled from upload"
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Thumbnail URL
              </label>
              <input
                type="url"
                value={videoForm.thumbnail}
                onChange={(e) => setVideoForm({ ...videoForm, thumbnail: e.target.value })}
                placeholder="Auto-filled from upload"
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Recorded By (person&apos;s name)
              </label>
              <input
                type="text"
                value={videoForm.recordedBy}
                onChange={(e) => setVideoForm({ ...videoForm, recordedBy: e.target.value })}
                placeholder="e.g., Sarah"
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Hint for Guessing Game
              </label>
              <input
                type="text"
                value={videoForm.hint}
                onChange={(e) => setVideoForm({ ...videoForm, hint: e.target.value })}
                placeholder="e.g., 💭 The one who always supports you"
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1"
                required
              />
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? "Adding..." : "Add Video"}
            </Button>
          </motion.form>
        )}

        {/* Game Images Form */}
        {activeTab === "game-images" && (
          <motion.form
            onSubmit={handleAddGameImages}
            className="glass-strong rounded-2xl p-8 backdrop-blur-lg space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center mb-6">
              <p className="text-text-secondary mb-4">
                Upload 8 images for the memory match game cards
              </p>
              <p className="text-sm text-text-tertiary">
                Select all 8 images at once - they will be uploaded in order
              </p>
            </div>

            {/* Single Upload Button for All 8 Images */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                📤 Select 8 Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  if (files.length > 8) {
                    setMessage("❌ Please select maximum 8 images");
                    return;
                  }
                  if (files.length === 0) {
                    setMessage("❌ Please select at least 1 image");
                    return;
                  }
                  
                  // Upload all files
                  setLoading(true);
                  setMessage("");
                  
                  let uploadedCount = 0;
                  const newImages: string[] = [];
                  
                  files.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onload = async (event) => {
                      try {
                        const base64String = event.target?.result as string;
                        const formData = new FormData();
                        formData.append("file", base64String);
                        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

                        const response = await fetch(
                          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
                          {
                            method: "POST",
                            body: formData,
                          }
                        );

                        if (response.ok) {
                          const data = await response.json();
                          newImages[index] = data.secure_url;
                          uploadedCount++;
                          setMessage(`⏳ Uploading... ${uploadedCount}/${files.length}`);

                          if (uploadedCount === files.length) {
                            setGameImages(newImages);
                            setMessage(`✅ All ${files.length} images uploaded! Click "Add All Game Images" to save.`);
                            setLoading(false);
                          }
                        }
                      } catch (error) {
                        setMessage(`❌ Error uploading image ${index + 1}`);
                        setLoading(false);
                      }
                    };
                    reader.readAsDataURL(file);
                  });
                }}
                className="hidden"
                id="multi-image-upload"
              />
              <label htmlFor="multi-image-upload">
                <Button
                  type="button"
                  onClick={() => document.getElementById("multi-image-upload")?.click()}
                  disabled={loading}
                  className="w-full gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {loading ? "Uploading..." : "Select 8 Images"}
                </Button>
              </label>
            </div>

            {/* Preview Grid */}
            {gameImages.length > 0 && (
              <div className="space-y-4">
                <p className="text-sm text-text-secondary">
                  Preview ({gameImages.filter(img => img).length}/{gameImages.length} images)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {gameImages.map((imageUrl, index) => (
                    <div key={index} className="space-y-2">
                      <div className="relative rounded-lg overflow-hidden bg-black h-24">
                        {imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt={`Game image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-tertiary text-xs">
                            Pending...
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-text-secondary text-center">
                        Image {index + 1}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-white/20 pt-6">
              <p className="text-sm text-text-secondary mb-4">
                💡 Tip: Select all 8 images at once from your device. They will be uploaded automatically and displayed in order.
              </p>
            </div>

            <Button 
              type="submit" 
              disabled={loading || gameImages.filter(img => img).length === 0} 
              size="lg" 
              className="w-full"
            >
              {loading ? "Uploading..." : "Add All Game Images"}
            </Button>
          </motion.form>
        )}

        {/* Game Completion Form */}
        {activeTab === "game" && (
          <motion.form
            onSubmit={handleAddGameCompletion}
            className="glass-strong rounded-2xl p-8 backdrop-blur-lg space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                📤 Upload Completion Video
              </label>
              <div className="space-y-3">
                <CloudinaryUpload
                  onUploadSuccess={handleGameCompletionVideoUpload}
                  onUploadError={(error) => setMessage(`❌ Upload error: ${error}`)}
                />

                <p className="text-xs text-text-tertiary bg-black/30 rounded-lg p-2">
                  💡 <strong>For large files (100MB+):</strong> Use Local Device option below
                </p>

                <div className="border-t border-white/20 pt-3">
                  <p className="text-xs text-text-secondary mb-2">
                    <strong>📤 Or upload from Local Device (Max 300MB):</strong>
                  </p>
                  <LocalUpload
                    onUploadSuccess={handleGameCompletionVideoUpload}
                    onUploadError={(error) => setMessage(`❌ Upload error: ${error}`)}
                    acceptType="video/*"
                    label="📤 Upload Video from Device"
                    uploadId="game-completion-video-upload"
                  />
                </div>
              </div>
            </div>

            {/* Video Preview */}
            {gameForm.videoUrl && (
              <motion.div
                className="rounded-lg overflow-hidden bg-black"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <video
                  src={gameForm.videoUrl}
                  className="w-full h-auto max-h-64"
                  controls
                />
              </motion.div>
            )}

            <div className="border-t border-white/20 pt-6">
              <p className="text-sm text-text-secondary mb-4">
                Fill in completion details:
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Title
              </label>
              <input
                type="text"
                value={gameForm.title}
                onChange={(e) => setGameForm({ ...gameForm, title: e.target.value })}
                placeholder="e.g., You Did It!"
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Message
              </label>
              <textarea
                value={gameForm.message}
                onChange={(e) => setGameForm({ ...gameForm, message: e.target.value })}
                placeholder="Write a special message for completing the game..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1 resize-none"
                required
              />
            </div>

            <Button type="submit" disabled={loading} size="lg" className="w-full">
              {loading ? "Adding..." : "Add Game Completion"}
            </Button>
          </motion.form>
        )}

        {/* Info Box */}
        <motion.div
          className="glass-medium rounded-2xl p-6 mt-8 text-sm text-text-secondary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="mb-2">
            <strong>📝 Wishes:</strong> Public form - anyone can add wishes
          </p>
          <p className="mb-2">
            <strong>🎥 Videos:</strong> Requires admin token from .env file
          </p>
          <p className="mb-2">
            <strong>🎮 Game Images:</strong> Upload 8 images for memory match game cards
          </p>
          <p className="mb-2">
            <strong>🎬 Game Completion:</strong> Upload video shown after winning the game
          </p>
          <p className="mb-2">
            <strong>⚙️ Settings:</strong> Configure background image and other site settings
          </p>
          <p>
            <strong>📤 Upload:</strong> Choose Cloudinary or Google Drive
          </p>
        </motion.div>

        {/* Settings Form */}
        {activeTab === "settings" && (
          <motion.form
            className="glass-strong rounded-2xl p-8 backdrop-blur-lg space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="space-y-4">
              <label className="block text-sm font-medium text-text-primary mb-3">
                📤 Upload Background Image
              </label>
              <div className="flex gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setUploadMethod("local")}
                  className={`flex-1 min-w-32 px-4 py-2 rounded-lg font-medium transition-all ${
                    uploadMethod === "local"
                      ? "glass-strong glow-rose"
                      : "glass-medium hover:glass-strong"
                  }`}
                >
                  💾 Local Device
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod("cloudinary")}
                  className={`flex-1 min-w-32 px-4 py-2 rounded-lg font-medium transition-all ${
                    uploadMethod === "cloudinary"
                      ? "glass-strong glow-rose"
                      : "glass-medium hover:glass-strong"
                  }`}
                >
                  ☁️ Cloudinary
                </button>
              </div>
            </div>

            {uploadMethod === "local" && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">
                  Select Image from Device
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setLoading(true);
                      const reader = new FileReader();
                      reader.onload = async (event) => {
                        try {
                          const base64String = event.target?.result as string;
                          const formData = new FormData();
                          formData.append("file", base64String);
                          formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");

                          const response = await fetch(
                            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
                            {
                              method: "POST",
                              body: formData,
                            }
                          );

                          if (response.ok) {
                            const data = await response.json();
                            setSettingsForm({
                              ...settingsForm,
                              backgroundImage: data.secure_url,
                            });
                            setMessage("✅ Image uploaded successfully!");
                          } else {
                            setMessage("❌ Failed to upload image");
                          }
                        } catch (error) {
                          setMessage(`❌ Error uploading image: ${error}`);
                        } finally {
                          setLoading(false);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-rose-1"
                  disabled={loading}
                />
                <p className="text-xs text-text-tertiary mt-2">
                  💡 Select an image from your device. It will be uploaded to Cloudinary automatically.
                </p>
              </div>
            )}

            {uploadMethod === "cloudinary" && (
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Background Image URL
                </label>
                <input
                  type="url"
                  value={settingsForm.backgroundImage}
                  onChange={(e) => setSettingsForm({ ...settingsForm, backgroundImage: e.target.value })}
                  placeholder="https://example.com/background.jpg"
                  className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1"
                />
                <p className="text-xs text-text-tertiary mt-2">
                  💡 Paste your Cloudinary image URL here.
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Background Blur Amount (pixels)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={settingsForm.backgroundBlur}
                onChange={(e) => setSettingsForm({ ...settingsForm, backgroundBlur: e.target.value })}
                className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary focus:outline-none focus:ring-2 focus:ring-rose-1"
              />
              <p className="text-xs text-text-tertiary mt-2">
                💡 Higher values = more blur. Recommended: 8-12 pixels
              </p>
            </div>

            {settingsForm.backgroundImage && (
              <motion.div
                className="rounded-lg overflow-hidden h-48"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={settingsForm.backgroundImage}
                  alt="Background preview"
                  className="w-full h-full object-cover"
                  style={{ filter: `blur(${parseInt(settingsForm.backgroundBlur) || 8}px)` }}
                />
              </motion.div>
            )}

            <Button
              onClick={() => {
                if (!settingsForm.backgroundImage) {
                  setMessage("❌ Please upload or paste an image URL first");
                  return;
                }
                // Save to localStorage
                const settings = {
                  backgroundImage: settingsForm.backgroundImage,
                  backgroundBlur: parseInt(settingsForm.backgroundBlur) || 8,
                };
                localStorage.setItem("siteSettings", JSON.stringify(settings));
                setMessage("✅ Settings saved! Background updating...");
                
                // Dispatch custom event to trigger background update
                window.dispatchEvent(new Event("backgroundUpdated"));
              }}
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Uploading..." : "Save Settings"}
            </Button>

            <motion.div
              className="glass-medium rounded-lg p-4 text-sm text-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="mb-2">
                <strong>📸 How to use:</strong>
              </p>
              <p className="mb-2">
                1. Choose "Local Device" to upload from your computer, or "Cloudinary" to paste a URL
              </p>
              <p className="mb-2">
                2. If using Local Device, select an image file
              </p>
              <p className="mb-2">
                3. Adjust the blur amount to your preference (8-12 recommended)
              </p>
              <p>
                4. Click "Save Settings" to apply the background
              </p>
            </motion.div>
          </motion.form>
        )}
      </div>
    </div>
  );
}
