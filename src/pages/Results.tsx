import React from 'react';
import { Trophy, User, Users, Award } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useContract } from '../hooks/useContract';
import { Gender } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion } from 'framer-motion';

const Results: React.FC = () => {
  const { isConnected } = useWeb3();
  const { candidates, winner, voters } = useContract();

  const totalVotes = candidates.reduce((sum, candidate) => sum + Number(candidate.votes), 0);
  const winnerCandidate = candidates.find(c => c.candidateAddress.toLowerCase() === winner?.toLowerCase());

  const chartData = candidates.map(candidate => ({
    name: candidate.name,
    party: candidate.party,
    votes: Number(candidate.votes),
    percentage: totalVotes > 0 ? ((Number(candidate.votes) / totalVotes) * 100).toFixed(1) : 0
  }));

  const pieData = candidates.map(candidate => ({
    name: candidate.name,
    value: Number(candidate.votes),
    percentage: totalVotes > 0 ? ((Number(candidate.votes) / totalVotes) * 100).toFixed(1) : 0
  }));

  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const getGenderText = (gender: number) => {
    switch (gender) {
      case Gender.Male: return 'Male';
      case Gender.Female: return 'Female';
      case Gender.Other: return 'Other';
      default: return 'Not Specified';
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to view results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Voting Results</h1>
            <p className="text-gray-600">Current voting statistics and results</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Votes</p>
                  <p className="text-2xl font-bold text-blue-600">{totalVotes}</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
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
                <User className="w-8 h-8 text-green-600" />
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
                  <p className="text-sm text-gray-600">Registered Voters</p>
                  <p className="text-2xl font-bold text-purple-600">{voters.length}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
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
                  <p className="text-sm text-gray-600">Turnout Rate</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {voters.length > 0 ? ((totalVotes / voters.length) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
            </motion.div>
          </div>

          {/* Winner Card */}
          {winnerCandidate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg shadow-lg p-8 mb-8"
            >
              <div className="flex items-center justify-center space-x-4">
                <Trophy className="w-12 h-12" />
                <div className="text-center">
                  <h2 className="text-3xl font-bold mb-2">Winner</h2>
                  <p className="text-xl font-semibold">{winnerCandidate.name}</p>
                  <p className="text-lg">{winnerCandidate.party}</p>
                  <p className="text-sm mt-2">
                    {Number(winnerCandidate.votes)} votes ({totalVotes > 0 ? ((Number(winnerCandidate.votes) / totalVotes) * 100).toFixed(1) : 0}%)
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Vote Distribution (Bar Chart)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [value, 'Votes']}
                    labelFormatter={(label) => `Candidate: ${label}`}
                  />
                  <Bar dataKey="votes" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">Vote Distribution (Pie Chart)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Votes']} />
                </PieChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Candidate Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Detailed Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.candidateId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    winnerCandidate?.candidateId === candidate.candidateId
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{candidate.name}</h4>
                        <p className="text-sm text-blue-600">{candidate.party}</p>
                      </div>
                    </div>
                    {winnerCandidate?.candidateId === candidate.candidateId && (
                      <Trophy className="w-6 h-6 text-yellow-500" />
                    )}
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Age:</span>
                      <span>{candidate.age}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gender:</span>
                      <span>{getGenderText(candidate.gender)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Votes:</span>
                      <span className="font-semibold text-blue-600">{Number(candidate.votes)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Percentage:</span>
                      <span className="font-semibold text-green-600">
                        {totalVotes > 0 ? ((Number(candidate.votes) / totalVotes) * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Results;
