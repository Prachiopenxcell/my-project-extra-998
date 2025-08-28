// Chat Service for Service Requests

import { 
  ChatThread, 
  ChatMessage, 
  ChatParticipant, 
  ChatStats, 
  ChatFilters, 
  ChatResponse,
  MessageType,
  MessageStatus,
  ChatParticipantRole,
  ChatThreadStatus,
  MessageAttachment,
  TypingIndicator,
  ChatNotification
} from '@/types/chat';

// Mock data for chat functionality
const mockParticipants: ChatParticipant[] = [
  {
    id: 'seeker-001',
    name: 'Rajesh Kumar',
    role: ChatParticipantRole.SERVICE_SEEKER,
    avatar: '/avatars/seeker-001.jpg',
    isOnline: true,
    lastSeen: new Date(),
    isAnonymous: false
  },
  {
    id: 'provider-001',
    name: 'Expert CA Services',
    role: ChatParticipantRole.SERVICE_PROVIDER,
    avatar: '/avatars/provider-001.jpg',
    isOnline: false,
    lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isAnonymous: true
  },
  {
    id: 'provider-002',
    name: 'Legal Solutions Ltd',
    role: ChatParticipantRole.SERVICE_PROVIDER,
    avatar: '/avatars/provider-002.jpg',
    isOnline: true,
    lastSeen: new Date(),
    isAnonymous: true
  },
  {
    id: 'system',
    name: 'System',
    role: ChatParticipantRole.SYSTEM,
    isOnline: true,
    lastSeen: new Date(),
    isAnonymous: false
  }
];

const mockMessages: ChatMessage[] = [
  {
    id: 'msg-001',
    threadId: 'thread-sr-001',
    senderId: 'system',
    senderName: 'System',
    senderRole: ChatParticipantRole.SYSTEM,
    message: 'Chat thread created for Service Request SRN20240001. All communications are monitored for quality and compliance.',
    type: MessageType.SYSTEM,
    status: MessageStatus.DELIVERED,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isPrivate: false,
    metadata: {
      systemAction: 'thread_created'
    }
  },
  {
    id: 'msg-002',
    threadId: 'thread-sr-001',
    senderId: 'seeker-001',
    senderName: 'Rajesh Kumar',
    senderRole: ChatParticipantRole.SERVICE_SEEKER,
    message: 'Hello, I have submitted a service request for company valuation. I would like to clarify a few requirements before you proceed with the bid.',
    type: MessageType.TEXT,
    status: MessageStatus.READ,
    timestamp: new Date(Date.now() - 90 * 60 * 1000), // 90 minutes ago
    isPrivate: false
  },
  {
    id: 'msg-003',
    threadId: 'thread-sr-001',
    senderId: 'provider-001',
    senderName: 'Expert CA Services',
    senderRole: ChatParticipantRole.SERVICE_PROVIDER,
    message: 'Thank you for reaching out. I have reviewed your service request. Could you please provide more details about the purpose of valuation and any specific compliance requirements?',
    type: MessageType.TEXT,
    status: MessageStatus.READ,
    timestamp: new Date(Date.now() - 75 * 60 * 1000), // 75 minutes ago
    isPrivate: false
  },
  {
    id: 'msg-004',
    threadId: 'thread-sr-001',
    senderId: 'seeker-001',
    senderName: 'Rajesh Kumar',
    senderRole: ChatParticipantRole.SERVICE_SEEKER,
    message: 'The valuation is required for merger proceedings under Companies Act 2013. We need the report within 15 days. I have attached the relevant documents.',
    type: MessageType.TEXT,
    status: MessageStatus.READ,
    timestamp: new Date(Date.now() - 60 * 60 * 1000), // 60 minutes ago
    isPrivate: false,
    attachments: [
      {
        id: 'att-001',
        name: 'Financial_Statements_2023.pdf',
        type: 'application/pdf',
        size: 2048576,
        url: '/documents/financial-statements-2023.pdf',
        uploadedAt: new Date(Date.now() - 60 * 60 * 1000)
      },
      {
        id: 'att-002',
        name: 'Board_Resolution.pdf',
        type: 'application/pdf',
        size: 512000,
        url: '/documents/board-resolution.pdf',
        uploadedAt: new Date(Date.now() - 60 * 60 * 1000)
      }
    ]
  },
  {
    id: 'msg-005',
    threadId: 'thread-sr-001',
    senderId: 'provider-001',
    senderName: 'Expert CA Services',
    senderRole: ChatParticipantRole.SERVICE_PROVIDER,
    message: 'Perfect! I can complete the valuation within the specified timeframe. Based on the documents and requirements, I will submit my bid shortly. The fee will be ₹80,000 including all compliance requirements.',
    type: MessageType.TEXT,
    status: MessageStatus.READ,
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    isPrivate: false
  },
  {
    id: 'msg-006',
    threadId: 'thread-sr-001',
    senderId: 'provider-002',
    senderName: 'Legal Solutions Ltd',
    senderRole: ChatParticipantRole.SERVICE_PROVIDER,
    message: 'I am also interested in this project. I have extensive experience in merger valuations. Can we discuss the scope in more detail?',
    type: MessageType.TEXT,
    status: MessageStatus.DELIVERED,
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    isPrivate: false
  },
  {
    id: 'msg-007',
    threadId: 'thread-sr-001',
    senderId: 'seeker-001',
    senderName: 'Rajesh Kumar',
    senderRole: ChatParticipantRole.SERVICE_SEEKER,
    message: 'Thank you both for your interest. I will review the bids once submitted and may have follow-up questions.',
    type: MessageType.TEXT,
    status: MessageStatus.SENT,
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    isPrivate: false
  }
];

const mockChatThreads: ChatThread[] = [
  {
    id: 'thread-sr-001',
    serviceRequestId: 'sr-001',
    bidId: 'bid-001',
    title: 'Company Valuation for Merger - SRN20240001',
    description: 'Discussion thread for company valuation service request',
    status: ChatThreadStatus.ACTIVE,
    participants: mockParticipants,
    messages: mockMessages,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000),
    lastMessageAt: new Date(Date.now() - 15 * 60 * 1000),
    unreadCount: {
      'seeker-001': 0,
      'provider-001': 1,
      'provider-002': 1
    },
    isModerated: true,
    metadata: {
      negotiationActive: false,
      queryResolved: false,
      escalated: false,
      priority: 'medium'
    }
  }
];

class ChatService {
  // Get chat threads for a service request
  getChatThreads = async (serviceRequestId: string, filters?: ChatFilters): Promise<ChatResponse> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    let threads = mockChatThreads.filter(thread => thread.serviceRequestId === serviceRequestId);
    
    // Apply filters
    if (filters) {
      if (filters.status && filters.status.length > 0) {
        threads = threads.filter(thread => filters.status!.includes(thread.status));
      }
      
      if (filters.hasUnread) {
        threads = threads.filter(thread => 
          Object.values(thread.unreadCount).some(count => count > 0)
        );
      }
      
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        threads = threads.filter(thread => 
          thread.title.toLowerCase().includes(query) ||
          thread.messages.some(msg => msg.message.toLowerCase().includes(query))
        );
      }
      
      if (filters.dateRange) {
        threads = threads.filter(thread => 
          thread.createdAt >= filters.dateRange!.from &&
          thread.createdAt <= filters.dateRange!.to
        );
      }
    }
    
    return {
      data: threads,
      total: threads.length,
      page: 1,
      limit: 10,
      totalPages: Math.ceil(threads.length / 10)
    };
  };

  // Get specific chat thread
  getChatThread = async (threadId: string): Promise<ChatThread | null> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const thread = mockChatThreads.find(t => t.id === threadId);
    return thread || null;
  };

  // Create new chat thread
  createChatThread = async (serviceRequestId: string, bidId?: string, title?: string): Promise<ChatThread> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newThread: ChatThread = {
      id: `thread-${Date.now()}`,
      serviceRequestId,
      bidId,
      title: title || `Chat for Service Request ${serviceRequestId}`,
      status: ChatThreadStatus.ACTIVE,
      participants: [mockParticipants[0], mockParticipants[3]], // Seeker and System
      messages: [
        {
          id: `msg-${Date.now()}`,
          threadId: `thread-${Date.now()}`,
          senderId: 'system',
          senderName: 'System',
          senderRole: ChatParticipantRole.SYSTEM,
          message: `Chat thread created for Service Request ${serviceRequestId}. All communications are monitored for quality and compliance. All messages are monitored for compliance. Do not share personal contact information. Violations may result in chat restrictions.`,
          type: MessageType.SYSTEM,
          status: MessageStatus.DELIVERED,
          timestamp: new Date(),
          isPrivate: false,
          metadata: {
            systemAction: 'thread_created'
          }
        }
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
      unreadCount: {},
      isModerated: true,
      metadata: {
        negotiationActive: false,
        queryResolved: false,
        escalated: false,
        priority: 'medium'
      }
    };
    
    mockChatThreads.push(newThread);
    return newThread;
  };

  // Send message
  sendMessage = async (
    threadId: string, 
    senderId: string, 
    message: string, 
    type: MessageType = MessageType.TEXT,
    attachments?: MessageAttachment[],
    isPrivate: boolean = false,
    recipientId?: string
  ): Promise<ChatMessage> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const thread = mockChatThreads.find(t => t.id === threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    
    const sender = thread.participants.find(p => p.id === senderId);
    if (!sender) {
      throw new Error('Sender not found in thread participants');
    }
    
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      threadId,
      senderId,
      senderName: sender.name,
      senderRole: sender.role,
      message,
      type,
      status: MessageStatus.SENT,
      timestamp: new Date(),
      isPrivate,
      recipientId,
      attachments
    };
    
    thread.messages.push(newMessage);
    thread.updatedAt = new Date();
    thread.lastMessageAt = new Date();
    
    // Update unread counts for other participants
    thread.participants.forEach(participant => {
      if (participant.id !== senderId) {
        thread.unreadCount[participant.id] = (thread.unreadCount[participant.id] || 0) + 1;
      }
    });
    
    return newMessage;
  };

  // Mark messages as read
  markAsRead = async (threadId: string, userId: string, messageIds?: string[]): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const thread = mockChatThreads.find(t => t.id === threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    
    // Reset unread count for user
    thread.unreadCount[userId] = 0;
    
    // Update message status to read if specific messages provided
    if (messageIds) {
      thread.messages.forEach(msg => {
        if (messageIds.includes(msg.id) && msg.senderId !== userId) {
          msg.status = MessageStatus.READ;
        }
      });
    }
  };

  // Add participant to thread
  addParticipant = async (threadId: string, participant: ChatParticipant): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const thread = mockChatThreads.find(t => t.id === threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    
    if (!thread.participants.find(p => p.id === participant.id)) {
      thread.participants.push(participant);
      thread.unreadCount[participant.id] = 0;
      
      // Add system message about participant joining
      const systemMessage: ChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        threadId,
        senderId: 'system',
        senderName: 'System',
        senderRole: ChatParticipantRole.SYSTEM,
        message: `${participant.name} joined the conversation`,
        type: MessageType.SYSTEM,
        status: MessageStatus.DELIVERED,
        timestamp: new Date(),
        isPrivate: false,
        metadata: {
          systemAction: 'participant_joined'
        }
      };
      
      thread.messages.push(systemMessage);
      thread.updatedAt = new Date();
    }
  };

  // Get chat statistics
  getChatStats = async (serviceRequestId?: string): Promise<ChatStats> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let threads = mockChatThreads;
    if (serviceRequestId) {
      threads = threads.filter(t => t.serviceRequestId === serviceRequestId);
    }
    
    const totalUnread = threads.reduce((sum, thread) => 
      sum + Object.values(thread.unreadCount).reduce((a, b) => a + b, 0), 0
    );
    
    return {
      totalThreads: threads.length,
      activeThreads: threads.filter(t => t.status === ChatThreadStatus.ACTIVE).length,
      unreadMessages: totalUnread,
      averageResponseTime: 45, // minutes
      resolvedQueries: threads.filter(t => t.metadata?.queryResolved).length,
      activeNegotiations: threads.filter(t => t.metadata?.negotiationActive).length
    };
  };

  // Upload file attachment
  uploadAttachment = async (file: File, threadId: string): Promise<MessageAttachment> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate upload
    
    return {
      id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      url: `/uploads/${threadId}/${file.name}`,
      uploadedAt: new Date()
    };
  };

  // Get typing indicators
  getTypingIndicators = async (threadId: string): Promise<TypingIndicator[]> => {
    // Mock typing indicators - in real implementation this would be via WebSocket
    return [];
  };

  // Set typing indicator
  setTyping = async (threadId: string, userId: string, userName: string): Promise<void> => {
    // Mock implementation - in real app this would emit via WebSocket
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  // Get notifications
  getNotifications = async (userId: string): Promise<ChatNotification[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Mock notifications
    return [
      {
        id: 'notif-001',
        userId,
        threadId: 'thread-sr-001',
        messageId: 'msg-007',
        type: 'new_message',
        title: 'New message in Company Valuation chat',
        content: 'Thank you both for your interest. I will review...',
        isRead: false,
        createdAt: new Date(Date.now() - 15 * 60 * 1000)
      }
    ];
  };
}

export const chatService = new ChatService();
export default chatService;
