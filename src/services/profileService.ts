// Profile Service - Handles profile operations and completion calculations

import { UserRole } from '@/types/auth';
import { 
  UserProfile, 
  ProfileCompletionStatus, 
  ProfileSection,
  ServiceSeekerIndividualProfile,
  ServiceSeekerEntityProfile,
  ServiceProviderIndividualProfile,
  ServiceProviderEntityProfile,
  TeamMemberProfile
} from '@/types/profile';

// Mock data storage (replace with actual API calls)
const profileStorage = new Map<string, UserProfile>();

export class ProfileService {
  
  // Get profile by user ID
  static async getProfile(userId: string): Promise<UserProfile | null> {
    // Mock implementation - replace with actual API call
    return profileStorage.get(userId) || null;
  }

  // Save profile
  static async saveProfile(profile: UserProfile): Promise<UserProfile> {
    // Mock implementation - replace with actual API call
    profileStorage.set(profile.userId, {
      ...profile,
      lastUpdated: new Date()
    });
    return profile;
  }

  // Calculate profile completion percentage
  static calculateCompletionStatus(profile: UserProfile, userRole: UserRole): ProfileCompletionStatus {
    const sections = this.getProfileSections(profile, userRole);
    
    let totalWeight = 0;
    let completedWeight = 0;
    const missingMandatoryFields: string[] = [];

    sections.forEach(section => {
      totalWeight += section.weight;
      if (section.isCompleted) {
        completedWeight += section.weight;
      } else {
        // Add missing required fields
        const missingFields = section.requiredFields.filter(
          field => !section.completedFields.includes(field)
        );
        missingMandatoryFields.push(...missingFields);
      }
    });

    const overallPercentage = totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
    
    // Can get permanent number if all mandatory sections are completed
    const mandatorySections = sections.filter(s => s.name.includes('*'));
    const canGetPermanentNumber = mandatorySections.every(s => s.isCompleted);

    return {
      overallPercentage,
      sections,
      missingMandatoryFields,
      canGetPermanentNumber
    };
  }

  // Get profile sections based on user role
  private static getProfileSections(profile: UserProfile, userRole: UserRole): ProfileSection[] {
    switch (userRole) {
      case UserRole.SERVICE_SEEKER_INDIVIDUAL:
      case UserRole.SERVICE_SEEKER_PARTNER:
        return this.getServiceSeekerIndividualSections(profile as ServiceSeekerIndividualProfile);
      
      case UserRole.SERVICE_SEEKER_ENTITY_ADMIN:
        return this.getServiceSeekerEntitySections(profile as ServiceSeekerEntityProfile);
      
      case UserRole.SERVICE_PROVIDER_INDIVIDUAL:
      case UserRole.SERVICE_PROVIDER_PARTNER:
        return this.getServiceProviderIndividualSections(profile as ServiceProviderIndividualProfile);
      
      case UserRole.SERVICE_PROVIDER_ENTITY_ADMIN:
        return this.getServiceProviderEntitySections(profile as ServiceProviderEntityProfile);
      
      case UserRole.SERVICE_SEEKER_TEAM_MEMBER:
      case UserRole.SERVICE_PROVIDER_TEAM_MEMBER:
        return this.getTeamMemberSections(profile as TeamMemberProfile);
      
      default:
        return [];
    }
  }

  // Service Seeker Individual sections
  private static getServiceSeekerIndividualSections(profile: ServiceSeekerIndividualProfile): ProfileSection[] {
    return [
      {
        name: 'Basic Details*',
        weight: 30,
        isCompleted: !!(profile.name && profile.email && profile.contactNumber),
        requiredFields: ['name', 'email', 'contactNumber'],
        completedFields: this.getCompletedFields(profile, ['name', 'email', 'contactNumber'])
      },
      {
        name: 'Identity Documents*',
        weight: 25,
        isCompleted: !!(profile.identityDocument?.type && profile.identityDocument?.number),
        requiredFields: ['identityDocument.type', 'identityDocument.number', 'identityDocument.uploadedFile'],
        completedFields: this.getCompletedFields(profile, ['identityDocument.type', 'identityDocument.number', 'identityDocument.uploadedFile'])
      },
      {
        name: 'Address Details*',
        weight: 20,
        isCompleted: !!(profile.address?.street && profile.address?.city && profile.address?.pinCode),
        requiredFields: ['address.street', 'address.city', 'address.pinCode'],
        completedFields: this.getCompletedFields(profile, ['address.street', 'address.city', 'address.pinCode'])
      },
      {
        name: 'Tax Information',
        weight: 15,
        isCompleted: !!(profile.panNumber),
        requiredFields: ['panNumber'],
        completedFields: this.getCompletedFields(profile, ['panNumber', 'tanNumber', 'gstNumber'])
      },
      {
        name: 'Banking Details',
        weight: 10,
        isCompleted: !!(profile.bankingDetails && profile.bankingDetails.length > 0),
        requiredFields: ['bankingDetails'],
        completedFields: profile.bankingDetails?.length > 0 ? ['bankingDetails'] : []
      }
    ];
  }

  // Service Seeker Entity sections
  private static getServiceSeekerEntitySections(profile: ServiceSeekerEntityProfile): ProfileSection[] {
    const baseSections = this.getServiceSeekerIndividualSections(profile);
    
    return [
      ...baseSections,
      {
        name: 'Authorized Representative*',
        weight: 20,
        isCompleted: !!(profile.authorizedRepresentative?.name && profile.authorizedRepresentative?.email),
        requiredFields: ['authorizedRepresentative.name', 'authorizedRepresentative.email', 'authorizedRepresentative.contactNumber'],
        completedFields: this.getCompletedFields(profile, ['authorizedRepresentative.name', 'authorizedRepresentative.email', 'authorizedRepresentative.contactNumber'])
      },
      {
        name: 'Resource Infrastructure',
        weight: 15,
        isCompleted: !!(profile.resourceInfra?.numberOfProfessionalStaff !== undefined),
        requiredFields: ['resourceInfra.numberOfProfessionalStaff'],
        completedFields: this.getCompletedFields(profile, ['resourceInfra.numberOfProfessionalStaff', 'resourceInfra.numberOfOtherStaff'])
      }
    ];
  }

  // Service Provider Individual sections
  private static getServiceProviderIndividualSections(profile: ServiceProviderIndividualProfile): ProfileSection[] {
    return [
      {
        name: 'Personal Details*',
        weight: 20,
        isCompleted: !!(profile.name && profile.email && profile.mobile),
        requiredFields: ['name', 'email', 'mobile'],
        completedFields: this.getCompletedFields(profile, ['name', 'email', 'mobile', 'title'])
      },
      {
        name: 'Identity Documents*',
        weight: 15,
        isCompleted: !!(profile.identityDocument?.type && profile.identityDocument?.number),
        requiredFields: ['identityDocument.type', 'identityDocument.number', 'identityDocument.uploadedFile'],
        completedFields: this.getCompletedFields(profile, ['identityDocument.type', 'identityDocument.number', 'identityDocument.uploadedFile'])
      },
      {
        name: 'Qualifications*',
        weight: 15,
        isCompleted: !!(profile.qualifications),
        requiredFields: ['qualifications'],
        completedFields: this.getCompletedFields(profile, ['qualifications'])
      },
      {
        name: 'Membership Details*',
        weight: 15,
        isCompleted: !!(profile.membershipDetails && profile.membershipDetails.length > 0),
        requiredFields: ['membershipDetails'],
        completedFields: profile.membershipDetails?.length > 0 ? ['membershipDetails'] : []
      },
      {
        name: 'Services Offered*',
        weight: 15,
        isCompleted: !!(profile.servicesOffered && profile.servicesOffered.length > 0),
        requiredFields: ['servicesOffered'],
        completedFields: profile.servicesOffered?.length > 0 ? ['servicesOffered'] : []
      },
      {
        name: 'Work Locations',
        weight: 10,
        isCompleted: !!(profile.workLocations && profile.workLocations.length > 0),
        requiredFields: ['workLocations'],
        completedFields: profile.workLocations?.length > 0 ? ['workLocations'] : []
      },
      {
        name: 'Banking Details',
        weight: 10,
        isCompleted: !!(profile.bankingDetails && profile.bankingDetails.length > 0),
        requiredFields: ['bankingDetails'],
        completedFields: profile.bankingDetails?.length > 0 ? ['bankingDetails'] : []
      }
    ];
  }

  // Service Provider Entity sections
  private static getServiceProviderEntitySections(profile: ServiceProviderEntityProfile): ProfileSection[] {
    const baseSections = this.getServiceProviderIndividualSections(profile);
    
    return [
      ...baseSections,
      {
        name: 'Company Details*',
        weight: 15,
        isCompleted: !!(profile.personType && profile.dateOfIncorporation),
        requiredFields: ['personType', 'dateOfIncorporation', 'incorporationCertificate'],
        completedFields: this.getCompletedFields(profile, ['personType', 'dateOfIncorporation', 'incorporationCertificate'])
      },
      {
        name: 'Authorized Representative*',
        weight: 15,
        isCompleted: !!(profile.authorizedRepresentative?.name && profile.authorizedRepresentative?.email),
        requiredFields: ['authorizedRepresentative.name', 'authorizedRepresentative.email'],
        completedFields: this.getCompletedFields(profile, ['authorizedRepresentative.name', 'authorizedRepresentative.email'])
      }
    ];
  }

  // Team Member sections
  private static getTeamMemberSections(profile: TeamMemberProfile): ProfileSection[] {
    return [
      {
        name: 'Basic Details*',
        weight: 40,
        isCompleted: !!(profile.name && profile.email && profile.contactNumber),
        requiredFields: ['name', 'email', 'contactNumber'],
        completedFields: this.getCompletedFields(profile, ['name', 'email', 'contactNumber'])
      },
      {
        name: 'Identity Documents*',
        weight: 30,
        isCompleted: !!(profile.identityDocument?.type && profile.identityDocument?.number),
        requiredFields: ['identityDocument.type', 'identityDocument.number', 'identityDocument.uploadedFile'],
        completedFields: this.getCompletedFields(profile, ['identityDocument.type', 'identityDocument.number', 'identityDocument.uploadedFile'])
      },
      {
        name: 'Address Details*',
        weight: 30,
        isCompleted: !!(profile.address?.street && profile.address?.city && profile.address?.pinCode),
        requiredFields: ['address.street', 'address.city', 'address.pinCode'],
        completedFields: this.getCompletedFields(profile, ['address.street', 'address.city', 'address.pinCode'])
      }
    ];
  }

  // Helper method to get completed fields
  private static getCompletedFields(obj: any, fields: string[]): string[] {
    return fields.filter(field => {
      const value = this.getNestedValue(obj, field);
      return value !== undefined && value !== null && value !== '';
    });
  }

  // Helper method to get nested object values
  private static getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  // AI Document Verification (mock implementation)
  static async verifyDocument(file: File, documentType: string): Promise<{
    isValid: boolean;
    confidence: number;
    extractedData?: any;
    errors?: string[];
  }> {
    // Mock AI verification - replace with actual AI service
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate AI processing
        const isValid = Math.random() > 0.1; // 90% success rate for demo
        resolve({
          isValid,
          confidence: isValid ? 0.95 : 0.3,
          extractedData: isValid ? {
            documentNumber: 'EXTRACTED_NUMBER',
            name: 'EXTRACTED_NAME'
          } : undefined,
          errors: isValid ? [] : ['Document appears to be invalid or corrupted']
        });
      }, 2000);
    });
  }

  // Generate permanent registration number
  static generatePermanentNumber(profile: UserProfile, userRole: UserRole): string {
    // Mock implementation - replace with actual business logic
    const roleCode = this.getRoleCode(userRole);
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    return `${roleCode}${timestamp}${random}`;
  }

  private static getRoleCode(userRole: UserRole): string {
    const roleCodes: Record<UserRole, string> = {
      [UserRole.SERVICE_SEEKER_INDIVIDUAL]: 'SSI',
      [UserRole.SERVICE_SEEKER_PARTNER]: 'SSP',
      [UserRole.SERVICE_SEEKER_ENTITY_ADMIN]: 'SSE',
      [UserRole.SERVICE_SEEKER_TEAM_MEMBER]: 'SST',
      [UserRole.SERVICE_PROVIDER_INDIVIDUAL]: 'SPI',
      [UserRole.SERVICE_PROVIDER_PARTNER]: 'SPP',
      [UserRole.SERVICE_PROVIDER_ENTITY_ADMIN]: 'SPE',
      [UserRole.SERVICE_PROVIDER_TEAM_MEMBER]: 'SPT',
      [UserRole.ANCILLARY_SERVICE_PROVIDER]: 'ASP',
      [UserRole.INVITED_USER]: 'INV',
      [UserRole.GUEST]: 'GST'
    };
    
    return roleCodes[userRole] || 'UNK';
  }
}
