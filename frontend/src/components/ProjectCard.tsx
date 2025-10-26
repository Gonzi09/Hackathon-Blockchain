import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { getTotalInvested, getInvestorAmount } from '../utils/stellar';
import { SAMPLE_PROJECT } from '../config/constants';

interface ProjectCardProps {
  project: any;
  walletAddress: string | null;
  onInvest: () => void;
  onViewMilestones?: () => void;
  index: number;
}

export default function ProjectCard({ walletAddress, onInvest, index }: ProjectCardProps) {
  const [totalRaised, setTotalRaised] = useState(0);
  const [userContribution, setUserContribution] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjectData();
  }, [walletAddress]);

  const loadProjectData = async () => {
    setLoading(true);
    try {
      const total = await getTotalInvested();
      setTotalRaised(total);

      if (walletAddress) {
        const contribution = await getInvestorAmount(walletAddress);
        setUserContribution(contribution);
      }
    } catch (error) {
      console.error('Error loading project data:', error);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = Math.min((totalRaised / SAMPLE_PROJECT.goal) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
      className="group"
    >
      <div className="glass-card rounded-2xl overflow-hidden shadow-card dark:shadow-card-dark
        hover:shadow-orbit-lg dark:hover:shadow-orbit-lg
        border border-transparent hover:border-stellar-teal/40
        transition-all duration-300">
        
        {/* Image */}
        <div className="relative h-48 sm:h-64 overflow-hidden">
          <motion.img
            src={SAMPLE_PROJECT.imageUrl}
            alt={SAMPLE_PROJECT.title}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="absolute top-4 left-4"
          >
            <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-semibold
              bg-stellar-purple/90 text-white backdrop-blur-sm">
              {SAMPLE_PROJECT.category}
            </span>
          </motion.div>

          {/* User Contribution Badge */}
          {userContribution > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs sm:text-sm font-semibold
                bg-green-500/90 text-white backdrop-blur-sm flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Invested
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Title */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="text-xl sm:text-2xl font-bold text-text-dark dark:text-text-star mb-2
              group-hover:text-stellar-blue transition-colors"
          >
            {SAMPLE_PROJECT.title}
          </motion.h3>

          {/* Entrepreneur */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="text-sm text-text-dark-muted dark:text-text-muted mb-1"
          >
            by <span className="font-semibold">{SAMPLE_PROJECT.entrepreneur}</span>
          </motion.p>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center gap-1 text-sm text-text-dark-muted dark:text-text-muted mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {SAMPLE_PROJECT.location}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
            className="text-sm sm:text-base text-text-dark-muted dark:text-text-muted mb-6 line-clamp-2"
          >
            {SAMPLE_PROJECT.description}
          </motion.p>

          {/* Progress Section */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="mb-6"
          >
            {/* Progress Bar */}
            <div className="relative h-2 sm:h-3 bg-gray-200 dark:bg-bg-deep rounded-full overflow-hidden mb-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ delay: 0.8 + index * 0.1, duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-stellar-blue via-stellar-teal to-stellar-purple rounded-full
                  relative overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0 bg-white/30"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            </div>

            {/* Progress Text */}
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-xl sm:text-2xl font-bold text-gradient">
                  ${loading ? '...' : totalRaised.toFixed(2)}
                </span>
                <span className="text-sm text-text-dark-muted dark:text-text-muted ml-1">
                  raised
                </span>
              </div>
              <span className="text-sm text-text-dark-muted dark:text-text-muted">
                of ${SAMPLE_PROJECT.goal.toLocaleString()} goal
              </span>
            </div>

            {/* User Contribution */}
            {userContribution > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30"
              >
                <p className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                  Your contribution: <strong>${userContribution.toFixed(2)}</strong>
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1 }}
            onClick={onInvest}
            disabled={!walletAddress}
            whileHover={{ scale: walletAddress ? 1.02 : 1 }}
            whileTap={{ scale: walletAddress ? 0.98 : 1 }}
            className="w-full btn-primary text-base sm:text-lg py-3 sm:py-4 relative overflow-hidden group/btn"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {walletAddress ? (
                <>
                  Invest Now
                  <svg className="w-5 h-5 motion-safe:group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              ) : (
                'Connect Wallet to Invest'
              )}
            </span>
            {walletAddress && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-stellar-purple to-stellar-blue opacity-0 group-hover/btn:opacity-100 transition-opacity"
                initial={false}
              />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}