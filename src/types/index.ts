export interface Voter {
  name: string;
  age: number;
  voterId: number;
  gender: number;
  voteCandidateId: number;
  voterAddress: string;
}

export interface Candidate {
  name: string;
  party: string;
  age: number;
  gender: number;
  candidateId: number;
  candidateAddress: string;
  votes: number;
}

export enum VotingStatus {
  NotStarted = 0,
  InProgress = 1,
  Ended = 2
}

export enum Gender {
  NotSpecified = 0,
  Male = 1,
  Female = 2,
  Other = 3
}

export interface Web3ContextType {
  account: string | null;
  provider: any;
  contract: any;
  isConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isElectionCommission: boolean;
}
