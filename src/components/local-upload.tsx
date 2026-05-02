"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface LocalUploadProps {
  onUploadSuccess: (url: string, thumbnail?: string) => void;
  onUploadError?: (error: string) => void;
  acceptType?: string;
  label?: string;
  uploadId?: string;
}

const MAX_FILE_SIZE = 300 * 1024 * 1024; // 300MB in bytes
const CHUNK_SIZE = 50 * 1024 * 1024; // 50MB chunks

export function LocalUpload({
  onUploadSuccess,
  onUploadError,
  acceptType = "image/*",
  label = "Upload File",
  uploadId = "local-upload-input",
}: LocalUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      const errorMessage = `File size (${fileSizeMB}MB) exceeds maximum allowed size (${maxSizeMB}MB)`;
      setUploadStatus({
        type: "error",
        message: `❌ ${errorMessage}`,
      });
      onUploadError?.(errorMessage);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus({ type: null, message: "" });

    try {
      // For files larger than 100MB, use chunked upload
      if (file.size > 100 * 1024 * 1024) {
        await uploadInChunks(file);
      } else {
        // For smaller files, use direct upload
        await uploadDirect(file);
      }
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

  const uploadDirect = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file); // Use binary data, not base64
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
      formData.append("resource_type", acceptType.includes("video") ? "video" : "image");

      const endpoint = acceptType.includes("video") ? "video/upload" : "image/upload";
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${endpoint}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        const data = await response.json();
        const fileUrl = data.secure_url;
        const thumbnail = data.thumbnail_url || data.secure_url;

        setUploadProgress(100);
        setUploadStatus({
          type: "success",
          message: "✅ File uploaded successfully!",
        });

        onUploadSuccess(fileUrl, thumbnail);

        setTimeout(() => {
          setUploadStatus({ type: null, message: "" });
          setIsUploading(false);
        }, 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Upload failed");
      }
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

  const uploadInChunks = async (file: File) => {
    try {
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      let uploadedSize = 0;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        try {
          const formData = new FormData();
          formData.append("file", chunk); // Use binary data, not base64
          formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "");
          formData.append("resource_type", acceptType.includes("video") ? "video" : "image");
          formData.append("chunk", `${i + 1}/${totalChunks}`);

          const endpoint = acceptType.includes("video") ? "video/upload" : "image/upload";
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/${endpoint}`,
            {
              method: "POST",
              body: formData,
            }
          );

          if (response.ok) {
            uploadedSize += chunk.size;
            const progress = Math.round((uploadedSize / file.size) * 100);
            setUploadProgress(progress);

            // If this is the last chunk, get the final result
            if (i === totalChunks - 1) {
              const data = await response.json();
              const fileUrl = data.secure_url;
              const thumbnail = data.thumbnail_url || data.secure_url;

              setUploadStatus({
                type: "success",
                message: "✅ File uploaded successfully!",
              });

              onUploadSuccess(fileUrl, thumbnail);

              setTimeout(() => {
                setUploadStatus({ type: null, message: "" });
                setIsUploading(false);
              }, 3000);
            }
          } else {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Chunk upload failed");
          }
        } catch (error) {
          throw error;
        }
      }
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
          accept={acceptType}
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
          id={uploadId}
        />
        <Button
          type="button"
          onClick={() => document.getElementById(uploadId)?.click()}
          disabled={isUploading}
          className="w-full gap-2"
        >
          <Upload className="w-4 h-4" />
          {isUploading ? `Uploading... ${uploadProgress}%` : label}
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
        {acceptType.includes("video")
          ? "Supported formats: MP4, WebM, OGG (Max 300MB)"
          : "Supported formats: JPG, PNG, WebP (Max 5MB)"}
      </p>
    </div>
  );
}
