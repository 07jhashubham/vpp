import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { VotingStatus } from '../types';
import { motion } from 'framer-motion';

interface VotingStatusCardProps {
  status: VotingStatus;
}

const VotingStatusCard: React.FC<VotingStatusCardProps> = ({ status }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  const getStatusInfo = () => {
    switch (status) {
      case VotingStatus.NotStarted:
        return {
          icon: Clock,
          title: 'Voting Not Started',
          description: 'Waiting for election commission to start the voting period',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        };
      case VotingStatus.InProgress:
        return {
          icon: CheckCircle,
          title: 'Voting In Progress',
          description: 'Voting is currently active. Cast your vote now!',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case VotingStatus.Ended:
        return {
          icon: XCircle,
          title: 'Voting Ended',
          description: 'Voting period has ended. Results will be announced soon.',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      default:
        return {
          icon: AlertCircle,
          title: 'Unknown Status',
          description: 'Unable to determine voting status',
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const statusInfo = getStatusInfo();
  const Icon = statusInfo.icon;

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTimeLeft(`${hours}:${minutes}:${seconds}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border-2 p-6 ${statusInfo.bgColor} ${statusInfo.borderColor}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className={`w-8 h-8 ${statusInfo.color}`} />
          <div>
            <h3 className={`text-xl font-bold ${statusInfo.color}`}>{statusInfo.title}</h3>
            <p className="text-gray-600 mt-1">{statusInfo.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-mono font-bold text-gray-800">{timeLeft}</div>
          <div className="text-sm text-gray-500">Current Time</div>
        </div>
      </div>
    </motion.div>
  );
};

export default VotingStatusCard;
