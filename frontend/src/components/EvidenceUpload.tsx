import { useState } from 'react';
import { motion } from 'framer-motion';
import { calculateFileHash } from '../lib/crypto';
import { submitEvidence } from '../utils/stellar';

interface EvidenceUploadProps {
  walletAddress: string;
  projects: any[];
}

export default function EvidenceUpload({ walletAddress, projects }: EvidenceUploadProps) {
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileHash, setFileHash] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const selectedProjectData = projects.find(p => p.id.toString() === selectedProject);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError('');
    
    try {
      const hash = await calculateFileHash(selectedFile);
      setFileHash(hash);
    } catch (err) {
      setError('Failed to calculate file hash');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !fileHash) {
      setError('Please select a file');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');

    try {
      const projectId = parseInt(selectedProject);
      const milestoneIndex = parseInt(selectedMilestone);

      const result = await submitEvidence(
        walletAddress,
        projectId,
        milestoneIndex,
        fileHash
      );

      setSuccess(`Evidence submitted! TX: ${result.hash}`);
      setFile(null);
      setFileHash('');
      setSelectedProject('');
      setSelectedMilestone('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit evidence');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8">
      <h3 className="text-xl font-bold text-text-dark dark:text-text-star mb-6">
        Upload Milestone Evidence
      </h3>

      <div className="space-y-4 mb-6">
        {/* Project Selection */}
        <div>
          <label className="block text-sm font-semibold text-text-dark dark:text-text-star mb-2">
            Select Project
          </label>
          <select
            required
            value={selectedProject}
            onChange={(e) => {
              setSelectedProject(e.target.value);
              setSelectedMilestone('');
            }}
            className="input-primary"
          >
            <option value="">Choose a project...</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        {/* Milestone Selection */}
        {selectedProjectData && (
          <div>
            <label className="block text-sm font-semibold text-text-dark dark:text-text-star mb-2">
              Select Milestone
            </label>
            <select
              required
              value={selectedMilestone}
              onChange={(e) => setSelectedMilestone(e.target.value)}
              className="input-primary"
            >
              <option value="">Choose a milestone...</option>
              {selectedProjectData.milestones.map((milestone: any, index: number) => (
                <option key={index} value={index}>
                  Milestone {index + 1}: {milestone.title} (${milestone.amount})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* File Upload */}
        {selectedMilestone !== '' && (
          <div>
            <label className="block text-sm font-semibold text-text-dark dark:text-text-star mb-2">
              Upload Evidence File
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="evidence-file"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label
                htmlFor="evidence-file"
                className="flex items-center justify-center gap-3 p-8 border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl cursor-pointer hover:border-stellar-teal transition-colors"
              >
                <svg className="w-8 h-8 text-text-dark-muted dark:text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <div className="text-center">
                  <p className="text-text-dark dark:text-text-star font-semibold">
                    {file ? file.name : 'Click to upload'}
                  </p>
                  <p className="text-xs text-text-dark-muted dark:text-text-muted mt-1">
                    PDF, JPG, PNG, DOC (max 10MB)
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* File Hash Display */}
        {fileHash && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30"
          >
            <p className="text-sm font-semibold text-green-700 dark:text-green-400 mb-2">
              File Hash Calculated ✓
            </p>
            <code className="text-xs text-green-600 dark:text-green-500 break-all font-mono">
              {fileHash}
            </code>
          </motion.div>
        )}
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30">
          <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isProcessing || !file || !fileHash}
        className="w-full btn-primary"
      >
        {isProcessing ? 'Submitting Evidence...' : 'Submit Evidence to Blockchain'}
      </button>
    </form>
  );
}