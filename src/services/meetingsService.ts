import { 
  Meeting, 
  MeetingStats, 
  MeetingActivity, 
  Participant, 
  AgendaItem, 
  Document, 
  Resolution, 
  ChatMessage,
  MeetingType,
  MeetingStatus
} from '@/types/meetings';

// Mock data for meetings
const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Director',
    organization: 'ABC Corp',
    avatar: '/avatars/john-doe.png',
    isVoting: true,
    isPresent: true,
    isMuted: false,
    hasRaisedHand: false,
    videoEnabled: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'CEO',
    organization: 'ABC Corp',
    avatar: '/avatars/jane-smith.png',
    isVoting: true,
    isPresent: true,
    isMuted: true,
    hasRaisedHand: false,
    videoEnabled: true
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    role: 'CFO',
    organization: 'ABC Corp',
    avatar: '/avatars/robert-johnson.png',
    isVoting: true,
    isPresent: true,
    isMuted: false,
    hasRaisedHand: true,
    videoEnabled: true
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'COO',
    organization: 'ABC Corp',
    avatar: '/avatars/emily-davis.png',
    isVoting: true,
    isPresent: false,
    isMuted: false,
    hasRaisedHand: false,
    videoEnabled: false
  },
  {
    id: '5',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    role: 'Director',
    organization: 'ABC Corp',
    avatar: '/avatars/michael-wilson.png',
    isVoting: true,
    isPresent: true,
    isMuted: true,
    hasRaisedHand: false,
    videoEnabled: false
  },
  {
    id: '6',
    name: 'Sarah Brown',
    email: 'sarah.brown@example.com',
    role: 'Legal Counsel',
    organization: 'Legal Firm LLP',
    avatar: '/avatars/sarah-brown.png',
    isVoting: false,
    isPresent: true,
    isMuted: false,
    hasRaisedHand: false,
    videoEnabled: true
  },
  {
    id: '7',
    name: 'David Miller',
    email: 'david.miller@example.com',
    role: 'Secretary',
    organization: 'ABC Corp',
    avatar: '/avatars/david-miller.png',
    isVoting: false,
    isPresent: true,
    isMuted: false,
    hasRaisedHand: false,
    videoEnabled: true
  }
];

const mockAgendaItems: AgendaItem[] = [
  {
    id: '1',
    title: 'Approval of Previous Minutes',
    description: 'Review and approve minutes from the previous board meeting held on March 15, 2023',
    presenter: 'David Miller',
    duration: 10,
    status: 'completed'
  },
  {
    id: '2',
    title: 'Q2 Financial Report',
    description: 'Presentation of Q2 financial results and discussion',
    presenter: 'Robert Johnson',
    duration: 30,
    status: 'current'
  },
  {
    id: '3',
    title: 'Strategic Plan Update',
    description: 'Progress update on the 5-year strategic plan implementation',
    presenter: 'Jane Smith',
    duration: 25,
    status: 'pending'
  },
  {
    id: '4',
    title: 'New Product Launch Discussion',
    description: 'Discussion on the upcoming product launch scheduled for Q3',
    presenter: 'Emily Davis',
    duration: 20,
    status: 'pending'
  },
  {
    id: '5',
    title: 'Any Other Business',
    description: 'Discussion of any other business items',
    presenter: 'John Doe',
    duration: 15,
    status: 'pending'
  }
];

const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Q2 Financial Report.pdf',
    type: 'PDF',
    size: '2.4 MB',
    uploadedBy: 'Robert Johnson',
    uploadedAt: new Date('2023-06-10T14:30:00'),
    url: '/documents/q2-financial-report.pdf'
  },
  {
    id: '2',
    name: 'Previous Meeting Minutes.docx',
    type: 'DOCX',
    size: '1.2 MB',
    uploadedBy: 'David Miller',
    uploadedAt: new Date('2023-06-09T10:15:00'),
    url: '/documents/previous-meeting-minutes.docx'
  },
  {
    id: '3',
    name: 'Strategic Plan Update.pptx',
    type: 'PPTX',
    size: '5.7 MB',
    uploadedBy: 'Jane Smith',
    uploadedAt: new Date('2023-06-11T09:45:00'),
    url: '/documents/strategic-plan-update.pptx'
  },
  {
    id: '4',
    name: 'New Product Specs.xlsx',
    type: 'XLSX',
    size: '3.1 MB',
    uploadedBy: 'Emily Davis',
    uploadedAt: new Date('2023-06-11T16:20:00'),
    url: '/documents/new-product-specs.xlsx'
  }
];

const mockResolutions: Resolution[] = [
  {
    id: '1',
    title: 'Approval of Q1 Financial Statements',
    description: 'Resolution to approve the Q1 financial statements as presented',
    status: 'passed',
    votesFor: 5,
    votesAgainst: 0,
    votesAbstain: 0,
    requiredMajority: 50
  },
  {
    id: '2',
    title: 'Dividend Declaration',
    description: 'Resolution to declare a dividend of $0.25 per share payable on July 15, 2023',
    status: 'in-progress',
    votesFor: 3,
    votesAgainst: 1,
    votesAbstain: 1,
    requiredMajority: 50
  },
  {
    id: '3',
    title: 'Appointment of External Auditor',
    description: 'Resolution to appoint XYZ Accounting as the external auditor for the fiscal year 2023',
    status: 'pending',
    votesFor: 0,
    votesAgainst: 0,
    votesAbstain: 0,
    requiredMajority: 50
  }
];

const mockChatMessages: ChatMessage[] = [
  {
    id: '1',
    sender: {
      id: '1',
      name: 'John Doe',
      avatar: '/avatars/john-doe.png'
    },
    message: 'Welcome everyone to our Q2 board meeting.',
    timestamp: new Date('2023-06-15T10:00:00')
  },
  {
    id: '2',
    sender: {
      id: '2',
      name: 'Jane Smith',
      avatar: '/avatars/jane-smith.png'
    },
    message: 'Thanks John. Looking forward to the financial report.',
    timestamp: new Date('2023-06-15T10:01:30')
  },
  {
    id: '3',
    sender: {
      id: '3',
      name: 'Robert Johnson',
      avatar: '/avatars/robert-johnson.png'
    },
    message: 'I have prepared a detailed presentation on our Q2 performance.',
    timestamp: new Date('2023-06-15T10:03:15')
  },
  {
    id: '4',
    sender: {
      id: '6',
      name: 'Sarah Brown',
      avatar: '/avatars/sarah-brown.png'
    },
    message: 'I have a question about the regulatory compliance section when we get there.',
    timestamp: new Date('2023-06-15T10:05:45')
  },
  {
    id: '5',
    sender: {
      id: '5',
      name: 'Michael Wilson',
      avatar: '/avatars/michael-wilson.png'
    },
    message: 'Sorry for joining late. Had some technical issues.',
    timestamp: new Date('2023-06-15T10:08:20')
  }
];

// Generate mock meetings data
const generateMockMeetings = (): Meeting[] => {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  
  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  
  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 7);
  
  const twoWeeksAgo = new Date(now);
  twoWeeksAgo.setDate(now.getDate() - 14);

  return [
    {
      id: '1',
      title: 'Q2 Board Meeting',
      type: 'board',
      status: 'in-progress',
      entity: {
        id: '1',
        name: 'ABC Corporation'
      },
      startDate: now,
      duration: 120,
      isVirtual: true,
      virtualMeetingLink: 'https://meeting.example.com/q2board',
      virtualMeetingId: '123456789',
      virtualMeetingPassword: 'board123',
      description: 'Quarterly board meeting to review Q2 performance and strategic initiatives',
      participants: mockParticipants,
      agenda: mockAgendaItems,
      documents: mockDocuments,
      resolutions: mockResolutions,
      createdBy: 'John Doe',
      createdAt: lastWeek,
      currentAgendaItem: '2',
      isRecording: true,
      recordingStartTime: now,
      chatMessages: mockChatMessages,
      officeBearers: {
        chairperson: mockParticipants[0],
        secretary: mockParticipants[6],
        treasurer: mockParticipants[2]
      }
    },
    {
      id: '2',
      title: 'Annual General Meeting',
      type: 'general',
      status: 'upcoming',
      entity: {
        id: '1',
        name: 'ABC Corporation'
      },
      startDate: nextWeek,
      duration: 180,
      isVirtual: true,
      virtualMeetingLink: 'https://meeting.example.com/agm2023',
      virtualMeetingId: '987654321',
      virtualMeetingPassword: 'agm2023',
      description: 'Annual General Meeting for shareholders to review annual performance and elect directors',
      participants: mockParticipants.slice(0, 5),
      agenda: mockAgendaItems.slice(0, 3),
      documents: mockDocuments.slice(0, 2),
      createdBy: 'John Doe',
      createdAt: yesterday,
      officeBearers: {
        chairperson: mockParticipants[0],
        secretary: mockParticipants[6]
      }
    },
    {
      id: '3',
      title: 'Executive Committee Meeting',
      type: 'committee',
      status: 'completed',
      entity: {
        id: '1',
        name: 'ABC Corporation'
      },
      startDate: lastWeek,
      endDate: lastWeek,
      duration: 90,
      isVirtual: false,
      location: 'Conference Room A, Headquarters',
      description: 'Monthly executive committee meeting to discuss operational matters',
      participants: mockParticipants.slice(0, 4),
      agenda: mockAgendaItems.slice(1, 4),
      documents: mockDocuments.slice(1, 3),
      resolutions: mockResolutions.slice(0, 1),
      createdBy: 'Jane Smith',
      createdAt: twoWeeksAgo,
      updatedAt: lastWeek,
      officeBearers: {
        chairperson: mockParticipants[1]
      }
    },
    {
      id: '4',
      title: 'Special Meeting - Acquisition Discussion',
      type: 'special',
      status: 'upcoming',
      entity: {
        id: '1',
        name: 'ABC Corporation'
      },
      startDate: tomorrow,
      duration: 60,
      isVirtual: true,
      virtualMeetingLink: 'https://meeting.example.com/special-acq',
      virtualMeetingId: '555666777',
      virtualMeetingPassword: 'acq2023',
      description: 'Special meeting to discuss potential acquisition of XYZ Company',
      participants: mockParticipants.slice(0, 6),
      agenda: [
        {
          id: 'special1',
          title: 'Acquisition Overview',
          description: 'Presentation of the acquisition target and strategic fit',
          presenter: 'Jane Smith',
          duration: 20,
          status: 'pending'
        },
        {
          id: 'special2',
          title: 'Financial Analysis',
          description: 'Review of financial implications and valuation',
          presenter: 'Robert Johnson',
          duration: 20,
          status: 'pending'
        },
        {
          id: 'special3',
          title: 'Next Steps',
          description: 'Discussion of due diligence process and timeline',
          presenter: 'John Doe',
          duration: 20,
          status: 'pending'
        }
      ],
      documents: mockDocuments.slice(2, 4),
      createdBy: 'John Doe',
      createdAt: yesterday,
      officeBearers: {
        chairperson: mockParticipants[0]
      }
    },
    {
      id: '5',
      title: 'Draft Meeting - Strategy Review',
      type: 'board',
      status: 'draft',
      entity: {
        id: '1',
        name: 'ABC Corporation'
      },
      startDate: nextWeek,
      duration: 120,
      isVirtual: true,
      description: 'Draft meeting to review and update company strategy',
      participants: mockParticipants.slice(0, 3),
      agenda: mockAgendaItems.slice(2, 4),
      documents: [],
      createdBy: 'Jane Smith',
      createdAt: yesterday,
      officeBearers: {
        chairperson: mockParticipants[1]
      }
    }
  ];
};

// Mock meetings data
let mockMeetings = generateMockMeetings();

// Mock meeting activities
const generateMockActivities = (): MeetingActivity[] => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
  const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
  
  return [
    {
      id: '1',
      meetingId: '1',
      meetingTitle: 'Q2 Board Meeting',
      action: 'started the meeting',
      user: {
        id: '1',
        name: 'John Doe',
        avatar: '/avatars/john-doe.png'
      },
      timestamp: now
    },
    {
      id: '2',
      meetingId: '2',
      meetingTitle: 'Annual General Meeting',
      action: 'created the meeting',
      user: {
        id: '1',
        name: 'John Doe',
        avatar: '/avatars/john-doe.png'
      },
      timestamp: oneHourAgo
    },
    {
      id: '3',
      meetingId: '3',
      meetingTitle: 'Executive Committee Meeting',
      action: 'uploaded meeting minutes',
      user: {
        id: '6',
        name: 'Sarah Brown',
        avatar: '/avatars/sarah-brown.png'
      },
      timestamp: twoHoursAgo
    },
    {
      id: '4',
      meetingId: '4',
      meetingTitle: 'Special Meeting - Acquisition Discussion',
      action: 'added 3 participants',
      user: {
        id: '2',
        name: 'Jane Smith',
        avatar: '/avatars/jane-smith.png'
      },
      timestamp: threeHoursAgo
    },
    {
      id: '5',
      meetingId: '5',
      meetingTitle: 'Draft Meeting - Strategy Review',
      action: 'updated agenda items',
      user: {
        id: '2',
        name: 'Jane Smith',
        avatar: '/avatars/jane-smith.png'
      },
      timestamp: fourHoursAgo
    }
  ];
};

// Mock meeting activities
const mockActivities = generateMockActivities();

// Service functions
export const meetingsService = {
  // Get all meetings
  getAllMeetings: async (): Promise<Meeting[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockMeetings);
      }, 500);
    });
  },

  // Get meeting by ID
  getMeetingById: async (id: string): Promise<Meeting | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const meeting = mockMeetings.find(m => m.id === id);
        resolve(meeting);
      }, 300);
    });
  },

  // Get meetings by status
  getMeetingsByStatus: async (status: MeetingStatus): Promise<Meeting[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredMeetings = mockMeetings.filter(m => m.status === status);
        resolve(filteredMeetings);
      }, 300);
    });
  },

  // Get meetings by type
  getMeetingsByType: async (type: MeetingType): Promise<Meeting[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filteredMeetings = mockMeetings.filter(m => m.type === type);
        resolve(filteredMeetings);
      }, 300);
    });
  },

  // Get meeting stats
  getMeetingStats: async (): Promise<MeetingStats> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats: MeetingStats = {
          upcoming: mockMeetings.filter(m => m.status === 'upcoming').length,
          inProgress: mockMeetings.filter(m => m.status === 'in-progress').length,
          completed: mockMeetings.filter(m => m.status === 'completed').length,
          draft: mockMeetings.filter(m => m.status === 'draft').length
        };
        resolve(stats);
      }, 200);
    });
  },

  // Get recent meeting activities
  getRecentActivities: async (limit: number = 5): Promise<MeetingActivity[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sortedActivities = [...mockActivities].sort(
          (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
        );
        resolve(sortedActivities.slice(0, limit));
      }, 200);
    });
  },

  // Create a new meeting
  createMeeting: async (meeting: Omit<Meeting, 'id' | 'createdAt'>): Promise<Meeting> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMeeting: Meeting = {
          ...meeting,
          id: `${mockMeetings.length + 1}`,
          createdAt: new Date()
        };
        mockMeetings = [...mockMeetings, newMeeting];
        resolve(newMeeting);
      }, 700);
    });
  },

  // Update an existing meeting
  updateMeeting: async (id: string, meeting: Partial<Meeting>): Promise<Meeting | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockMeetings.findIndex(m => m.id === id);
        if (index !== -1) {
          mockMeetings[index] = {
            ...mockMeetings[index],
            ...meeting,
            updatedAt: new Date()
          };
          resolve(mockMeetings[index]);
        } else {
          resolve(undefined);
        }
      }, 700);
    });
  },

  // Delete a meeting
  deleteMeeting: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const initialLength = mockMeetings.length;
        mockMeetings = mockMeetings.filter(m => m.id !== id);
        resolve(mockMeetings.length < initialLength);
      }, 500);
    });
  },

  // Add participant to meeting
  addParticipant: async (meetingId: string, participant: Omit<Participant, 'id'>): Promise<Participant | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
        if (meetingIndex !== -1) {
          const newParticipant: Participant = {
            ...participant,
            id: `p${mockMeetings[meetingIndex].participants.length + 1}`
          };
          mockMeetings[meetingIndex].participants = [
            ...mockMeetings[meetingIndex].participants,
            newParticipant
          ];
          mockMeetings[meetingIndex].updatedAt = new Date();
          resolve(newParticipant);
        } else {
          resolve(undefined);
        }
      }, 400);
    });
  },

  // Remove participant from meeting
  removeParticipant: async (meetingId: string, participantId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
        if (meetingIndex !== -1) {
          const initialLength = mockMeetings[meetingIndex].participants.length;
          mockMeetings[meetingIndex].participants = mockMeetings[meetingIndex].participants.filter(
            p => p.id !== participantId
          );
          mockMeetings[meetingIndex].updatedAt = new Date();
          resolve(mockMeetings[meetingIndex].participants.length < initialLength);
        } else {
          resolve(false);
        }
      }, 400);
    });
  },

  // Add agenda item to meeting
  addAgendaItem: async (meetingId: string, agendaItem: Omit<AgendaItem, 'id'>): Promise<AgendaItem | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
        if (meetingIndex !== -1) {
          const newAgendaItem: AgendaItem = {
            ...agendaItem,
            id: `a${mockMeetings[meetingIndex].agenda.length + 1}`
          };
          mockMeetings[meetingIndex].agenda = [
            ...mockMeetings[meetingIndex].agenda,
            newAgendaItem
          ];
          mockMeetings[meetingIndex].updatedAt = new Date();
          resolve(newAgendaItem);
        } else {
          resolve(undefined);
        }
      }, 400);
    });
  },

  // Add document to meeting
  addDocument: async (meetingId: string, document: Omit<Document, 'id'>): Promise<Document | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
        if (meetingIndex !== -1) {
          const newDocument: Document = {
            ...document,
            id: `d${mockMeetings[meetingIndex].documents.length + 1}`
          };
          mockMeetings[meetingIndex].documents = [
            ...mockMeetings[meetingIndex].documents,
            newDocument
          ];
          mockMeetings[meetingIndex].updatedAt = new Date();
          resolve(newDocument);
        } else {
          resolve(undefined);
        }
      }, 400);
    });
  },

  // Add chat message to meeting
  addChatMessage: async (meetingId: string, message: Omit<ChatMessage, 'id'>): Promise<ChatMessage | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
        if (meetingIndex !== -1) {
          if (!mockMeetings[meetingIndex].chatMessages) {
            mockMeetings[meetingIndex].chatMessages = [];
          }
          
          const newMessage: ChatMessage = {
            ...message,
            id: `m${(mockMeetings[meetingIndex].chatMessages?.length || 0) + 1}`
          };
          
          mockMeetings[meetingIndex].chatMessages = [
            ...(mockMeetings[meetingIndex].chatMessages || []),
            newMessage
          ];
          
          resolve(newMessage);
        } else {
          resolve(undefined);
        }
      }, 200);
    });
  },

  // Update meeting status
  updateMeetingStatus: async (meetingId: string, status: MeetingStatus): Promise<Meeting | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
        if (meetingIndex !== -1) {
          mockMeetings[meetingIndex].status = status;
          mockMeetings[meetingIndex].updatedAt = new Date();
          
          // If status is 'in-progress', set start date to now
          if (status === 'in-progress') {
            mockMeetings[meetingIndex].startDate = new Date();
          }
          
          // If status is 'completed', set end date to now
          if (status === 'completed') {
            mockMeetings[meetingIndex].endDate = new Date();
          }
          
          resolve(mockMeetings[meetingIndex]);
        } else {
          resolve(undefined);
        }
      }, 300);
    });
  },

  // Update current agenda item
  updateCurrentAgendaItem: async (meetingId: string, agendaItemId: string): Promise<Meeting | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
        if (meetingIndex !== -1) {
          // Update current agenda item
          mockMeetings[meetingIndex].currentAgendaItem = agendaItemId;
          
          // Update agenda item statuses
          mockMeetings[meetingIndex].agenda = mockMeetings[meetingIndex].agenda.map(item => {
            if (item.id === agendaItemId) {
              return { ...item, status: 'current' };
            } else if (item.status === 'current') {
              return { ...item, status: 'completed' };
            } else {
              return item;
            }
          });
          
          mockMeetings[meetingIndex].updatedAt = new Date();
          resolve(mockMeetings[meetingIndex]);
        } else {
          resolve(undefined);
        }
      }, 300);
    });
  },

  // Toggle recording status
  toggleRecording: async (meetingId: string): Promise<Meeting | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const meetingIndex = mockMeetings.findIndex(m => m.id === meetingId);
        if (meetingIndex !== -1) {
          const isRecording = !mockMeetings[meetingIndex].isRecording;
          mockMeetings[meetingIndex].isRecording = isRecording;
          
          if (isRecording) {
            mockMeetings[meetingIndex].recordingStartTime = new Date();
          } else {
            mockMeetings[meetingIndex].recordingStartTime = undefined;
          }
          
          resolve(mockMeetings[meetingIndex]);
        } else {
          resolve(undefined);
        }
      }, 200);
    });
  }
};
