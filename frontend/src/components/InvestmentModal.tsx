import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signTransaction } from '@stellar/freighter-api';
import { buildInvestmentTransaction, submitTransaction } from '../utils/stellar';
import { INVESTMENT_AMOUNTS } from '../config/constants';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress: string;
  onSuccess: (txHash: string, amount: number) => void;
}

export default function InvestmentModal({ 
  isOpen, 
  onClose, 
  walletAddress,
  onSuccess 
}: InvestmentModalProps) {
  const [selectedAmount, setSelectedAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleInvest = async () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount;

    if (!amount || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setIsProcessing(true);
    setError(''); 

    try {
      console.log('Building transaction...');
      const transaction = await buildInvestmentTransaction(walletAddress, amount);

      console.log('Requesting signature from Freighter...');
      console.log('Transaction XDR:', transaction.toXDR());
      const {signedXdr} = await signTransaction(transaction.toXDR(), {
        networkPassphrase: 'Test SDF Network ; September 2015',
      });

      console.log('Submitting transaction...');
      const result = await submitTransaction(signedXdr);

      if (result.status === 'SUCCESS') {
        onSuccess(result.hash, amount);
        onClose();
      } else {
        throw new Error(`Transaction failed with status: ${result.status}`);
      }
    } catch (err: any) {
      console.error('Investment error:', err);
      setError(err.message || 'Transaction failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-card rounded-2xl shadow-orbit-lg max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
            role="dialog"
            aria-labelledby="modal-title"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 id="modal-title" className="text-2xl sm:text-3xl font-bold text-text-dark dark:text-text-star mb-1">
                  Invest in María's Project
                </h3>
                <p className="text-sm text-text-dark-muted dark:text-text-muted">
                  Support organic vegetable farming in Guatemala
                </p>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-bg-deep transition-colors
                  focus-visible:ring-2 focus-visible:ring-stellar-teal focus-visible:outline-none"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6 text-text-dark-muted dark:text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Quick Select Amounts */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-dark dark:text-text-star mb-3">
                Quick Select Amount
              </label>
              <div className="grid grid-cols-3 gap-3">
                {INVESTMENT_AMOUNTS.map((amount, index) => (
                  <motion.button
                    key={amount}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`p-4 rounded-xl font-semibold text-base sm:text-lg transition-all duration-200
                      focus-visible:ring-2 focus-visible:ring-stellar-teal focus-visible:outline-none
                      ${!customAmount && selectedAmount === amount
                        ? 'bg-gradient-to-br from-stellar-blue to-stellar-purple text-white shadow-orbit'
                        : 'glass-card text-text-dark dark:text-text-star hover:border-stellar-teal/40 border border-transparent'
                      }`}
                  >
                    ${amount}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-text-dark dark:text-text-star mb-3">
                Or Enter Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dark-muted dark:text-text-muted font-semibold text-lg">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="input-primary pl-10 text-lg font-semibold"
                  aria-label="Custom investment amount"
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30"
                  role="alert"
                >
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Summary */}
            <div className="mb-6 p-4 rounded-xl glass-card">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-text-dark-muted dark:text-text-muted">Investment Amount</span>
                  <span className="text-xl font-bold text-gradient">
                    ${customAmount || selectedAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-dark-muted dark:text-text-muted">Network</span>
                  <span className="text-sm px-3 py-1 rounded-full bg-stellar-teal/20 text-stellar-teal font-semibold">
                    Stellar Testnet
                  </span>
                </div>
                <div className="pt-3 border-t border-gray-200 dark:border-white/10">
                  <p className="text-xs text-text-dark-muted dark:text-text-muted">
                    Your investment will be securely stored in the smart contract until milestones are completed.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                disabled={isProcessing}
                className="flex-1 btn-secondary"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInvest}
                disabled={isProcessing}
                className="flex-1 btn-primary relative overflow-hidden"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  'Confirm Investment'
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}