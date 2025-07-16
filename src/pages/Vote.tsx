import React, { useState } from 'react';
import { Vote as VoteIcon, User, Check } from 'lucide-react';
import { useWeb3 } from '../context/Web3Context';
import { useContract } from '../hooks/useContract';
import { VotingStatus, Gender } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const Vote: React.FC = () => {
  const { isConnected, account } = useWeb3();
  const { candidates, voters, votingStatus, castVote, loading } = useContract();
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null);

  const currentVoter = voters.find(voter => 
    voter.voterAddress.toLowerCase() === account?.toLowerCase()
  );

  const hasVoted = currentVoter && currentVoter.voteCandidateId !== 0;

  const handleVote = async () => {
    if (!selectedCandidate || !currentVoter) return;
    await castVote(currentVoter.voterId, selectedCandidate);
  };

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
          <VoteIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
          <p className="text-gray-600">Please connect your wallet to cast your vote.</p>
        </div>
      </div>
    );
  }

  if (!currentVoter) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Not Registered</h2>
          <p className="text-gray-600 mb-6">You need to register as a voter first.</p>
          <a
            href="/register-voter"
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
          >
            Register as Voter
          </a>
        </div>
      </div>
    );
  }

  if (votingStatus !== VotingStatus.InProgress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <VoteIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Voting Not Available</h2>
          <p className="text-gray-600">
            {votingStatus === VotingStatus.NotStarted 
              ? 'Voting has not started yet.'
              : 'Voting has ended.'
            }
          </p>
        </div>
      </div>
    );
  }

  if (hasVoted) {
    const votedCandidate = candidates.find(c => c.candidateId === currentVoter.voteCandidateId);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <Check className="w-16 h-16 text-green-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Vote Submitted</h2>
          <p className="text-gray-600 mb-4">You have already voted for:</p>
          <div className="bg-green-50 p-4 rounded-md">
            <h3 className="font-bold text-green-800">{votedCandidate?.name}</h3>
            <p className="text-green-600">{votedCandidate?.party}</p>
          </div>
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
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <VoteIcon className="w-8 h-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Cast Your Vote</h1>
            <p className="text-gray-600">Select a candidate to vote for</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {candidates.map((candidate, index) => (
              <motion.div
                key={candidate.candidateId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all ${
                  selectedCandidate === candidate.candidateId
                    ? 'ring-2 ring-purple-500 bg-purple-50'
                    : 'hover:shadow-xl'
                }`}
                onClick={() => setSelectedCandidate(candidate.candidateId)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{candidate.name}</h3>
                      <p className="text-purple-600 font-medium">{candidate.party}</p>
                    </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    selectedCandidate === candidate.candidateId
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedCandidate === candidate.candidateId && (
                      <Check className="w-4 h-4 text-white m-0.5" />
                    )}
                  </div>
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
                    <span>Current Votes:</span>
                    <span className="font-semibold text-purple-600">{Number(candidate.votes)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedCandidate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Your Vote</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">You are voting for:</p>
                  <p className="font-bold text-purple-600">
                    {candidates.find(c => c.candidateId === selectedCandidate)?.name} - {' '}
                    {candidates.find(c => c.candidateId === selectedCandidate)?.party}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleVote}
                  disabled={loading}
                  className="bg-purple-600 text-white px-8 py-3 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {loading ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <>
                      <VoteIcon className="w-4 h-4" />
                      <span>Cast Vote</span>
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Vote;
