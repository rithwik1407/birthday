"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

interface DriveUploadProps {
  onUploadSuccess: (url: string, thumbnail: string) => void;
  onUploadError?: (error: string) => void;
}

export function DriveUpload({
  onUploadSuccess,
  onUploadError,
}: DriveUploadProps) {
  const [uploadStatus, setUploadStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });
  const [driveLink, setDriveLink] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const extractDriveFileId = (url: string): string | null => {
    // Handle different Google Drive URL formats
    const patterns = [
      /\/d\/([a-zA-Z0-9-_]+)/,
      /id=([a-zA-Z0-9-_]+)/,
      /^([a-zA-Z0-9-_]+)$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }
    return null;
  };

  const handleAddDriveLink = async () => {
    if (!driveLink.trim()) {
      setUploadStatus({
        type: "error",
        message: "❌ Please enter a Google Drive link",
      });
      return;
    }

    setIsProcessing(true);

    try {
      const fileId = extractDriveFileId(driveLink.trim());

      if (!fileId) {
        setUploadStatus({
          type: "error",
          message: "❌ Invalid Google Drive link format",
        });
        setIsProcessing(false);
        return;
      }

      // Use the webViewLink format which works better with video players
      // Add export parameter to get direct streaming access
      const videoUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;
      const thumbnail = `https://drive.google.com/thumbnail?id=${fileId}&sz=w320`;

      console.log("Drive Video URL:", videoUrl);
      console.log("Drive Thumbnail:", thumbnail);

      setUploadStatus({
        type: "success",
        message: "✅ Google Drive link added successfully!",
      });

      onUploadSuccess(videoUrl, thumbnail);
      setDriveLink("");

      // Clear status after 3 seconds
      setTimeout(() => {
        setUploadStatus({ type: null, message: "" });
      }, 3000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process link";
      setUploadStatus({
        type: "error",
        message: `❌ ${errorMessage}`,
      });
      onUploadError?.(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <label className="block text-sm font-medium text-text-primary">
          Google Drive Video Link
        </label>
        <input
          type="text"
          value={driveLink}
          onChange={(e) => setDriveLink(e.target.value)}
          placeholder="Paste Google Drive link or file ID"
          className="w-full px-4 py-3 rounded-lg glass-medium text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-rose-1"
          disabled={isProcessing}
        />

        <Button
          type="button"
          onClick={handleAddDriveLink}
          disabled={isProcessing || !driveLink.trim()}
          className="w-full gap-2"
        >
          <Upload className="w-4 h-4" />
          {isProcessing ? "Processing..." : "Add Google Drive Video"}
        </Button>

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

      <div className="border-t border-white/20 pt-4">
        <p className="text-xs text-ink-2 mb-2">
          <strong>How to get Google Drive link:</strong>
        </p>
        <ol className="text-xs text-ink-2 space-y-1 list-decimal list-inside">
          <li>Upload video to Google Drive</li>
          <li>Right-click → Share</li>
          <li>Change to "Anyone with link"</li>
          <li>Copy the link or file ID</li>
          <li>Paste here</li>
        </ol>
      </div>
    </div>
  );
}
