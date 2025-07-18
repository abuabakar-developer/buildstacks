import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OverallProgressHalfCircleProps {
  progress: number; // 0-100
  size?: number; // px
}

const OverallProgressHalfCircle: React.FC<OverallProgressHalfCircleProps> = ({ progress, size = 180 }) => {
  // Clamp progress
  const pct = Math.max(0, Math.min(progress, 100));
  const radius = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = Math.PI * radius;
  // For half circle, only half the circumference
  const offset = circumference * (1 - pct / 100);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size / 1.8 }}>
      <svg
        width={size}
        height={size / 1.8}
        viewBox={`0 0 ${size} ${size / 1.8}`}
        className="block"
      >
        {/* Track */}
        <path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          fill="none"
          stroke="rgba(0,0,0,0.08)"
          strokeWidth={16}
          strokeLinecap="round"
        />
        {/* Progress */}
        <motion.path
          d={`M ${cx - radius},${cy} A ${radius},${radius} 0 0 1 ${cx + radius},${cy}`}
          fill="none"
          stroke="#111"
          strokeWidth={16}
          strokeLinecap="round"
          style={{
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.18))",
          }}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - pct / 100)}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />
      </svg>
      {/* Centered Percentage */}
      <div
        className="absolute left-0 right-0 mx-auto text-center"
        style={{ top: size / 3.2 }}
      >
        <motion.div
          key={pct}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-extrabold text-black drop-shadow-md font-plus-jakarta"
          style={{
            textShadow: "0 2px 8px rgba(0,0,0,0.12)",
            letterSpacing: "-0.02em",
          }}
        >
          {pct}%
        </motion.div>
        <div className="text-xs text-black/50 font-plus-jakarta mt-1">Overall Progress</div>
      </div>
    </div>
  );
};

export default OverallProgressHalfCircle; 

