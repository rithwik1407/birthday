"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string, thumbnail: string) => void;
  onUploadError?: (error: string) => void;
}

export function CloudinaryUpload({
  onUploadSuccess,
  onUploadError,
}: CloudinaryUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccess = (result: any) => {
    // Cloudinary returns the result in result.info
    const info = result.info;
    const videoUrl = info?.secure_url;
    const thumbnail = info?.thumbnail_url || info?.secure_url;

    if (videoUrl) {
      setUploadStatus({
        type: "success",
        message: "✅ Video uploaded successfully!",
      });
      onUploadSuccess(videoUrl, thumbnail || "");

      // Clear status after 3 seconds
      setTimeout(() => {
        setUploadStatus({ type: null, message: "" });
        setIsUploading(false);
      }, 3000);
    } else {
      setUploadStatus({
        type: "error",
        message: "❌ No video URL returned",
      });
      onUploadError?.("No video URL returned");
      setIsUploading(false);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    const errorMessage = error?.message || "Upload failed";
    
    // Check if it's a file size error
    if (errorMessage.includes("exceeds maximum allowed")) {
      setUploadStatus({
        type: "error",
        message: `❌ File too large for widget. Use Local Device option instead.`,
      });
    } else {
      setUploadStatus({
        type: "error",
        message: `❌ ${errorMessage}`,
      });
    }
    
    onUploadError?.(errorMessage);
    setIsUploading(false);

    // Clear status after 5 seconds
    setTimeout(() => {
      setUploadStatus({ type: null, message: "" });
    }, 5000);
  };

  return (
    <div className="space-y-4">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleSuccess}
        onError={handleError}
        onOpen={() => {
          setIsUploading(true);
          setUploadProgress(0);
        }}
        options={{
          maxFiles: 1,
          resourceType: "video",
          sources: ["local", "url", "camera", "google_drive"],
          clientAllowedFormats: ["mp4", "webm", "ogg", "mov", "avi", "mkv"],
          maxFileSize: 314572800, // 300MB in bytes (client-side hint)
        }}
      >
        {({ open }) => (
          <div className="space-y-3">
            <Button
              type="button"
              onClick={() => {
                open();
              }}
              disabled={isUploading}
              className="w-full gap-2"
            >
              <Upload className="w-4 h-4" />
              ☁️ Upload Video
            </Button>

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
          </div>
        )}
      </CldUploadWidget>

      <p className="text-xs text-ink-2 text-center">
        Supported formats: MP4, WebM, OGG, MOV, AVI, MKV
        <br />
        Upload from: Device, URL, Camera, or Google Drive
        <br />
        <strong>Note:</strong> For files &gt; 100MB, use Local Device option
      </p>
    </div>
  );
}
