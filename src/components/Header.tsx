import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Vote, User, Settings, Trophy, Users } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { account, isConnected, connectWallet, disconnectWallet, isElectionCommission } = useWeb3();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Vote },
    { name: 'Register Voter', href: '/register-voter', icon: User },
    { name: 'Register Candidate', href: '/register-candidate', icon: Users },
    { name: 'Vote', href: '/vote', icon: Vote },
    { name: 'Results', href: '/results', icon: Trophy },
  ];

  if (isElectionCommission) {
    navigation.push({ name: 'Admin', href: '/admin', icon: Settings });
  }

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <Vote className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold">VoteDApp</h1>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                    location.pathname === item.href
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-4">
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <div className="font-medium">
                    {account?.substring(0, 6)}...{account?.substring(account.length - 4)}
                  </div>
                  {isElectionCommission && (
                    <div className="text-xs text-blue-200">Election Commission</div>
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Disconnect
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              >
                Connect Wallet
              </motion.button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-4 flex flex-wrap gap-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm transition-colors ${
                  location.pathname === item.href
                    ? 'bg-blue-700 text-white'
                    : 'text-blue-100 hover:bg-blue-500 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;
