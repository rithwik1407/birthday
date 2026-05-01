"use client";

import { motion } from "framer-motion";
import QRCode from "react-qr-code";
import { generateQRValue } from "@/lib/utils";

interface QRCardProps {
  section: string;
  label: string;
  baseUrl?: string;
}

export function QRCard({ section, label, baseUrl = "" }: QRCardProps) {
  const qrValue = generateQRValue(baseUrl, section);

  return (
    <motion.div
      className="glass rounded-2xl p-6 flex flex-col items-center gap-4 shadow-romance"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <p className="text-sm font-medium text-ink-2">{label}</p>
      <div className="bg-white p-3 rounded-lg">
        <QRCode value={qrValue} size={120} level="H" />
      </div>
      <p className="text-xs text-ink-2 text-center">Scan to explore</p>
    </motion.div>
  );
}
