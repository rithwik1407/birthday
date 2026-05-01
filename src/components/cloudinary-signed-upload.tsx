"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface CloudinarySignedUploadProps {
  onUploadSuccess: (url: string, thumbnail: string) => void;
  onUploadError?: (error: string) => void;
}

export function CloudinarySignedUpload({
  onUploadSuccess,
  onUploadError,
}: CloudinarySignedUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a video
    if (!file.type.startsWith("video/")) {
      setUploadStatus({
        type: "error",
        message: "❌ Please select a video file",
      });
      onUploadError?.("Please select a video file");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus({ type: null, message: "" });

    try {
      // Step 1: Get signature from backend
      const signatureResponse = await fetch("/api/cloudinary-signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: Math.floor(Date.now() / 1000),
        }),
      });

      if (!signatureResponse.ok) {
        throw new Error("Failed to get upload signature");
      }

      const { signature, timestamp } = await signatureResponse.json();

      // Step 2: Upload to Cloudinary with signature
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("api_key", process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY || "");

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          const videoUrl = response.secure_url;
          const thumbnail = response.thumbnail_url || response.secure_url;

          setUploadProgress(100);
          setUploadStatus({
            type: "success",
            message: "✅ Video uploaded successfully!",
          });

          onUploadSuccess(videoUrl, thumbnail);

          setTimeout(() => {
            setUploadStatus({ type: null, message: "" });
            setIsUploading(false);
          }, 3000);
        } else {
          throw new Error("Upload failed");
        }
      });

      xhr.addEventListener("error", () => {
        throw new Error("Upload failed");
      });

      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`;
      xhr.open("POST", cloudinaryUrl);
      xhr.send(formData);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Upload failed";
      setUploadStatus({
        type: "error",
        message: `❌ ${errorMessage}`,
      });
      onUploadError?.(errorMessage);
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id="signed-video-upload"
        />
        <Button
          type="button"
          onClick={() => document.getElementById("signed-video-upload")?.click()}
          disabled={isUploading}
          className="w-full gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? `Uploading... ${uploadProgress}%` : "☁️ Upload Video (Signed)"}
        </Button>
      </div>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <motion.div
          className="w-full bg-gray-700 rounded-full h-2 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-rose-1 to-purple-1"
            initial={{ width: 0 }}
            animate={{ width: `${uploadProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>
      )}

      {uploadStatus.type && (
        <motion.div
          className={`rounded-lg p-3 text-center text-sm font-medium ${
            uploadStatus.type === "success"
              ? "bg-green-500/20 border border-green-500 text-green-600"
              : "bg-red-500/20 border border-red-500 text-red-600"
          }`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
        >
          {uploadStatus.message}
        </motion.div>
      )}

      <p className="text-xs text-ink-2 text-center">
        Supported formats: MP4, WebM, OGG, MOV, AVI, MKV
        <br />
        Max file size: 300MB+ (Signed upload)
      </p>
    </div>
  );
}
