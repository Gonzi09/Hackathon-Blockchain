import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CreateProjectForm from '../components/CreateProjectForm';
import EvidenceUpload from '../components/EvidenceUpload';
import projectsData from '../data/projects.json';

interface EntrepreneurProps {
  walletAddress: string | null;
  onConnect: () => void;
}

export default function Entrepreneur({ walletAddress, onConnect }: EntrepreneurProps) {
  const [view, setView] = useState<'dashboard' | 'create'>('dashboard');
  const [myProjects] = useState(projectsData); // In real app, filter by wallet

  if (!walletAddress) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card p-12 rounded-2xl"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-stellar-teal to-stellar-purple flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-text-dark dark:text-text-star mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-text-dark-muted dark:text-text-muted mb-6">
            Connect your wallet to create projects and submit evidence
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
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-text-dark dark:text-text-star mb-2">
              Entrepreneur <span className="text-gradient">Dashboard</span>
            </h1>
            <p className="text-text-dark-muted dark:text-text-muted">
              Manage your projects and submit milestone evidence
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView(view === 'dashboard' ? 'create' : 'dashboard')}
            className="btn-primary"
          >
            {view === 'dashboard' ? '+ Create Project' : '← Back to Dashboard'}
          </motion.button>
        </motion.div>

        <AnimatePresence mode="wait">
          {view === 'create' ? (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <CreateProjectForm
                walletAddress={walletAddress}
                onSuccess={() => setView('dashboard')}
              />
            </motion.div>
          ) : (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              {/* My Projects */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-dark dark:text-text-star mb-6">
                  My Projects
                </h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card rounded-2xl p-6"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-text-dark dark:text-text-star mb-1">
                            {project.title}
                          </h3>
                          <p className="text-sm text-text-dark-muted dark:text-text-muted">
                            {project.category}
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">
                          Active
                        </span>
                      </div>
                      <p className="text-sm text-text-dark-muted dark:text-text-muted mb-4">
                        ${project.goal.toLocaleString()} Goal
                      </p>
                      <div className="border-t border-gray-200 dark:border-white/10 pt-4">
                        <p className="text-sm font-semibold text-text-dark dark:text-text-star mb-2">
                          Milestones ({project.milestones.length})
                        </p>
                        {project.milestones.map((milestone: any, idx: number) => (
                          <div key={idx} className="mb-2">
                            <p className="text-sm text-text-dark-muted dark:text-text-muted">
                              {idx + 1}. {milestone.title} - ${milestone.amount}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Evidence Upload Section */}
              <div>
                <h2 className="text-2xl font-bold text-text-dark dark:text-text-star mb-6">
                  Submit Milestone Evidence
                </h2>
                <EvidenceUpload
                  walletAddress={walletAddress}
                  projects={myProjects}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}