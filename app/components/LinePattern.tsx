"use client";

import { motion } from "framer-motion";

const LinePattern = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Main grid pattern */}
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "50px 50px"
      }}></div>

      {/* Animated diagonal lines */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-[200%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"
            style={{
              top: `${i * 25}%`,
              left: "-50%",
              transform: "rotate(45deg)",
            }}
            animate={{
              x: ["0%", "100%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>

      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900/50"></div>
    </div>
  );
};

export default LinePattern; 