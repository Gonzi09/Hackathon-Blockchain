import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import RoleGate from './routes/RoleGate';
import Investor from './routes/Investor';
import Entrepreneur from './routes/Entrepreneur';
import Verifier from './routes/Verifier';
import Hero from './components/Hero';

type Role = 'investor' | 'entrepreneur' | 'verifier' | null;

function App() {
  const [role, setRole] = useState<Role>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [showRoleGate, setShowRoleGate] = useState(true);

  const handleRoleSelected = (selectedRole: Role) => {
    setRole(selectedRole);
    setShowRoleGate(false);
  };

  const handleConnect = (address: string) => {
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
  };

  const handleChangeRole = () => {
    localStorage.removeItem('stellarbridge_role');
    setRole(null);
    setShowRoleGate(true);
  };

  const triggerConnect = () => {
    // This will be handled by Navbar's WalletConnect button
    const connectBtn = document.querySelector('[aria-label="Connect wallet"]') as HTMLButtonElement;
    connectBtn?.click();
  };

  if (showRoleGate) {
    return <RoleGate onRoleSelected={handleRoleSelected} />;
  }

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-deep transition-colors duration-300">
      {/* Navbar */}
      <Navbar 
        walletAddress={walletAddress}
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        currentRole={role}
        onChangeRole={handleChangeRole}
      />

      {/* Main Content */}
      <main className="pt-20">
        <AnimatePresence mode="wait">
          {role === 'investor' && (
            <motion.div
              key="investor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Hero onScrollToProjects={() => {}} />
              <Investor 
                walletAddress={walletAddress}
                onConnect={triggerConnect}
              />
            </motion.div>
          )}

          {role === 'entrepreneur' && (
            <motion.div
              key="entrepreneur"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Entrepreneur 
                walletAddress={walletAddress}
                onConnect={triggerConnect}
              />
            </motion.div>
          )}

          {role === 'verifier' && (
            <motion.div
              key="verifier"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Verifier 
                walletAddress={walletAddress}
                onConnect={triggerConnect}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="py-12 border-t border-gray-200 dark:border-white/10 mt-16"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-text-dark-muted dark:text-text-muted">
              <span className="text-sm">Built on</span>
              <span className="font-semibold text-stellar-blue">Stellar</span>
              <span className="text-sm">•</span>
              <span className="text-sm">Powered by</span>
              <span className="font-semibold text-stellar-purple">Soroban</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-stellar-teal opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-stellar-teal"></span>
              </span>
              <span className="text-sm text-text-dark-muted dark:text-text-muted">
                Connected to <span className="font-semibold text-stellar-teal">Testnet</span>
              </span>
            </div>
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;