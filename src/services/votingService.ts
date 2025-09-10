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
    participants: [
      { id: '1', name: 'Alice Johnson', email: 'alice@techsolutions.com', mobile: '+1-555-0201', votingShare: 20, hasVoted: false },
      { id: '2', name: 'Bob Lee', email: 'bob@techsolutions.com', mobile: '+1-555-0202', votingShare: 30, hasVoted: false },
      { id: '3', name: 'Carlos Diaz', email: 'carlos@techsolutions.com', mobile: '+1-555-0203', votingShare: 25, hasVoted: false },
      { id: '4', name: 'Diana Prince', email: 'diana@techsolutions.com', mobile: '+1-555-0204', votingShare: 25, hasVoted: false }
    ],
    resolutions: [
      {
        id: '1',
        title: 'Approve Annual Financial Statements',
        description: 'Approval of audited financial statements for FY 2023.',
        minimumPassPercentage: 51,
        calculationBase: 'total_vote',
        status: 'pending',
        votes: [],
        currentSupport: 0
      },
      {
        id: '2',
        title: 'Reappoint Statutory Auditors',
        description: 'Reappointment of M/s XYZ & Co. as statutory auditors for FY 2024.',
        minimumPassPercentage: 66,
        calculationBase: 'votes_present',
        status: 'pending',
        votes: [],
        currentSupport: 0
      }
    ],
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
    participants: [
      { id: '1', name: 'Emma Stone', email: 'emma@healthcare.com', mobile: '+1-555-0301', votingShare: 40, hasVoted: false },
      { id: '2', name: 'Frank Ocean', email: 'frank@healthcare.com', mobile: '+1-555-0302', votingShare: 35, hasVoted: false },
      { id: '3', name: 'Grace Kim', email: 'grace@healthcare.com', mobile: '+1-555-0303', votingShare: 25, hasVoted: false }
    ],
    resolutions: [
      {
        id: '1',
        title: 'Approve Special Resolution A',
        description: 'Authorize management to proceed with Special Resolution A actions.',
        minimumPassPercentage: 66,
        calculationBase: 'votes_present',
        status: 'pending',
        votes: [],
        currentSupport: 0
      },
      {
        id: '2',
        title: 'Approve Special Resolution B',
        description: 'Approve changes required under Special Resolution B.',
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
      sendTo: 'non_voters_only',
      frequency: 'twice_daily',
      startBefore: 1
    }
  }
];

// Seed additional mock requests to match card counts for demo
(() => {
  const countBy = (status: VotingRequest['status']) => mockVotingRequests.filter(r => r.status === status).length;

  // Targets based on UI cards
  const targetInProgress = 3; // Ongoing
  const targetCompleted = 15; // Concluded
  const targetScheduled = 2;  // Upcoming

  const now = new Date();

  const makeBase = (idx: number) => ({
    meetingNumber: `2023-MTG-${String(idx).padStart(3, '0')}`,
    progress: 0,
    totalParticipants: 10 + (idx % 10),
    votedParticipants: Math.floor((idx % 10) / 2),
    totalResolutions: 3 + (idx % 3),
    passedResolutions: 0,
    amount: 20000 + (idx * 750),
    meetingType: 'board_meeting' as const,
    discreteVoting: idx % 2 === 0,
    allowExtensions: true,
    participants: [],
    resolutions: [],
    reminders: {
      sendSMS: idx % 2 === 0,
      sendEmail: true,
      sendTo: 'all_participants' as const,
      frequency: 'daily' as const,
      startBefore: 1
    }
  });

  const buildParticipants = (status: VotingRequest['status'], total: number, baseIdx: number) => {
    const participants = Array.from({ length: total }).map((_, i) => {
      const id = String(i + 1);
      const hasVoted = status === 'completed' ? true : status === 'in_progress' ? i % 2 === 0 : false;
      return {
        id,
        name: `Participant ${baseIdx}-${i + 1}`,
        email: `p${baseIdx}${i + 1}@demo.com`,
        mobile: `+1-555-01${String(i + 1).padStart(2, '0')}`,
        votingShare: Math.max(5, 100 / total),
        hasVoted,
        ...(hasVoted ? { votedAt: new Date(Date.now() - (i + 1) * 3600_000).toISOString() } : {})
      };
    });
    return participants;
  };

  const buildResolutions = (status: VotingRequest['status'], count: number, baseIdx: number, participants: { id: string }[]) => {
    const resolutions = Array.from({ length: count }).map((_, i) => {
      const rid = String(i + 1);
      const minimumPassPercentage = i % 2 === 0 ? 51 : 66;
      const calculationBase = i % 2 === 0 ? 'total_vote' as const : 'votes_present' as const;
      const votes = (status === 'completed' || status === 'in_progress')
        ? participants
            .filter((p, idx) => status === 'completed' ? true : idx % 2 === 0)
            .map((p, vi) => ({
              id: `vote-${baseIdx}-${rid}-${vi + 1}`,
              participantId: p.id,
              resolutionId: rid,
              choice: (vi % 5 === 0) ? 'abstain' as const : (vi % 3 === 0) ? 'disagree' as const : 'agree' as const,
              votedAt: new Date(Date.now() - (vi + 1) * 1800_000).toISOString(),
              isLocked: true
            }))
        : [];
      const currentSupport = votes.length ? Math.min(95, 60 + (i + baseIdx) % 35) : 0;
      return {
        id: rid,
        title: `Resolution ${i + 1}`,
        description: `Auto-generated resolution ${i + 1} for demo meeting ${baseIdx}.`,
        minimumPassPercentage,
        calculationBase,
        status: votes.length ? 'voted' as const : 'pending' as const,
        votes,
        currentSupport
      };
    });
    return resolutions;
  };

  // Ensure in_progress count
  for (let i = countBy('in_progress'); i < targetInProgress; i++) {
    const idx = i + 1;
    const start = new Date(now.getTime() - (idx + 1) * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() + (idx + 2) * 24 * 60 * 60 * 1000);
    const base = makeBase(idx);
    const totalParticipants = 12 + idx;
    const participants = buildParticipants('in_progress', totalParticipants, idx);
    const resolutions = buildResolutions('in_progress', 3 + (idx % 2), idx, participants);
    mockVotingRequests.push({
      ...base,
      id: `VR-ONGOING-${1000 + idx}`,
      title: `Ongoing Voting ${idx}`,
      entityName: `Demo Corp ${idx}`,
      status: 'in_progress',
      progress: 40 + (idx * 10) % 50,
      totalParticipants,
      votedParticipants: participants.filter(p => p.hasVoted).length,
      totalResolutions: resolutions.length,
      passedResolutions: Math.max(0, Math.min(resolutions.length, 1 + (idx % 2))),
      amount: 30000 + idx * 1000,
      dueDate: end.toISOString().slice(0, 10),
      createdAt: new Date(now.getTime() - (idx + 3) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      updatedAt: now.toISOString(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      participants,
      resolutions
    });
  }

  // Ensure completed count
  for (let i = countBy('completed'); i < targetCompleted; i++) {
    const idx = i + 1;
    const start = new Date(now.getTime() - (30 + idx) * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() - (25 + idx) * 24 * 60 * 60 * 1000);
    const totalRes = 3 + (idx % 3);
    const baseC = makeBase(50 + idx);
    const totalParticipantsC = 10 + (idx % 10);
    const participantsC = buildParticipants('completed', totalParticipantsC, 50 + idx);
    const resolutionsC = buildResolutions('completed', totalRes, 50 + idx, participantsC);
    mockVotingRequests.push({
      ...baseC,
      id: `VR-COMP-${1000 + idx}`,
      title: `Completed Voting ${idx}`,
      entityName: `Acme Subsidiary ${idx}`,
      status: 'completed',
      progress: 100,
      totalParticipants: totalParticipantsC,
      votedParticipants: totalParticipantsC,
      totalResolutions: resolutionsC.length,
      passedResolutions: Math.max(1, resolutionsC.length - (idx % 2)),
      amount: 25000 + idx * 500,
      dueDate: end.toISOString().slice(0, 10),
      createdAt: start.toISOString().slice(0, 10),
      updatedAt: end.toISOString(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      participants: participantsC,
      resolutions: resolutionsC
    });
  }

  // Ensure scheduled count
  for (let i = countBy('scheduled'); i < targetScheduled; i++) {
    const idx = i + 1;
    const start = new Date(now.getTime() + (7 + idx) * 24 * 60 * 60 * 1000);
    const end = new Date(now.getTime() + (10 + idx) * 24 * 60 * 60 * 1000);
    const baseS = makeBase(100 + idx);
    const totalParticipantsS = 20 + idx;
    const participantsS = buildParticipants('scheduled', totalParticipantsS, 100 + idx);
    const resolutionsS = buildResolutions('scheduled', 5, 100 + idx, participantsS);
    mockVotingRequests.push({
      ...baseS,
      id: `VR-UPCOMING-${1000 + idx}`,
      title: `Upcoming Voting ${idx}`,
      entityName: `Futura Ltd ${idx}`,
      status: 'scheduled',
      progress: 0,
      totalParticipants: totalParticipantsS,
      votedParticipants: 0,
      totalResolutions: resolutionsS.length,
      passedResolutions: 0,
      amount: 42000 + idx * 1200,
      dueDate: end.toISOString().slice(0, 10),
      createdAt: now.toISOString().slice(0, 10),
      updatedAt: now.toISOString(),
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      participants: participantsS,
      resolutions: resolutionsS
    });
  }
})();

const mockStats: VotingStats = {
  activeVotings: 3,
  completedVotings: 15,
  scheduledVotings: 2,
  inProgressVotings: 3,
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

  // --- MoM parsing (mock) ---
  /**
   * Extract resolutions from an uploaded MoM file. This is a mock/demo implementation:
   * - If a .txt file is provided, it attempts basic line parsing for sentences that look like resolutions
   *   (lines starting with "Resolved that", "Resolution:", or bullets).
   * - For .pdf/.doc/.docx, performs a simulated extraction returning a few reasonable placeholders.
   *
   * Returns minimal resolution objects suitable for CreateVotingRequest (without ids/status/votes).
   */
  async extractResolutionsFromMoM(file: File): Promise<Array<{
    title: string;
    description: string;
    minimumPassPercentage: number;
    calculationBase: 'total_vote' | 'votes_present';
  }>> {
    // Simulate latency
    await new Promise(resolve => setTimeout(resolve, 500));

    const name = (file?.name || '').toLowerCase();
    const ext = name.split('.').pop() || '';

    // Helper to convert candidate lines into resolution items
    const toResolutions = (lines: string[]): Array<{
      title: string;
      description: string;
      minimumPassPercentage: number;
      calculationBase: 'total_vote' | 'votes_present';
    }> => {
      const candidates = lines
        .map(l => l.trim())
        .filter(Boolean)
        .filter(l => /^(resolved that|resolution:|item\s*\d+\s*:|-\s+|\d+\.|\*)/i.test(l));

      if (candidates.length === 0) {
        return [
          {
            title: 'Approval of agenda items',
            description: 'Resolved that the agenda items discussed in the meeting are approved for e-voting.',
            minimumPassPercentage: 51,
            calculationBase: 'total_vote' as const,
          }
        ];
      }

      return candidates.slice(0, 5).map((text, i) => ({
        title: normalizeTitle(text, i + 1),
        description: stripPrefix(text),
        minimumPassPercentage: inferThreshold(text),
        calculationBase: /present|those present/i.test(text) ? 'votes_present' : 'total_vote',
      }));
    };

    // Attempt plain text parsing for .txt
    if (ext === 'txt') {
      try {
        const content = await file.text();
        const lines = content.split(/\r?\n/);
        return toResolutions(lines);
      } catch {
        // fallthrough to simulated
      }
    }

    // For unsupported in-browser formats (pdf/doc/docx), return simulated suggestions
    return [
      {
        title: 'Adoption of Minutes of Meeting',
        description: 'Resolved that the minutes of the previous meeting as circulated be and are hereby adopted.',
        minimumPassPercentage: 51,
        calculationBase: 'total_vote',
      },
      {
        title: 'Appointment/Confirmation of Auditor',
        description: 'Resolved that the statutory auditor be appointed/confirmed for the ensuing financial year.',
        minimumPassPercentage: 66,
        calculationBase: 'votes_present',
      },
      {
        title: 'Authorization for Compliance Filings',
        description: 'Resolved that the Company Secretary is authorized to make necessary filings and submissions.',
        minimumPassPercentage: 51,
        calculationBase: 'total_vote',
      },
    ];

    // --- helpers ---
    function stripPrefix(s: string) {
      return s.replace(/^\s*(resolved that\s*:?)\s*/i, '')
              .replace(/^\s*(resolution\s*:?)\s*/i, '')
              .replace(/^\s*item\s*\d+\s*:\s*/i, '')
              .replace(/^\s*(-|\*|\d+\.)\s*/i, '')
              .trim();
    }

    function normalizeTitle(s: string, idx: number) {
      const core = stripPrefix(s);
      // Use the first 90 chars as title, fallback to generic label
      const t = core.split(/\.|;|\n/)[0]?.trim() || `Resolution ${idx}`;
      return t.length > 90 ? t.slice(0, 87) + '…' : t;
    }

    function inferThreshold(s: string) {
      if (/special resolution|two\s*thirds|2\/3|66%|66\.6|66\.67/i.test(s)) return 66;
      if (/unanimous|100%/i.test(s)) return 100;
      if (/simple majority|majority/i.test(s)) return 51;
      const m = s.match(/(\d{2,3})\s*%/);
      if (m) return Math.min(100, Math.max(1, parseInt(m[1], 10)));
      return 51;
    }
  }
}

export const votingService = new VotingService();
