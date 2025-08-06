export type MeetingStatus = 'upcoming' | 'in-progress' | 'completed' | 'draft';

export type MeetingType = 'board' | 'committee' | 'general' | 'special' | 'other';

export interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  organization?: string;
  avatar?: string;
  isVoting: boolean;
  isPresent?: boolean;
  isMuted?: boolean;
  hasRaisedHand?: boolean;
  videoEnabled?: boolean;
  status?: 'pending' | 'accepted' | 'declined';
}

// Type aliases for better semantic meaning
export type MeetingParticipant = Participant;
export type MeetingDocument = Document;
export type MeetingAgendaItem = AgendaItem;

export interface AgendaItem {
  id: string;
  title: string;
  description?: string;
  presenter?: string;
  duration: number; // in minutes
  status: 'pending' | 'current' | 'completed';
  notes?: string;
}

export interface Resolution {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'passed' | 'rejected';
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  requiredMajority: number; // percentage required to pass
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedBy: string;
  uploadedAt: Date;
  url: string;
}

export interface ChatMessage {
  id: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  message: string;
  timestamp: Date;
  isPrivate?: boolean;
  recipientId?: string;
}

export interface OfficeBearers {
  chairperson?: Participant;
  secretary?: Participant;
  treasurer?: Participant;
  viceChairperson?: Participant;
  additionalRoles?: {
    role: string;
    person: Participant;
  }[];
}

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  status: MeetingStatus;
  entity: {
    id: string;
    name: string;
    cin?: string;
    type?: string;
  };
  startDate: Date;
  endDate?: Date;
  duration?: number; // in minutes
  location?: string;
  isVirtual: boolean;
  virtualMeetingLink?: string;
  virtualMeetingId?: string;
  virtualMeetingPassword?: string;
  description?: string;
  participants: Participant[];
  agenda: AgendaItem[];
  documents: Document[];
  resolutions?: Resolution[];
  officeBearers?: OfficeBearers;
  createdBy: string;
  createdAt: Date;
  updatedAt?: Date;
  currentAgendaItem?: string; // ID of current agenda item
  isRecording?: boolean;
  recordingStartTime?: Date;
  chatMessages?: ChatMessage[];
}

export interface MeetingStats {
  upcoming: number;
  inProgress: number;
  completed: number;
  draft: number;
}

export interface MeetingActivity {
  id: string;
  meetingId: string;
  meetingTitle: string;
  action: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
}
