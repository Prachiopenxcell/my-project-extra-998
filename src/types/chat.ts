// Chat Module Types for Service Requests

export enum MessageType {
  TEXT = 'text',
  FILE = 'file',
  SYSTEM = 'system',
  NEGOTIATION = 'negotiation',
  QUERY = 'query',
  CLARIFICATION = 'clarification'
}

export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed'
}

export enum ChatParticipantRole {
  SERVICE_SEEKER = 'service_seeker',
  SERVICE_PROVIDER = 'service_provider',
  SYSTEM = 'system',
  MODERATOR = 'moderator'
}

export enum ChatThreadStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
  SUSPENDED = 'suspended'
}

export interface ChatParticipant {
  id: string;
  name: string;
  role: ChatParticipantRole;
  avatar?: string;
  isOnline: boolean;
  lastSeen: Date;
  isAnonymous?: boolean;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface ChatMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  senderRole: ChatParticipantRole;
  message: string;
  type: MessageType;
  status: MessageStatus;
  timestamp: Date;
  editedAt?: Date;
  isPrivate: boolean;
  recipientId?: string;
  attachments?: MessageAttachment[];
  metadata?: {
    negotiationReason?: string;
    queryType?: string;
    systemAction?: string;
    originalMessageId?: string;
  };
  reactions?: {
    userId: string;
    emoji: string;
    timestamp: Date;
  }[];
}

export interface ChatThread {
  id: string;
  serviceRequestId: string;
  bidId?: string;
  title: string;
  description?: string;
  status: ChatThreadStatus;
  participants: ChatParticipant[];
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  lastMessageAt?: Date;
  unreadCount: { [userId: string]: number };
  isModerated: boolean;
  moderatorNotes?: string;
  metadata?: {
    negotiationActive?: boolean;
    queryResolved?: boolean;
    escalated?: boolean;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  };
}

export interface ChatStats {
  totalThreads: number;
  activeThreads: number;
  unreadMessages: number;
  averageResponseTime: number;
  resolvedQueries: number;
  activeNegotiations: number;
}

export interface ChatFilters {
  status?: ChatThreadStatus[];
  participantRole?: ChatParticipantRole[];
  messageType?: MessageType[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  hasUnread?: boolean;
  isModerated?: boolean;
  priority?: string[];
  searchQuery?: string;
}

export interface ChatNotification {
  id: string;
  userId: string;
  threadId: string;
  messageId: string;
  type: 'new_message' | 'mention' | 'thread_update' | 'system_alert';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
}

export interface TypingIndicator {
  userId: string;
  userName: string;
  threadId: string;
  timestamp: Date;
}

export interface ChatResponse {
  data: ChatThread[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
