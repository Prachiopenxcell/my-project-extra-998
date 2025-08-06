import { VotingRequest, VotingStats, VotingActivity, CreateVotingRequest, VotingFilters, Vote, VoteChoice } from '@/types/voting';

// Mock data for development
const mockVotingRequests: VotingRequest[] = [
  {
    id: 'VR-2023-1005',
    title: 'Board Resolution Q3 2023',
    entityName: 'Acme Corporation',
    meetingNumber: '2023-Q3-001',
    status: 'in_progress',
    progress: 75,
    totalParticipants: 15,
    votedParticipants: 12,
    totalResolutions: 5,
    passedResolutions: 3,
    amount: 35000,
    dueDate: '2023-06-15',
    createdAt: '2023-06-10',
    updatedAt: '2023-06-13',
    startDate: '2023-06-15T09:00:00',
    endDate: '2023-06-20T17:00:00',
    meetingType: 'board_meeting',
    discreteVoting: false,
    allowExtensions: true,
    participants: [
      { id: '1', name: 'John Smith', email: 'john@acme.com', mobile: '+1-555-0101', votingShare: 25, hasVoted: true, votedAt: '2023-06-16T10:30:00' },
      { id: '2', name: 'Jane Doe', email: 'jane@acme.com', mobile: '+1-555-0102', votingShare: 30, hasVoted: true, votedAt: '2023-06-16T11:15:00' },
      { id: '3', name: 'Mike Wilson', email: 'mike@acme.com', mobile: '+1-555-0103', votingShare: 20, hasVoted: false },
      { id: '4', name: 'Sarah Connor', email: 'sarah@acme.com', mobile: '+1-555-0104', votingShare: 15, hasVoted: true, votedAt: '2023-06-16T14:20:00' },
      { id: '5', name: 'David Park', email: 'david@acme.com', mobile: '+1-555-0105', votingShare: 10, hasVoted: false },
    ],
    resolutions: [
      {
        id: '1',
        title: 'Approval of Q3 Budget',
        description: 'To approve the quarterly budget allocation of $2.5M for Q3 operations including marketing, development, and administrative expenses as presented by the CFO.',
        minimumPassPercentage: 51,
        calculationBase: 'total_vote',
        status: 'pending',
        votes: [],
        currentSupport: 65
      },
      {
        id: '2',
        title: 'Board Member Appointment',
        description: 'To appoint Ms. Jennifer Lawrence as an independent director to the Board of Directors for a term of three years, effective immediately upon approval.',
        minimumPassPercentage: 66,
        calculationBase: 'votes_present',
        status: 'voted',
        votes: [],
        currentSupport: 85
      },
      {
        id: '3',
        title: 'Office Lease Renewal',
        description: 'To authorize the renewal of office lease agreement for headquarters location at current terms for additional 5-year period with option to extend.',
        minimumPassPercentage: 51,
        calculationBase: 'total_vote',
        status: 'pending',
        votes: [],
        currentSupport: 0
      }
    ],
    reminders: {
      sendSMS: false,
      sendEmail: true,
      sendTo: 'all_participants',
      frequency: 'daily',
      startBefore: 1
    }
  },
  {
    id: 'VR-2023-1006',
    title: 'Annual Meeting Voting',
    entityName: 'Tech Solutions Inc.',
    meetingNumber: '2023-AGM-001',
    status: 'scheduled',
    progress: 90,
    totalParticipants: 45,
    votedParticipants: 0,
    totalResolutions: 8,
    passedResolutions: 0,
    amount: 48500,
    dueDate: '2023-06-20',
    createdAt: '2023-06-05',
    updatedAt: '2023-06-12',
    startDate: '2023-06-20T10:00:00',
    endDate: '2023-06-25T18:00:00',
    meetingType: 'annual_meeting',
    discreteVoting: true,
    allowExtensions: false,
    participants: [],
    resolutions: [],
    reminders: {
      sendSMS: true,
      sendEmail: true,
      sendTo: 'all_participants',
      frequency: 'daily',
      startBefore: 2
    }
  },
  {
    id: 'VR-2023-1007',
    title: 'Special Resolution Meeting',
    entityName: 'Healthcare Ltd',
    meetingNumber: '2023-SRM-003',
    status: 'review',
    progress: 25,
    totalParticipants: 8,
    votedParticipants: 0,
    totalResolutions: 2,
    passedResolutions: 0,
    amount: 22000,
    dueDate: '2023-06-30',
    createdAt: '2023-06-08',
    updatedAt: '2023-06-13',
    startDate: '2023-06-25T14:00:00',
    endDate: '2023-06-30T16:00:00',
    meetingType: 'special_meeting',
    discreteVoting: false,
    allowExtensions: true,
    participants: [],
    resolutions: [],
    reminders: {
      sendSMS: false,
      sendEmail: true,
      sendTo: 'non_voters_only',
      frequency: 'twice_daily',
      startBefore: 1
    }
  }
];

const mockStats: VotingStats = {
  activeVotings: 3,
  completedVotings: 15,
  scheduledVotings: 2,
  inProgressVotings: 1,
  activeVotingsChange: 25,
  completedVotingsChange: 10,
  scheduledVotingsChange: 2,
  inProgressVotingsChange: 1
};

const mockActivities: VotingActivity[] = [
  {
    id: '1',
    type: 'new_request',
    title: 'New voting request received',
    description: 'Board Resolution for Q3 Budget Approval',
    timestamp: '2023-06-13T12:00:00',
    entityName: 'Acme Corporation'
  },
  {
    id: '2',
    type: 'voting_completed',
    title: 'Voting completed',
    description: 'Annual Compliance Resolution - All resolutions passed',
    timestamp: '2023-06-13T08:00:00',
    entityName: 'Tech Solutions Inc.'
  },
  {
    id: '3',
    type: 'fees_processed',
    title: 'Voting fees processed',
    description: '₹25,000 from Tech Solutions Inc',
    timestamp: '2023-06-13T06:00:00',
    amount: 25000,
    entityName: 'Tech Solutions Inc.'
  },
  {
    id: '4',
    type: 'extension_request',
    title: 'Extension request',
    description: '3 participants requested voting period extension',
    timestamp: '2023-06-12T15:30:00',
    entityName: 'Healthcare Ltd'
  }
];

class VotingService {
  async getVotingRequests(filters?: VotingFilters): Promise<VotingRequest[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let filtered = [...mockVotingRequests];
    
    if (filters?.status) {
      filtered = filtered.filter(req => req.status === filters.status);
    }
    
    if (filters?.entityName) {
      filtered = filtered.filter(req => 
        req.entityName.toLowerCase().includes(filters.entityName!.toLowerCase())
      );
    }
    
    if (filters?.search) {
      filtered = filtered.filter(req => 
        req.title.toLowerCase().includes(filters.search!.toLowerCase()) ||
        req.entityName.toLowerCase().includes(filters.search!.toLowerCase())
      );
    }
    
    return filtered;
  }

  async getVotingRequest(id: string): Promise<VotingRequest | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockVotingRequests.find(req => req.id === id) || null;
  }

  async getVotingStats(): Promise<VotingStats> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockStats;
  }

  async getRecentActivities(): Promise<VotingActivity[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockActivities;
  }

  async createVotingRequest(data: CreateVotingRequest): Promise<VotingRequest> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newRequest: VotingRequest = {
      id: `VR-${Date.now()}`,
      ...data,
      status: 'draft',
      progress: 0,
      totalParticipants: data.participants.length,
      votedParticipants: 0,
      totalResolutions: data.resolutions.length,
      passedResolutions: 0,
      amount: Math.floor(Math.random() * 50000) + 20000,
      dueDate: data.endDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      participants: data.participants.map((p, index) => ({
        ...p,
        id: `participant-${index + 1}`,
        hasVoted: false
      })),
      resolutions: data.resolutions.map((r, index) => ({
        ...r,
        id: `resolution-${index + 1}`,
        status: 'pending' as const,
        votes: [],
        currentSupport: 0
      }))
    };
    
    mockVotingRequests.unshift(newRequest);
    return newRequest;
  }

  async updateVotingRequest(id: string, data: Partial<VotingRequest>): Promise<VotingRequest> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const index = mockVotingRequests.findIndex(req => req.id === id);
    if (index === -1) {
      throw new Error('Voting request not found');
    }
    
    mockVotingRequests[index] = {
      ...mockVotingRequests[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return mockVotingRequests[index];
  }

  async deleteVotingRequest(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockVotingRequests.findIndex(req => req.id === id);
    if (index === -1) {
      throw new Error('Voting request not found');
    }
    
    mockVotingRequests.splice(index, 1);
  }

  async castVote(votingId: string, resolutionId: string, participantId: string, choice: VoteChoice): Promise<Vote> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const vote: Vote = {
      id: `vote-${Date.now()}`,
      participantId,
      resolutionId,
      choice,
      votedAt: new Date().toISOString(),
      isLocked: false
    };
    
    // Update mock data
    const votingRequest = mockVotingRequests.find(req => req.id === votingId);
    if (votingRequest) {
      const resolution = votingRequest.resolutions.find(r => r.id === resolutionId);
      if (resolution) {
        resolution.votes.push(vote);
      }
      
      const participant = votingRequest.participants.find(p => p.id === participantId);
      if (participant && !participant.hasVoted) {
        participant.hasVoted = true;
        participant.votedAt = vote.votedAt;
        votingRequest.votedParticipants++;
      }
    }
    
    return vote;
  }

  async requestExtension(votingId: string, reason: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Implementation for extension request
  }
}

export const votingService = new VotingService();
