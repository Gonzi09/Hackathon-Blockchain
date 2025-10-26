import { motion } from 'framer-motion';

export default function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 50%, rgba(127, 141, 255, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(33, 212, 253, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 20%, rgba(183, 33, 255, 0.2) 0%, transparent 50%)
          `,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.2, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Floating orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: `${200 + i * 100}px`,
            height: `${200 + i * 100}px`,
            left: `${20 + i * 30}%`,
            top: `${10 + i * 25}%`,
            background: i === 0 
              ? 'rgba(127, 141, 255, 0.1)' 
              : i === 1 
              ? 'rgba(33, 212, 253, 0.1)' 
              : 'rgba(183, 33, 255, 0.1)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, i % 2 === 0 ? 20 : -20, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
}