"use client";

import { motion } from "framer-motion";

const orbConfigs = [
  { className: "top-1/4 left-1/4 w-60 h-60 bg-blue-500/20", delay: 0 },
  { className: "bottom-1/3 right-1/4 w-72 h-72 bg-purple-500/20", delay: 1 },
  { className: "top-1/2 right-10 w-40 h-40 bg-pink-500/10", delay: 2 },
  { className: "bottom-10 left-1/3 w-32 h-32 bg-yellow-400/10", delay: 1.5 },
];

const LinePattern = () => {
  return (
    <div className="relative w-full h-full min-h-[300px] md:min-h-[500px] overflow-hidden select-none pointer-events-none">
      {/* High-res grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "32px 32px",
        }}
      ></div>

      {/* Animated diagonal lines with parallax */}
      <div className="absolute inset-0">
        {[...Array(7)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-[220%] h-[2px] ${i % 2 === 0 ? "bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" : "bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"}`}
            style={{
              top: `${10 + i * 12}%`,
              left: "-60%",
              transform: `rotate(${40 + i * 2}deg)`,
            }}
            animate={{
              x: ["0%", i % 2 === 0 ? "60%" : "40%", "0%"],
            }}
            transition={{
              duration: 10 + i,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "linear",
            }}
          />
        ))}
      </div>

      {/* Multiple glowing orbs with animation */}
      {orbConfigs.map((orb, idx) => (
        <motion.div
          key={idx}
          className={`absolute rounded-full blur-3xl ${orb.className}`}
          initial={{ opacity: 0.7, scale: 1 }}
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.1, 1] }}
          transition={{ duration: 6 + idx, repeat: Infinity, delay: orb.delay, ease: "easeInOut" }}
        />
      ))}

      {/* Animated gradient overlay for depth */}
      <motion.div
        className="absolute inset-0"
        initial={{ backgroundPosition: "0% 50%" }}
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        style={{
          background:
            "linear-gradient(120deg, rgba(30,58,138,0.25) 0%, rgba(168,85,247,0.18) 50%, rgba(30,58,138,0.25) 100%)",
          backgroundSize: "200% 200%",
        }}
      />

      {/* Subtle dark overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-transparent to-slate-900/60" />
    </div>
  );
};

export default LinePattern; 