import { motion } from 'framer-motion';
import AnimatedBackground from './AnimatedBackground';

interface HeroProps {
  onScrollToProjects: () => void;
}

export default function Hero({ onScrollToProjects }: HeroProps) {
  return (
    <section className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center overflow-hidden pt-20 sm:pt-0">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6 sm:mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-stellar-teal opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-stellar-teal"></span>
            </span>
            <span className="text-xs sm:text-sm font-medium text-text-dark dark:text-text-star">
              Live on Stellar Testnet
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
          >
            <span className="text-gradient">Empower Dreams</span>
            <br />
            <span className="text-text-dark dark:text-text-star">One Micro-Investment at a Time</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-base sm:text-lg md:text-xl text-text-dark-muted dark:text-text-muted mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Invest as little as <span className="text-stellar-teal font-semibold">$1</span> to support 
            micro-entrepreneurs worldwide. Every investment is secured on the 
            <span className="text-stellar-purple font-semibold"> Stellar blockchain</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              onClick={onScrollToProjects}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 50px rgba(33, 212, 253, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Explore Projects
                <svg className="w-5 h-5 motion-safe:group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-stellar-purple to-stellar-blue opacity-0 group-hover:opacity-100 transition-opacity"
                initial={false}
              />
            </motion.button>

            <motion.a
              href="https://stellar.org"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary w-full sm:w-auto text-base sm:text-lg px-8 sm:px-10 py-3 sm:py-4"
            >
              Learn More
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="grid grid-cols-3 gap-4 sm:gap-8 mt-12 sm:mt-16 max-w-3xl mx-auto"
          >
            {[
              { label: 'Active Projects', value: '1' },
              { label: 'Total Raised', value: '$0' },
              { label: 'Investors', value: '0+' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.1, duration: 0.4 }}
                className="glass-card p-4 sm:p-6 rounded-xl"
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gradient mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-text-dark-muted dark:text-text-muted">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 cursor-pointer"
          onClick={onScrollToProjects}
        >
          <span className="text-xs text-text-dark-muted dark:text-text-muted">Scroll to explore</span>
          <svg className="w-6 h-6 text-stellar-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}