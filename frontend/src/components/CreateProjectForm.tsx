import { useState } from 'react';
import { motion } from 'framer-motion';
import { createProject } from '../utils/stellar';

interface CreateProjectFormProps {
  walletAddress: string;
  onSuccess: () => void;
}

export default function CreateProjectForm({ walletAddress, onSuccess }: CreateProjectFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    category: 'Agriculture',
    location: '',
  });

  const [milestones, setMilestones] = useState([
    { title: '', amount: '', deadline: '', description: '' },
  ]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const addMilestone = () => {
    setMilestones([...milestones, { title: '', amount: '', deadline: '', description: '' }]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index));
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    const updated = [...milestones];
    updated[index] = { ...updated[index], [field]: value };
    setMilestones(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError('');

    try {
      const goalAmount = parseFloat(formData.goal);
      const milestoneAmounts = milestones.map(m => parseFloat(m.amount));
      const milestoneDeadlines = milestones.map(m => new Date(m.deadline).getTime() / 1000);

      const result = await createProject(
        walletAddress,
        goalAmount,
        milestoneAmounts,
        milestoneDeadlines
      );

      console.log('Project created:', result);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to create project');
    } finally {
      setIsProcessing(false);
    }
  };

  const totalMilestoneAmount = milestones.reduce((sum, m) => sum + (parseFloat(m.amount) || 0), 0);

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-text-dark dark:text-text-star mb-6">
        Create New Project
      </h2>

      {/* Basic Info */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-text-dark dark:text-text-star mb-2">
            Project Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="input-primary"
            placeholder="e.g., María's Seeds Project"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-text-dark dark:text-text-star mb-2">
            Description
          </label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="input-primary min-h-[100px]"
            placeholder="Describe your project..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text-dark dark:text-text-star mb-2">
              Goal Amount ($)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className="input-primary"
              placeholder="1000"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark dark:text-text-star mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-primary"
            >
              <option>Agriculture</option>
              <option>Education</option>
              <option>Healthcare</option>
              <option>Technology</option>
              <option>Retail</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-dark dark:text-text-star mb-2">
              Location
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="input-primary"
              placeholder="Guatemala"
            />
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-text-dark dark:text-text-star">
            Milestones ({milestones.length})
          </h3>
          <button
            type="button"
            onClick={addMilestone}
            className="text-sm text-stellar-blue hover:text-stellar-purple transition-colors"
          >
            + Add Milestone
          </button>
        </div>

        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-gray-50 dark:bg-bg-deep border border-gray-200 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-text-dark dark:text-text-star">
                  Milestone {index + 1}
                </h4>
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={milestone.title}
                  onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                  className="input-primary text-sm"
                  placeholder="Milestone title"
                />
                <input
                  type="number"
                  required
                  min="1"
                  value={milestone.amount}
                  onChange={(e) => updateMilestone(index, 'amount', e.target.value)}
                  className="input-primary text-sm"
                  placeholder="Amount ($)"
                />
                <input
                  type="date"
                  required
                  value={milestone.deadline}
                  onChange={(e) => updateMilestone(index, 'deadline', e.target.value)}
                  className="input-primary text-sm"
                />
                <input
                  type="text"
                  required
                  value={milestone.description}
                  onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                  className="input-primary text-sm"
                  placeholder="Description"
                />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-stellar-blue/10 border border-stellar-blue/20">
          <div className="flex justify-between items-center text-sm">
            <span className="text-text-dark-muted dark:text-text-muted">Total Milestone Amount:</span>
            <span className={`font-bold ${
              totalMilestoneAmount > parseFloat(formData.goal || '0')
                ? 'text-red-500'
                : 'text-stellar-blue'
            }`}>
              ${totalMilestoneAmount.toFixed(2)} / ${formData.goal || '0'}
            </span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isProcessing || totalMilestoneAmount > parseFloat(formData.goal || '0')}
        className="w-full btn-primary"
      >
        {isProcessing ? 'Creating Project...' : 'Create Project'}
      </button>
    </form>
  );
}