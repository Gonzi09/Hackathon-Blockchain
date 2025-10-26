import { useState } from 'react';
import { motion } from 'framer-motion';
import { verifyMilestone } from '../utils/stellar';
import projectsData from '../data/projects.json';
import evidenceData from '../data/evidence.json';
import Toast from '../components/Toast';

interface VerifierProps {
  walletAddress: string | null;
  onConnect: () => void;
}

export default function Verifier({ walletAddress, onConnect }: VerifierProps) {
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  });
  const [processingMilestone, setProcessingMilestone] = useState<string | null>(null);

  const pendingEvidence = evidenceData.filter(e => e.status === 'pending');

  const handleVerify = async (projectId: number, milestoneIndex: number, approved: boolean) => {
    if (!walletAddress) {
      onConnect();
      return;
    }

    const key = `${projectId}-${milestoneIndex}`;
    setProcessingMilestone(key);

    try {
      const result = await verifyMilestone(walletAddress, projectId, milestoneIndex, approved);
      
      showToast(
        approved 
          ? `Milestone approved! TX: ${result.hash}`
          : `Milestone rejected! TX: ${result.hash}`,
        approved ? 'success' : 'info'
      );
    } catch (error: any) {
      showToast(`Verification failed: ${error.message}`, 'error');
    } finally {
      setProcessingMilestone(null);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const closeToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  if (!walletAddress) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-12 rounded-2xl"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-stellar-purple to-stellar-blue flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-dark dark:text-text-star mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-text-dark-muted dark:text-text-muted mb-6">
            Connect your wallet to verify milestones
          </p>
          <button onClick={onConnect} className="btn-primary">
            Connect Wallet
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-text-dark dark:text-text-star mb-2">
            Verifier <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="text-text-dark-muted dark:text-text-muted">
            Review and approve milestone completions
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-xl"
          >
            <p className="text-sm text-text-dark-muted dark:text-text-muted mb-2">Pending Reviews</p>
            <p className="text-3xl font-bold text-gradient">{pendingEvidence.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-xl"
          >
            <p className="text-sm text-text-dark-muted dark:text-text-muted mb-2">Total Projects</p>
            <p className="text-3xl font-bold text-gradient">{projectsData.length}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-xl"
          >
            <p className="text-sm text-text-dark-muted dark:text-text-muted mb-2">Verified Today</p>
            <p className="text-3xl font-bold text-gradient">0</p>
          </motion.div>
        </div>

        {/* Pending Evidence List */}
        <div>
          <h2 className="text-2xl font-bold text-text-dark dark:text-text-star mb-6">
            Pending Milestone Evidence
          </h2>

          {pendingEvidence.length === 0 ? (
            <div className="glass-card p-12 rounded-2xl text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-text-dark-muted dark:text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-text-dark-muted dark:text-text-muted">
                No pending evidence to review
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingEvidence.map((evidence, index) => {
                const project = projectsData.find(p => p.id === evidence.projectId);
                const milestone = project?.milestones[evidence.milestoneIndex];
                const isProcessing = processingMilestone === `${evidence.projectId}-${evidence.milestoneIndex}`;

                return (
                  <motion.div
                    key={`${evidence.projectId}-${evidence.milestoneIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="glass-card rounded-2xl p-6 hover:shadow-orbit transition-all"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Project Info */}
                      <div className="lg:col-span-2">
                        <div className="flex items-start gap-4 mb-4">
                          <img
                            src={project?.imageUrl}
                            alt={project?.title}
                            className="w-20 h-20 rounded-xl object-cover"
                          />
                          <div>
                            <h3 className="text-lg font-bold text-text-dark dark:text-text-star mb-1">
                              {project?.title}
                            </h3>
                            <p className="text-sm text-text-dark-muted dark:text-text-muted mb-2">
                              Milestone {evidence.milestoneIndex + 1}: {milestone?.title}
                            </p>
                            <p className="text-xs text-text-dark-muted dark:text-text-muted">
                              Amount: ${milestone?.amount}
                            </p>
                          </div>
                        </div>

                        {/* Evidence Details */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <svg className="w-4 h-4 text-stellar-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-text-dark dark:text-text-star">{evidence.fileName}</span>
                          </div>
                          <div className="flex items-start gap-2 text-xs">
                            <svg className="w-4 h-4 text-stellar-purple mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <code className="text-text-dark-muted dark:text-text-muted font-mono break-all">
                              {evidence.hash}
                            </code>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-text-dark-muted dark:text-text-muted">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Submitted: {new Date(evidence.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-3">
                        <a
                          href={evidence.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary text-sm text-center"
                        >
                          View Evidence
                        </a>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleVerify(evidence.projectId, evidence.milestoneIndex, true)}
                          disabled={isProcessing}
                          className="btn-primary text-sm bg-green-500 hover:bg-green-600"
                        >
                          {isProcessing ? 'Processing...' : '✓ Approve'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleVerify(evidence.projectId, evidence.milestoneIndex, false)}
                          disabled={isProcessing}
                          className="btn-secondary text-sm border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          {isProcessing ? 'Processing...' : '✗ Reject'}
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </div>
  );
}