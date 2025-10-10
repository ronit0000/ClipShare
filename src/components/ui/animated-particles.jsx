import React from "react";
import { motion } from "framer-motion";

const AnimatedParticles = ({ className = "", particleCount = 30 }) => {
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    delay: Math.random() * 2,
    duration: 3 + Math.random() * 4,
    startX: Math.random() * 100,
    startY: Math.random() * 100,
    color: `hsl(${200 + Math.random() * 60}, 70%, 60%)`,
  }));

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 rounded-full opacity-40"
          style={{
            backgroundColor: particle.color,
            left: `${particle.startX}%`,
            top: `${particle.startY}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, -10, 0],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedParticles;