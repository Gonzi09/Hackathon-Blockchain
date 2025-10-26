import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import InvestmentModal from '../components/InvestmentModal';
import SuccessModal from '../components/SuccessModal';
import MilestoneTimeline from '../components/MilestoneTimeline';
import projectsData from '../data/projects.json';

interface InvestorProps {
  walletAddress: string | null;
  onConnect: () => void;
}

export default function Investor({ walletAddress, onConnect }: InvestorProps) {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isInvestModalOpen, setIsInvestModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [investedAmount, setInvestedAmount] = useState(0);

  const handleInvestClick = (project: any) => {
    if (!walletAddress) {
      onConnect();
      return;
    }
    setSelectedProject(project);
    setIsInvestModalOpen(true);
  };

  const handleInvestSuccess = (hash: string, amount: number) => {
    setTxHash(hash);
    setInvestedAmount(amount);
    setIsSuccessModalOpen(true);
  };

  const handleViewMilestones = (project: any) => {
    setSelectedProject(project);
  };

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
            Investment <span className="text-gradient">Opportunities</span>
          </h1>
          <p className="text-text-dark-muted dark:text-text-muted">
            Discover projects and track milestone progress
          </p>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {projectsData.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              walletAddress={walletAddress}
              onInvest={() => handleInvestClick(project)}
              onViewMilestones={() => handleViewMilestones(project)}
              index={index}
            />
          ))}
        </div>

        {/* Milestone Timeline */}
        {selectedProject && !isInvestModalOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 sm:p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-text-dark dark:text-text-star">
                Milestone Timeline
              </h2>
              <button
                onClick={() => setSelectedProject(null)}
                className="btn-secondary text-sm"
              >
                Close
              </button>
            </div>
            <MilestoneTimeline 
              projectId={selectedProject.id}
              milestones={selectedProject.milestones}
            />
          </motion.div>
        )}

        {/* Modals */}
        {walletAddress && selectedProject && (
          <InvestmentModal
            isOpen={isInvestModalOpen}
            onClose={() => setIsInvestModalOpen(false)}
            walletAddress={walletAddress}
            projectId={selectedProject.id}
            onSuccess={handleInvestSuccess}
          />
        )}

        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          txHash={txHash}
          amount={investedAmount}
        />
      </div>
    </div>
  );
}