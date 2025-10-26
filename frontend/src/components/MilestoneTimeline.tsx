import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface Milestone {
  title: string;
  amount: number;
  deadline: string;
  description: string;
}

interface MilestoneTimelineProps {
  projectId: number;
  milestones: Milestone[];
}

export default function MilestoneTimeline({ projectId, milestones }: MilestoneTimelineProps) {
  const [milestoneStatuses, setMilestoneStatuses] = useState<string[]>([]);

  useEffect(() => {
    // In real app, fetch from blockchain
    setMilestoneStatuses(milestones.map(() => 'pending'));
  }, [projectId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-500';
      case 'evidence_submitted': return 'text-yellow-500';
      case 'rejected': return 'text-red-500';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'evidence_submitted':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full border-2 border-current" />
        );
    }
  };

  return (
    <div className="relative">
      {milestones.map((milestone, index) => {
        const status = milestoneStatuses[index] || 'pending';
        const isLast = index === milestones.length - 1;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-6 pb-8"
          >
            {/* Timeline Line */}
            {!isLast && (
              <div className="absolute left-3 top-6 bottom-0 w-0.5 bg-gray-200 dark:bg-white/10" />
            )}

            {/* Status Icon */}
            <div className={`relative z-10 flex-shrink-0 ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="glass-card p-4 sm:p-6 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-text-dark dark:text-text-star mb-1">
                      {milestone.title}
                    </h4>
                    <p className="text-sm text-text-dark-muted dark:text-text-muted">
                      {milestone.description}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stellar-blue/20 text-stellar-blue">
                    ${milestone.amount}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-text-dark-muted dark:text-text-muted">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Deadline: {new Date(milestone.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 capitalize">
                    <span className={`w-2 h-2 rounded-full ${
                      status === 'verified' ? 'bg-green-500' :
                      status === 'evidence_submitted' ? 'bg-yellow-500' :
                      status === 'rejected' ? 'bg-red-500' :
                      'bg-gray-400'
                    }`} />
                    {status.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}