// Professional Invitation Types for Service Request Module

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  isRegistered: boolean;
  specialization: string[];
  location: string;
  rating: number;
  totalReviews: number;
  completedProjects: number;
  responseTime: string;
  availability: 'available' | 'busy' | 'unavailable';
  lastActive: Date;
  experience: number; // years
  qualifications: string[];
  languages: string[];
  hourlyRate?: number;
  projectRate?: number;
  portfolioSummary?: string;
  isVerified: boolean;
  isPlatformSuggested?: boolean;
  isPastProfessional?: boolean;
  isChosenProfessional?: boolean;
}

export interface InvitationRequest {
  serviceRequestId: string;
  professionalIds: string[];
  customMessage?: string;
  deadline?: Date;
  invitedBy: string;
  invitationType: 'chosen' | 'past' | 'platform_suggested';
}

export interface ProfessionalInvitation {
  id: string;
  serviceRequestId: string;
  professionalId: string;
  professional: Professional;
  invitedBy: string;
  invitedAt: Date;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  customMessage?: string;
  deadline?: Date;
  respondedAt?: Date;
  invitationType: 'chosen' | 'past' | 'platform_suggested';
}

export interface ExternalInvitation {
  id: string;
  serviceRequestId: string;
  email: string;
  phone?: string;
  name?: string;
  invitedBy: string;
  invitedAt: Date;
  status: 'sent' | 'registered' | 'expired';
  registrationDeadline: Date;
  customMessage?: string;
  registrationToken?: string;
}

export interface ProfessionalFilters {
  specialization?: string[];
  location?: string[];
  rating?: number;
  availability?: string[];
  experience?: { min: number; max: number };
  hourlyRate?: { min: number; max: number };
  isVerified?: boolean;
  languages?: string[];
}

export interface ProfessionalInvitationStats {
  totalInvited: number;
  pendingResponses: number;
  acceptedInvitations: number;
  declinedInvitations: number;
  expiredInvitations: number;
  externalInvitationsSent: number;
  newRegistrations: number;
}

export interface ProfessionalSelectionCriteria {
  inviteChosenProfessionals: boolean;
  chosenProfessionalEmails: string[];
  chosenProfessionalPhones: string[];
  repeatPastProfessionals: boolean;
  selectedPastProfessionals: string[];
  maxPlatformSuggestions: number;
  platformSuggestedProfessionals: string[];
  customInvitationMessage: string;
  invitationDeadline?: Date;
}

export interface ProfessionalProfile {
  id: string;
  basicInfo: {
    name: string;
    profileImage?: string;
    location: string;
    experience: number;
    specialization: string[];
  };
  performance: {
    rating: number;
    totalReviews: number;
    completedProjects: number;
    responseTime: string;
    successRate: number;
  };
  availability: {
    status: 'available' | 'busy' | 'unavailable';
    nextAvailable?: Date;
    workingHours: string;
    timezone: string;
  };
  qualifications: {
    certifications: string[];
    education: string[];
    licenses: string[];
    memberships: string[];
  };
  portfolio: {
    summary: string;
    keyProjects: Array<{
      title: string;
      description: string;
      duration: string;
      clientType: string;
    }>;
    skills: string[];
    languages: string[];
  };
  pricing: {
    hourlyRate?: number;
    projectRate?: number;
    currency: string;
    negotiable: boolean;
  };
  maskedContactInfo: {
    emailDomain: string;
    phonePrefix: string;
    locationCity: string;
  };
}
