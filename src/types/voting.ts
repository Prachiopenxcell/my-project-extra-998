export interface VotingRequest {
  id: string;
  title: string;
  entityName: string;
  meetingNumber: string;
  status: VotingStatus;
  progress: number;
  totalParticipants: number;
  votedParticipants: number;
  totalResolutions: number;
  passedResolutions: number;
  amount: number;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  startDate: string;
  endDate: string;
  meetingType: MeetingType;
  discreteVoting: boolean;
  allowExtensions: boolean;
  participants: VotingParticipant[];
  resolutions: Resolution[];
  reminders: ReminderSettings;
  momFile?: File;
}

export interface VotingParticipant {
  id: string;
  name: string;
  email: string;
  mobile: string;
  votingShare: number;
  hasVoted: boolean;
  votedAt?: string;
}

export interface Resolution {
  id: string;
  title: string;
  description: string;
  minimumPassPercentage: number;
  calculationBase: 'total_vote' | 'votes_present';
  status: ResolutionStatus;
  votes: Vote[];
  currentSupport: number;
}

export interface Vote {
  id: string;
  participantId: string;
  resolutionId: string;
  choice: VoteChoice;
  votedAt: string;
  isLocked: boolean;
}

export interface ReminderSettings {
  sendSMS: boolean;
  sendEmail: boolean;
  sendTo: 'all_participants' | 'non_voters_only';
  frequency: 'daily' | 'twice_daily' | 'hourly';
  startBefore: number; // days before voting starts
}

export interface VotingStats {
  activeVotings: number;
  completedVotings: number;
  scheduledVotings: number;
  inProgressVotings: number;
  activeVotingsChange: number;
  completedVotingsChange: number;
  scheduledVotingsChange: number;
  inProgressVotingsChange: number;
}

export interface VotingActivity {
  id: string;
  type: 'new_request' | 'voting_completed' | 'fees_processed' | 'extension_request';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  entityName?: string;
}

export type VotingStatus = 'draft' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'review';

export type ResolutionStatus = 'pending' | 'voted' | 'passed' | 'failed';

export type VoteChoice = 'agree' | 'disagree' | 'abstain';

export type MeetingType = 'board_meeting' | 'annual_meeting' | 'special_meeting' | 'committee_meeting';

export interface CreateVotingRequest {
  title: string;
  entityName: string;
  meetingNumber: string;
  meetingType: MeetingType;
  startDate: string;
  endDate: string;
  discreteVoting: boolean;
  allowExtensions: boolean;
  participants: Omit<VotingParticipant, 'id' | 'hasVoted' | 'votedAt'>[];
  resolutions: Omit<Resolution, 'id' | 'status' | 'votes' | 'currentSupport'>[];
  reminders: ReminderSettings;
  momFile?: File;
}

export interface VotingFilters {
  status?: VotingStatus;
  entityName?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}
