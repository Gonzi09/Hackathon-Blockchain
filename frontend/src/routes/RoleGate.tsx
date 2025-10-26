import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

type Role = 'investor' | 'entrepreneur' | 'verifier' | null;

interface RoleGateProps {
  onRoleSelected: (role: Role) => void;
}

export default function RoleGate({ onRoleSelected }: RoleGateProps) {
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem('stellarbridge_role') as Role;
    if (savedRole) {
      setSelectedRole(savedRole);
      onRoleSelected(savedRole);
    }
  }, []);

  const handleRoleSelect = (role: Role) => {
    localStorage.setItem('stellarbridge_role', role as string);
    setSelectedRole(role);
    onRoleSelected(role);
  };

  const roles = [
    {
      id: 'investor' as Role,
      title: 'Investor',
      description: 'Browse and invest in micro-entrepreneur projects',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-stellar-blue to-stellar-teal',
    },
    {
      id: 'entrepreneur' as Role,
      title: 'Entrepreneur',
      description: 'Create projects and submit milestone evidence',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-stellar-teal to-stellar-purple',
    },
    {
      id: 'verifier' as Role,
      title: 'Verifier',
      description: 'Review and approve milestone completions',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-stellar-purple to-stellar-blue',
    },
  ];

  if (selectedRole) return null;

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-deep flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-text-dark dark:text-text-star mb-4">
            Welcome to <span className="text-gradient">StellarBridge</span>
          </h1>
          <p className="text-lg text-text-dark-muted dark:text-text-muted">
            Who are you today?
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, index) => (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleRoleSelect(role.id)}
              className="glass-card p-8 rounded-2xl text-center hover:shadow-orbit-lg transition-all duration-300
                border border-transparent hover:border-stellar-teal/40 group"
            >
              <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${role.color} 
                flex items-center justify-center text-white
                group-hover:scale-110 transition-transform duration-300`}>
                {role.icon}
              </div>
              <h3 className="text-2xl font-bold text-text-dark dark:text-text-star mb-3 group-hover:text-stellar-blue transition-colors">
                {role.title}
              </h3>
              <p className="text-sm text-text-dark-muted dark:text-text-muted">
                {role.description}
              </p>
            </motion.button>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-8 text-sm text-text-dark-muted dark:text-text-muted"
        >
          You can change your role anytime from settings
        </motion.p>
      </div>
    </div>
  );
}