import React, { useState } from 'react';
import { Settings, Clock, AlertTriangle, Trophy, Users, User } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useContract } from '../hooks/useContract';
import { VotingStatus } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const Admin: React.FC = () => {
  const { isConnected, isElectionCommission } = useWeb3();
  const { 
    votingStatus, 
    candidates, 
    voters, 
    setVotingPeriod, 
    announceResult, 
    emergencyStop, 
    loading 
  } = useContract();

  const [duration, setDuration] = useState('');

  const handleSetVotingPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    const durationInSeconds = parseInt(duration) * 3600; // Convert hours to seconds
    await setVotingPeriod(durationInSeconds);
    setDuration('');
  };

  const handleAnnounceResult = async () => {
    if (window.confirm('Are you sure you want to announce the voting result?')) {
      await announceResult();
    }
  };

  const handleEmergencyStop = async () => {
    if (window.confirm('Are you sure you want to stop the voting process? This action cannot be undone.')) {
      await emergencyStop();
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <Settings className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to access the admin panel.</p>
        </div>
      </div>
    );
  }

  if (!isElectionCommission) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600">You are not authorized to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const totalVotes = candidates.reduce((sum, candidate) => sum + Number(candidate.votes), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Panel</h1>
            <p className="text-gray-600">Election Commission Dashboard</p>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Voting Status</p>
                  <p className="text-lg font-bold text-blue-600">
                    {votingStatus === VotingStatus.NotStarted ? 'Not Started' :
                     votingStatus === VotingStatus.InProgress ? 'In Progress' : 'Ended'}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Candidates</p>
                  <p className="text-2xl font-bold text-green-600">{candidates.length}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Voters</p>
                  <p className="text-2xl font-bold text-purple-600">{voters.length}</p>
                </div>
                <User className="w-8 h-8 text-purple-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold text-yellow-600">{totalVotes}</p>
                </div>
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
            </motion.div>
          </div>

          {/* Admin Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Set Voting Period */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Set Voting Period
              </h3>
              <form onSubmit={handleSetVotingPeriod} className="space-y-4">
                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    min="1"
                    max="168"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter duration in hours"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum: 1 hour, Maximum: 168 hours (7 days)</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || votingStatus !== VotingStatus.NotStarted}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? <LoadingSpinner size="small" /> : 'Set Voting Period'}
                </motion.button>
              </form>
            </motion.div>

            {/* Emergency Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Emergency Actions
              </h3>
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleEmergencyStop}
                  disabled={loading || votingStatus !== VotingStatus.InProgress}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? <LoadingSpinner size="small" /> : 'Emergency Stop Voting'}
                </motion.button>
                <p className="text-xs text-gray-500">
                  Use this button to immediately stop the voting process in case of emergency.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Announce Result */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2" />
              Announce Result
            </h3>
            <p className="text-gray-600 mb-4">
              Once the voting period has ended, you can announce the official result.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAnnounceResult}
              disabled={loading || votingStatus !== VotingStatus.Ended}
              className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? <LoadingSpinner size="small" /> : 'Announce Winner'}
            </motion.button>
          </motion.div>

          {/* Current Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg shadow-lg p-6 mt-8"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Current Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Candidates</h4>
                <div className="space-y-2">
                  {candidates.map((candidate) => (
                    <div key={candidate.candidateId} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-sm">{candidate.name} ({candidate.party})</span>
                      <span className="text-sm font-semibold text-blue-600">{Number(candidate.votes)} votes</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Voting Progress</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Registered Voters:</span>
                    <span className="text-sm font-semibold">{voters.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Votes Cast:</span>
                    <span className="text-sm font-semibold">{totalVotes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Turnout Rate:</span>
                    <span className="text-sm font-semibold">
                      {voters.length > 0 ? ((totalVotes / voters.length) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
