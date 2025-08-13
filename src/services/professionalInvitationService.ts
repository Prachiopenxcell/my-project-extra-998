// Professional Invitation Service for Service Request Module

import {
  Professional,
  ProfessionalInvitation,
  ExternalInvitation,
  InvitationRequest,
  ProfessionalFilters,
  ProfessionalInvitationStats,
  ProfessionalSelectionCriteria,
  ProfessionalProfile
} from '@/types/professionalInvitation';

// Mock data for professionals
const mockProfessionals: Professional[] = [
  {
    id: 'prof-001',
    name: 'Advocate Rajesh Kumar',
    email: 'rajesh.kumar@lawfirm.com',
    phone: '+91-9876543210',
    profileImage: '/api/placeholder/64/64',
    isRegistered: true,
    specialization: ['Corporate Law', 'Contract Law', 'Compliance'],
    location: 'Mumbai, Maharashtra',
    rating: 4.8,
    totalReviews: 156,
    completedProjects: 89,
    responseTime: '2 hours',
    availability: 'available',
    lastActive: new Date('2024-01-13T10:30:00'),
    experience: 12,
    qualifications: ['LLB', 'LLM Corporate Law', 'Company Secretary'],
    languages: ['English', 'Hindi', 'Marathi'],
    hourlyRate: 2500,
    projectRate: 75000,
    portfolioSummary: 'Specialized in corporate law with extensive experience in mergers, acquisitions, and regulatory compliance.',
    isVerified: true,
    isPlatformSuggested: true
  },
  {
    id: 'prof-002',
    name: 'CA Priya Sharma',
    email: 'priya.sharma@caoffice.com',
    phone: '+91-9876543211',
    profileImage: '/api/placeholder/64/64',
    isRegistered: true,
    specialization: ['Taxation', 'Audit', 'Financial Advisory'],
    location: 'Delhi, NCR',
    rating: 4.9,
    totalReviews: 203,
    completedProjects: 145,
    responseTime: '1 hour',
    availability: 'available',
    lastActive: new Date('2024-01-13T09:15:00'),
    experience: 8,
    qualifications: ['CA', 'CPA', 'MBA Finance'],
    languages: ['English', 'Hindi', 'Punjabi'],
    hourlyRate: 2000,
    projectRate: 50000,
    portfolioSummary: 'Expert in taxation and financial advisory with proven track record in complex audit assignments.',
    isVerified: true,
    isPastProfessional: true
  },
  {
    id: 'prof-003',
    name: 'CS Amit Patel',
    email: 'amit.patel@csservices.com',
    phone: '+91-9876543212',
    profileImage: '/api/placeholder/64/64',
    isRegistered: true,
    specialization: ['Company Secretarial', 'Compliance', 'Corporate Governance'],
    location: 'Ahmedabad, Gujarat',
    rating: 4.7,
    totalReviews: 98,
    completedProjects: 67,
    responseTime: '3 hours',
    availability: 'busy',
    lastActive: new Date('2024-01-12T16:45:00'),
    experience: 10,
    qualifications: ['CS', 'LLB', 'Diploma in Corporate Law'],
    languages: ['English', 'Hindi', 'Gujarati'],
    hourlyRate: 1800,
    projectRate: 45000,
    portfolioSummary: 'Company Secretary with expertise in corporate compliance and governance frameworks.',
    isVerified: true,
    isPlatformSuggested: true
  },
  {
    id: 'prof-004',
    name: 'Advocate Sunita Reddy',
    email: 'sunita.reddy@legalservices.com',
    phone: '+91-9876543213',
    profileImage: '/api/placeholder/64/64',
    isRegistered: true,
    specialization: ['Intellectual Property', 'Technology Law', 'Contract Law'],
    location: 'Bangalore, Karnataka',
    rating: 4.6,
    totalReviews: 134,
    completedProjects: 78,
    responseTime: '4 hours',
    availability: 'available',
    lastActive: new Date('2024-01-13T11:20:00'),
    experience: 9,
    qualifications: ['LLB', 'LLM IP Law', 'Patent Agent'],
    languages: ['English', 'Hindi', 'Telugu', 'Kannada'],
    hourlyRate: 2200,
    projectRate: 60000,
    portfolioSummary: 'IP law specialist with extensive experience in patent filing and technology contracts.',
    isVerified: true,
    isPastProfessional: true
  },
  {
    id: 'prof-005',
    name: 'CMA Vikash Singh',
    email: 'vikash.singh@cmaoffice.com',
    phone: '+91-9876543214',
    profileImage: '/api/placeholder/64/64',
    isRegistered: true,
    specialization: ['Cost Accounting', 'Management Accounting', 'Financial Planning'],
    location: 'Kolkata, West Bengal',
    rating: 4.5,
    totalReviews: 87,
    completedProjects: 56,
    responseTime: '6 hours',
    availability: 'available',
    lastActive: new Date('2024-01-13T08:30:00'),
    experience: 7,
    qualifications: ['CMA', 'MBA', 'Diploma in Financial Management'],
    languages: ['English', 'Hindi', 'Bengali'],
    hourlyRate: 1500,
    projectRate: 40000,
    portfolioSummary: 'Cost and Management Accountant with expertise in financial planning and cost optimization.',
    isVerified: true,
    isPlatformSuggested: true
  }
];

class ProfessionalInvitationService {
  // Get all professionals based on filters
  async getProfessionals(filters?: ProfessionalFilters): Promise<Professional[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredProfessionals = [...mockProfessionals];

        if (filters) {
          if (filters.specialization && filters.specialization.length > 0) {
            filteredProfessionals = filteredProfessionals.filter(prof =>
              prof.specialization.some(spec => filters.specialization!.includes(spec))
            );
          }

          if (filters.location && filters.location.length > 0) {
            filteredProfessionals = filteredProfessionals.filter(prof =>
              filters.location!.some(loc => prof.location.includes(loc))
            );
          }

          if (filters.rating) {
            filteredProfessionals = filteredProfessionals.filter(prof =>
              prof.rating >= filters.rating!
            );
          }

          if (filters.availability && filters.availability.length > 0) {
            filteredProfessionals = filteredProfessionals.filter(prof =>
              filters.availability!.includes(prof.availability)
            );
          }

          if (filters.isVerified !== undefined) {
            filteredProfessionals = filteredProfessionals.filter(prof =>
              prof.isVerified === filters.isVerified
            );
          }
        }

        resolve(filteredProfessionals);
      }, 800);
    });
  }

  // Get past professionals for a user
  async getPastProfessionals(userId: string): Promise<Professional[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const pastProfessionals = mockProfessionals.filter(prof => prof.isPastProfessional);
        resolve(pastProfessionals);
      }, 600);
    });
  }

  // Get platform suggested professionals
  async getPlatformSuggestedProfessionals(
    serviceRequestId: string,
    excludeIds: string[] = [],
    limit: number = 10
  ): Promise<Professional[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let suggestedProfessionals = mockProfessionals
          .filter(prof => prof.isPlatformSuggested && !excludeIds.includes(prof.id))
          .slice(0, limit);
        
        resolve(suggestedProfessionals);
      }, 1000);
    });
  }

  // Check if email/phone exists on platform
  async checkProfessionalExists(email: string, phone?: string): Promise<Professional | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const professional = mockProfessionals.find(prof => 
          prof.email.toLowerCase() === email.toLowerCase() || 
          (phone && prof.phone === phone)
        );
        resolve(professional || null);
      }, 500);
    });
  }

  // Send invitations to selected professionals
  async sendInvitations(invitationRequest: InvitationRequest): Promise<ProfessionalInvitation[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invitations: ProfessionalInvitation[] = invitationRequest.professionalIds.map(profId => {
          const professional = mockProfessionals.find(p => p.id === profId);
          return {
            id: `inv-${Date.now()}-${profId}`,
            serviceRequestId: invitationRequest.serviceRequestId,
            professionalId: profId,
            professional: professional!,
            invitedBy: invitationRequest.invitedBy,
            invitedAt: new Date(),
            status: 'pending',
            customMessage: invitationRequest.customMessage,
            deadline: invitationRequest.deadline,
            invitationType: invitationRequest.invitationType
          };
        });
        resolve(invitations);
      }, 1000);
    });
  }

  // Send external invitations
  async sendExternalInvitations(
    serviceRequestId: string,
    emails: string[],
    phones: string[],
    invitedBy: string,
    customMessage?: string
  ): Promise<ExternalInvitation[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invitations: ExternalInvitation[] = emails.map((email, index) => ({
          id: `ext-inv-${Date.now()}-${index}`,
          serviceRequestId,
          email,
          phone: phones[index],
          invitedBy,
          invitedAt: new Date(),
          status: 'sent',
          registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          customMessage,
          registrationToken: `token-${Date.now()}-${index}`
        }));
        resolve(invitations);
      }, 800);
    });
  }

  // Get professional profile with masked details
  async getProfessionalProfile(professionalId: string): Promise<ProfessionalProfile | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const professional = mockProfessionals.find(p => p.id === professionalId);
        if (!professional) {
          resolve(null);
          return;
        }

        const profile: ProfessionalProfile = {
          id: professional.id,
          basicInfo: {
            name: professional.name,
            profileImage: professional.profileImage,
            location: professional.location,
            experience: professional.experience,
            specialization: professional.specialization
          },
          performance: {
            rating: professional.rating,
            totalReviews: professional.totalReviews,
            completedProjects: professional.completedProjects,
            responseTime: professional.responseTime,
            successRate: Math.round((professional.completedProjects / (professional.completedProjects + 5)) * 100)
          },
          availability: {
            status: professional.availability,
            nextAvailable: professional.availability === 'busy' ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) : undefined,
            workingHours: '9:00 AM - 6:00 PM',
            timezone: 'IST'
          },
          qualifications: {
            certifications: professional.qualifications,
            education: ['Bachelor of Law', 'Master of Law'],
            licenses: ['Bar Council Registration', 'Professional License'],
            memberships: ['Professional Association', 'Industry Body']
          },
          portfolio: {
            summary: professional.portfolioSummary || '',
            keyProjects: [
              {
                title: 'Corporate Merger Advisory',
                description: 'Led legal advisory for major corporate merger',
                duration: '6 months',
                clientType: 'Large Enterprise'
              },
              {
                title: 'Compliance Framework Implementation',
                description: 'Implemented comprehensive compliance framework',
                duration: '4 months',
                clientType: 'Mid-size Company'
              }
            ],
            skills: professional.specialization,
            languages: professional.languages
          },
          pricing: {
            hourlyRate: professional.hourlyRate,
            projectRate: professional.projectRate,
            currency: 'INR',
            negotiable: true
          },
          maskedContactInfo: {
            emailDomain: professional.email.split('@')[1],
            phonePrefix: professional.phone.substring(0, 6) + 'XXXX',
            locationCity: professional.location.split(',')[0]
          }
        };

        resolve(profile);
      }, 600);
    });
  }

  // Get invitation statistics
  async getInvitationStats(serviceRequestId: string): Promise<ProfessionalInvitationStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stats: ProfessionalInvitationStats = {
          totalInvited: 12,
          pendingResponses: 8,
          acceptedInvitations: 3,
          declinedInvitations: 1,
          expiredInvitations: 0,
          externalInvitationsSent: 2,
          newRegistrations: 1
        };
        resolve(stats);
      }, 400);
    });
  }

  // Get all invitations for a service request
  async getServiceRequestInvitations(serviceRequestId: string): Promise<ProfessionalInvitation[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const invitations: ProfessionalInvitation[] = mockProfessionals.slice(0, 3).map((prof, index) => ({
          id: `inv-${serviceRequestId}-${prof.id}`,
          serviceRequestId,
          professionalId: prof.id,
          professional: prof,
          invitedBy: 'user-123',
          invitedAt: new Date(Date.now() - (index + 1) * 24 * 60 * 60 * 1000),
          status: ['pending', 'accepted', 'declined'][index] as any,
          customMessage: 'We would like to invite you to bid on our service request.',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          invitationType: ['platform_suggested', 'past', 'chosen'][index] as any,
          respondedAt: index > 0 ? new Date(Date.now() - index * 12 * 60 * 60 * 1000) : undefined
        }));
        resolve(invitations);
      }, 600);
    });
  }
}

export const professionalInvitationService = new ProfessionalInvitationService();
