import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { Web3ContextType } from "../types";

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const CONTRACT_ADDRESS = "0xd48b917257B7Aa5b3e36Ef2C567fF12F7b09D0b6"; // Replace with your deployed contract address
const CONTRACT_ABI = [
  {
    inputs: [],
    name: "announceVotingResult",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_voterId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_candidateId",
        type: "uint256",
      },
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "emergencyStopVoting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "string",
        name: "_party",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_age",
        type: "uint256",
      },
      {
        internalType: "enum Vote.Gender",
        name: "_gender",
        type: "uint8",
      },
    ],
    name: "registerCandidate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_age",
        type: "uint256",
      },
      {
        internalType: "enum Vote.Gender",
        name: "_gender",
        type: "uint8",
      },
    ],
    name: "registerVoter",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_endTimeDuration",
        type: "uint256",
      },
    ],
    name: "setVotingPeriod",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "electionCommission",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getCandidateList",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "string",
            name: "party",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "age",
            type: "uint256",
          },
          {
            internalType: "enum Vote.Gender",
            name: "gender",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "candidateId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "candidateAddress",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "votes",
            type: "uint256",
          },
        ],
        internalType: "struct Vote.Candidate[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVoterList",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "name",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "age",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "voterId",
            type: "uint256",
          },
          {
            internalType: "enum Vote.Gender",
            name: "gender",
            type: "uint8",
          },
          {
            internalType: "uint256",
            name: "voteCandidateId",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "voterAddress",
            type: "address",
          },
        ],
        internalType: "struct Vote.Voter[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getVotingStatus",
    outputs: [
      {
        internalType: "enum Vote.VotingStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "winner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const Web3Provider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isElectionCommission, setIsElectionCommission] = useState(false);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );

        setProvider(provider);
        setAccount(accounts[0]);
        setContract(contract);
        setIsConnected(true);

        // Check if user is election commission
        const commissionAddress = await contract.electionCommission();
        setIsElectionCommission(
          accounts[0].toLowerCase() === commissionAddress.toLowerCase()
        );

        toast.success("Wallet connected successfully!");
      } else {
        toast.error("MetaMask not detected. Please install MetaMask.");
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setContract(null);
    setIsConnected(false);
    setIsElectionCommission(false);
    toast.info("Wallet disconnected");
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            await connectWallet();
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
    };

    checkConnection();
  }, []);

  return (
    <Web3Context.Provider
      value={{
        account,
        provider,
        contract,
        isConnected,
        connectWallet,
        disconnectWallet,
        isElectionCommission,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
