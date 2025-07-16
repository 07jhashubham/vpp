import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { Voter, Candidate, VotingStatus } from '../types';
import { toast } from 'react-toastify';

export const useContract = () => {
  const { contract } = useWeb3();
  const [loading, setLoading] = useState(false);
  const [voters, setVoters] = useState<Voter[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votingStatus, setVotingStatus] = useState<VotingStatus>(VotingStatus.NotStarted);
  const [winner, setWinner] = useState<string | null>(null);

  const registerVoter = async (name: string, age: number, gender: number) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const tx = await contract.registerVoter(name, age, gender);
      toast.info('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      toast.success('Voter registered successfully!');
      await fetchVoters();
    } catch (error: any) {
      console.error('Error registering voter:', error);
      toast.error(error.reason || 'Failed to register voter');
    } finally {
      setLoading(false);
    }
  };

  const registerCandidate = async (name: string, party: string, age: number, gender: number) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const tx = await contract.registerCandidate(name, party, age, gender);
      toast.info('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      toast.success('Candidate registered successfully!');
      await fetchCandidates();
    } catch (error: any) {
      console.error('Error registering candidate:', error);
      toast.error(error.reason || 'Failed to register candidate');
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (voterId: number, candidateId: number) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const tx = await contract.castVote(voterId, candidateId);
      toast.info('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      toast.success('Vote cast successfully!');
      await fetchCandidates();
      await fetchVoters();
    } catch (error: any) {
      console.error('Error casting vote:', error);
      toast.error(error.reason || 'Failed to cast vote');
    } finally {
      setLoading(false);
    }
  };

  const setVotingPeriod = async (duration: number) => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const tx = await contract.setVotingPeriod(duration);
      toast.info('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      toast.success('Voting period set successfully!');
      await fetchVotingStatus();
    } catch (error: any) {
      console.error('Error setting voting period:', error);
      toast.error(error.reason || 'Failed to set voting period');
    } finally {
      setLoading(false);
    }
  };

  const announceResult = async () => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const tx = await contract.announceVotingResult();
      toast.info('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      toast.success('Result announced successfully!');
      await fetchWinner();
    } catch (error: any) {
      console.error('Error announcing result:', error);
      toast.error(error.reason || 'Failed to announce result');
    } finally {
      setLoading(false);
    }
  };

  const emergencyStop = async () => {
    if (!contract) return;
    
    setLoading(true);
    try {
      const tx = await contract.emergencyStopVoting();
      toast.info('Transaction submitted. Waiting for confirmation...');
      await tx.wait();
      toast.success('Voting stopped successfully!');
      await fetchVotingStatus();
    } catch (error: any) {
      console.error('Error stopping voting:', error);
      toast.error(error.reason || 'Failed to stop voting');
    } finally {
      setLoading(false);
    }
  };

  const fetchVoters = async () => {
    if (!contract) return;
    
    try {
      const voterList = await contract.getVoterList();
      setVoters(voterList);
    } catch (error) {
      console.error('Error fetching voters:', error);
    }
  };

  const fetchCandidates = async () => {
    if (!contract) return;
    
    try {
      const candidateList = await contract.getCandidateList();
      setCandidates(candidateList);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const fetchVotingStatus = async () => {
    if (!contract) return;
    
    try {
      const status = await contract.getVotingStatus();
      setVotingStatus(status);
    } catch (error) {
      console.error('Error fetching voting status:', error);
    }
  };

  const fetchWinner = async () => {
    if (!contract) return;
    
    try {
      const winnerAddress = await contract.winner();
      setWinner(winnerAddress);
    } catch (error) {
      console.error('Error fetching winner:', error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchVoters();
      fetchCandidates();
      fetchVotingStatus();
      fetchWinner();
    }
  }, [contract]);

  return {
    loading,
    voters,
    candidates,
    votingStatus,
    winner,
    registerVoter,
    registerCandidate,
    castVote,
    setVotingPeriod,
    announceResult,
    emergencyStop,
    fetchVoters,
    fetchCandidates,
    fetchVotingStatus,
    fetchWinner,
  };
};
