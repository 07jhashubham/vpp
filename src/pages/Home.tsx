import React from 'react';
import { Link } from 'react-router-dom';
import { User, Users, Vote, Trophy, Settings } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useContract } from '../hooks/useContract';
import VotingStatusCard from '../components/VotingStatusCard';
import { VotingStatus } from '../types';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { isConnected, isElectionCommission } = useWeb3();
  const { votingStatus, candidates, voters } = useContract();

  const actions = [
    {
      title: 'Register as Voter',
      description: 'Register yourself to participate in the election',
      icon: User,
      href: '/register-voter',
      color: 'bg-blue-500 hover:bg-blue-600',
      show: isConnected && !isElectionCommission
    },
    {
      title: 'Register as Candidate',
      description: 'Register yourself as a candidate for the election',
      icon: Users,
      href: '/register-candidate',
      color: 'bg-green-500 hover:bg-green-600',
      show: isConnected && !isElectionCommission
    },
    {
      title: 'Cast Your Vote',
      description: 'Vote for your preferred candidate',
      icon: Vote,
      href: '/vote',
      color: 'bg-purple-500 hover:bg-purple-600',
      show: isConnected && votingStatus === VotingStatus.InProgress
    },
    {
      title: 'View Results',
      description: 'Check the current voting results',
      icon: Trophy,
      href: '/results',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      show: isConnected
    },
    {
      title: 'Admin Panel',
      description: 'Manage the voting process',
      icon: Settings,
      href: '/admin',
      color: 'bg-red-500 hover:bg-red-600',
      show: isConnected && isElectionCommission
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
            Decentralized Voting System
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A secure, transparent, and decentralized voting platform built on the Ethereum blockchain.
            Participate in democratic elections with complete transparency and immutability.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto mb-12">
          <VotingStatusCard status={votingStatus} />
        </div>

        {isConnected ? (
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
            >
              {actions.filter(action => action.show).map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to={action.href} className="block">
                      <div className={`${action.color} text-white rounded-lg p-6 shadow-lg transition-all duration-300`}>
                        <Icon className="w-12 h-12 mb-4" />
                        <h3 className="text-xl font-bold mb-2">{action.title}</h3>
                        <p className="text-white/90">{action.description}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Candidates</h3>
                <p className="text-3xl font-bold text-blue-600">{candidates.length}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Voters</h3>
                <p className="text-3xl font-bold text-green-600">{voters.length}</p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Votes</h3>
                <p className="text-3xl font-bold text-purple-600">
                  {candidates.reduce((sum, candidate) => sum + Number(candidate.votes), 0)}
                </p>
              </div>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center bg-white rounded-lg p-12 shadow-lg max-w-md mx-auto"
          >
            <Vote className="w-16 h-16 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">
              Please connect your Ethereum wallet to participate in the voting process.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
