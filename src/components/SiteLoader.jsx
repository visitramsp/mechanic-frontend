import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import BrandLogo from "./BrandLogo";

const loadingMessages = [
  "Preparing the workshop",
  "Checking service availability",
  "Opening the Mechanic",
];

export default function SiteLoader() {
  const [progress, setProgress] = useState(6);
  const message = useMemo(() => {
    if (progress < 38) return loadingMessages[0];
    if (progress < 78) return loadingMessages[1];
    return loadingMessages[2];
  }, [progress]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 96) return current;
        const next = current + Math.max(1, Math.round((100 - current) / 8));
        return Math.min(next, 96);
      });
    }, 95);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="pw-site-loader"
      role="status"
      aria-live="polite"
      aria-label="the Mechanic is loading"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } }}
    >
      <div className="pw-site-loader__grid" aria-hidden="true" />
      <motion.div
        className="pw-site-loader__glow pw-site-loader__glow--one"
        animate={{ x: [0, 36, 0], y: [0, -24, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />
      <motion.div
        className="pw-site-loader__glow pw-site-loader__glow--two"
        animate={{ x: [0, -30, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      />

      <div className="pw-site-loader__content">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="pw-site-loader__brand"
        >
          <BrandLogo light />
        </motion.div>

        <div className="pw-site-loader__meta">
          <span>{message}</span>
          <strong>{progress}%</strong>
        </div>
        <div className="pw-site-loader__track" aria-hidden="true">
          <motion.span
            initial={{ width: "5%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.18, ease: "easeOut" }}
          />
        </div>
        <p>Bike repair · Care · Performance</p>
      </div>
    </motion.div>
  );
}
