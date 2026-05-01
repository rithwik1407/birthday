"use client";

import { useEffect, useRef, useState } from "react";

interface BackgroundImageProps {
  imageUrl?: string;
  blurAmount?: number;
}

export function BackgroundImage({
  imageUrl,
  blurAmount,
}: BackgroundImageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateBackground = () => {
      // Get settings from localStorage
      const savedSettings = localStorage.getItem("siteSettings");
      let bgImageUrl = imageUrl || "";
      let bgBlur = blurAmount || 8;

      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          bgImageUrl = parsed.backgroundImage || bgImageUrl;
          bgBlur = parseInt(parsed.backgroundBlur) || bgBlur;
        } catch (e) {
          console.error("Error parsing settings:", e);
        }
      }

      // Remove old background elements
      const oldBg = document.getElementById("site-background-image");
      const oldOverlay = document.getElementById("site-background-overlay");
      if (oldBg) oldBg.remove();
      if (oldOverlay) oldOverlay.remove();

      if (!bgImageUrl) return;

      // Create background image element
      const bgElement = document.createElement("div");
      bgElement.id = "site-background-image";
      bgElement.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('${bgImageUrl}');
        background-size: cover;
        background-position: center;
        background-attachment: fixed;
        filter: blur(${bgBlur}px);
        z-index: -2;
        opacity: 0.95;
        pointer-events: none;
      `;

      // Add dark overlay for better text readability
      const overlay = document.createElement("div");
      overlay.id = "site-background-overlay";
      overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.35);
        z-index: -1;
        pointer-events: none;
      `;

      document.body.appendChild(bgElement);
      document.body.appendChild(overlay);
    };

    // Initial update
    updateBackground();

    // Listen for storage changes
    const handleStorageChange = () => {
      updateBackground();
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom event from admin panel
    window.addEventListener("backgroundUpdated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("backgroundUpdated", handleStorageChange);
    };
  }, [mounted, imageUrl, blurAmount]);

  return null;
}
