// System Settings Service Layer

import { 
  TeamMember, 
  TeamMemberRole, 
  TeamMemberStatus, 
  ProcessTemplate, 
  ProcessCategory, 
  PaymentHistory, 
  PaymentStatus, 
  PaymentMethodType, 
  SubscriptionSettings, 
  NotificationPreferences, 
  ProfileData, 
  PasswordUpdateData, 
  SecuritySettings, 
  SystemSettingsStats, 
  SystemSettingsFilters, 
  SystemSettingsResponse,
  PaymentMethod
} from '@/types/systemSettings';

class SystemSettingsService {
  // Profile Management
  async getProfile(): Promise<ProfileData> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          personalInfo: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@email.com',
            phone: '+1-234-567-8900',
            dateOfBirth: '1985-06-15',
            gender: 'male',
            avatar: undefined
          },
          address: {
            line1: '123 Business Street',
            line2: 'Suite 100',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          },
          verification: {
            emailVerified: true,
            phoneVerified: true,
            identityDocuments: 'pending',
            addressVerification: 'not_submitted'
          },
          preferences: {
            categories: ['Legal Services', 'Consulting'],
            locationPreference: ['New York', 'California'],
            communicationMethods: ['email', 'sms'],
            language: 'English',
            timezone: 'UTC-5 Eastern'
          }
        });
      }, 500);
    });
  }

  async updateProfile(profileData: Partial<ProfileData>): Promise<void> {
    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Profile updated:', profileData);
        resolve();
      }, 1000);
    });
  }

  // Password & Security
  async updatePassword(passwordData: PasswordUpdateData): Promise<void> {
    // Mock implementation with validation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          reject(new Error('Passwords do not match'));
          return;
        }
        if (passwordData.newPassword.length < 8) {
          reject(new Error('Password must be at least 8 characters'));
          return;
        }
        console.log('Password updated successfully');
        resolve();
      }, 1000);
    });
  }

  async getSecuritySettings(): Promise<SecuritySettings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          twoFactorEnabled: true,
          primaryMethod: 'sms',
          backupMethod: 'email',
          backupCodes: ['ABC123', 'DEF456', 'GHI789'],
          recentActivity: [
            {
              id: '1',
              action: 'Login from Chrome (Windows)',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
              location: 'New York, NY',
              device: 'Chrome on Windows',
              status: 'success'
            },
            {
              id: '2',
              action: 'Password changed',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              status: 'success'
            },
            {
              id: '3',
              action: 'Failed login attempt',
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              location: 'Unknown',
              status: 'failed'
            }
          ]
        });
      }, 500);
    });
  }

  // Team Management
  async getTeamMembers(filters?: SystemSettingsFilters): Promise<SystemSettingsResponse<TeamMember>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTeamMembers: TeamMember[] = [
          {
            id: '1',
            name: 'John Doe',
            email: 'john.doe@company.com',
            role: TeamMemberRole.ADMIN,
            status: TeamMemberStatus.ACTIVE,
            lastActive: new Date(),
            permissions: [
              { module: 'all', actions: ['read', 'write', 'admin'], level: 'admin' }
            ],
            joinedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
          },
          {
            id: '2',
            name: 'Sarah Wilson',
            email: 'sarah.wilson@company.com',
            role: TeamMemberRole.TEAM_MEMBER,
            status: TeamMemberStatus.ACTIVE,
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
            permissions: [
              { module: 'service_requests', actions: ['read', 'write'], level: 'write' },
              { module: 'work_orders', actions: ['read'], level: 'read' }
            ],
            joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000)
          },
          {
            id: '3',
            name: 'Mike Johnson',
            email: 'mike.johnson@company.com',
            role: TeamMemberRole.TEAM_MEMBER,
            status: TeamMemberStatus.ACTIVE,
            lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
            permissions: [
              { module: 'meetings', actions: ['read', 'write'], level: 'write' }
            ],
            joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
          },
          {
            id: '4',
            name: 'Lisa Brown',
            email: 'lisa.brown@company.com',
            role: TeamMemberRole.TEAM_LEAD,
            status: TeamMemberStatus.ACTIVE,
            lastActive: new Date(Date.now() - 30 * 60 * 1000),
            permissions: [
              { module: 'team_management', actions: ['read', 'write'], level: 'write' },
              { module: 'reports', actions: ['read'], level: 'read' }
            ],
            joinedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000)
          },
          {
            id: '5',
            name: 'Tom Davis',
            email: 'tom.davis@company.com',
            role: TeamMemberRole.TEAM_MEMBER,
            status: TeamMemberStatus.INACTIVE,
            lastActive: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            permissions: [
              { module: 'documents', actions: ['read'], level: 'read' }
            ],
            joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
          },
          {
            id: '6',
            name: 'Anna Smith',
            email: 'anna.smith@company.com',
            role: TeamMemberRole.TEAM_MEMBER,
            status: TeamMemberStatus.PENDING,
            lastActive: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            permissions: [],
            joinedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        ];

        let filteredMembers = mockTeamMembers;

        if (filters?.role) {
          filteredMembers = filteredMembers.filter(member => member.role === filters.role);
        }

        if (filters?.status) {
          filteredMembers = filteredMembers.filter(member => member.status === filters.status);
        }

        if (filters?.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          filteredMembers = filteredMembers.filter(member => 
            member.name.toLowerCase().includes(searchLower) ||
            member.email.toLowerCase().includes(searchLower)
          );
        }

        resolve({
          data: filteredMembers,
          total: filteredMembers.length,
          page: 1,
          pageSize: 10,
          hasMore: false
        });
      }, 500);
    });
  }

  async addTeamMember(memberData: Partial<TeamMember>): Promise<TeamMember> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMember: TeamMember = {
          id: Date.now().toString(),
          name: memberData.name || '',
          email: memberData.email || '',
          role: memberData.role || TeamMemberRole.TEAM_MEMBER,
          status: TeamMemberStatus.PENDING,
          lastActive: new Date(),
          permissions: memberData.permissions || [],
          joinedAt: new Date()
        };
        resolve(newMember);
      }, 1000);
    });
  }

  async updateTeamMember(id: string, memberData: Partial<TeamMember>): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Team member updated:', id, memberData);
        resolve();
      }, 1000);
    });
  }

  async removeTeamMember(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Team member removed:', id);
        resolve();
      }, 1000);
    });
  }

  async archiveTeamMember(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Team member archived:', id);
        resolve();
      }, 1000);
    });
  }

  async deactivateTeamMember(id: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Team member deactivated:', id);
        resolve();
      }, 1000);
    });
  }

  // Process Templates
  async getProcessTemplates(filters?: SystemSettingsFilters): Promise<SystemSettingsResponse<ProcessTemplate>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTemplates: ProcessTemplate[] = [
          {
            id: '1',
            name: 'Client Onboarding Process',
            category: ProcessCategory.ONBOARDING,
            description: 'Standard process for onboarding new clients',
            steps: [
              {
                id: '1',
                title: 'Initial Contact',
                description: 'First contact with client',
                order: 1,
                assignedRole: TeamMemberRole.TEAM_MEMBER,
                estimatedDuration: 30
              },
              {
                id: '2',
                title: 'Document Collection',
                description: 'Collect required documents',
                order: 2,
                assignedRole: TeamMemberRole.TEAM_LEAD,
                estimatedDuration: 60
              }
            ],
            isActive: true,
            createdBy: 'John Doe',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            usageCount: 25
          },
          {
            id: '2',
            name: 'Compliance Review',
            category: ProcessCategory.COMPLIANCE,
            description: 'Standard compliance review process',
            steps: [
              {
                id: '1',
                title: 'Document Review',
                description: 'Review all compliance documents',
                order: 1,
                assignedRole: TeamMemberRole.TEAM_LEAD,
                estimatedDuration: 120
              }
            ],
            isActive: true,
            createdBy: 'Sarah Wilson',
            createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
            lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
            usageCount: 15
          }
        ];

        let filteredTemplates = mockTemplates;

        if (filters?.category) {
          filteredTemplates = filteredTemplates.filter(template => template.category === filters.category);
        }

        if (filters?.searchTerm) {
          const searchLower = filters.searchTerm.toLowerCase();
          filteredTemplates = filteredTemplates.filter(template => 
            template.name.toLowerCase().includes(searchLower) ||
            template.description.toLowerCase().includes(searchLower)
          );
        }

        resolve({
          data: filteredTemplates,
          total: filteredTemplates.length,
          page: 1,
          pageSize: 10,
          hasMore: false
        });
      }, 500);
    });
  }

  // Notification Preferences
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          email: {
            serviceUpdates: true,
            paymentReminders: true,
            teamActivities: false,
            systemAnnouncements: true,
            documentExpiry: true,
            securityAlerts: true,
            marketingUpdates: false
          },
          sms: {
            urgentAlerts: true,
            twoFactorCodes: true,
            paymentConfirmations: true,
            appointmentReminders: false
          },
          inApp: {
            realTimeUpdates: true,
            desktopNotifications: true,
            soundNotifications: false,
            frequency: 'instant',
            quietHours: {
              enabled: true,
              startTime: '22:00',
              endTime: '08:00'
            }
          }
        });
      }, 500);
    });
  }

  async updateNotificationPreferences(preferences: Partial<NotificationPreferences>): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Notification preferences updated:', preferences);
        resolve();
      }, 1000);
    });
  }

  // Subscription Settings
  async getSubscriptionSettings(): Promise<SubscriptionSettings> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          autoRenewal: true,
          renewalReminders: true,
          failedPaymentRetry: true,
          gracePeriod: true,
          paymentMethods: [
            {
              id: '1',
              type: PaymentMethodType.CREDIT_CARD,
              details: '•••• 4532',
              isDefault: true,
              expiryDate: '12/26',
              lastUsed: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
            },
            {
              id: '2',
              type: PaymentMethodType.CREDIT_CARD,
              details: '•••• 8901',
              isDefault: false,
              expiryDate: '08/27',
              lastUsed: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
            }
          ],
          primaryPaymentMethod: '1',
          backupPaymentMethod: '2'
        });
      }, 500);
    });
  }

  async updateSubscriptionSettings(settings: Partial<SubscriptionSettings>): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Subscription settings updated:', settings);
        resolve();
      }, 1000);
    });
  }

  // Payment History
  async getPaymentHistory(filters?: SystemSettingsFilters): Promise<SystemSettingsResponse<PaymentHistory>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPayments: PaymentHistory[] = [
          {
            id: '1',
            date: new Date('2025-02-15'),
            serviceTitle: 'Monthly Subscription',
            details: 'Professional Plus • Team: 6 members • Storage: 100GB',
            amount: 299.99,
            status: PaymentStatus.COMPLETED,
            invoiceUrl: '/invoices/2025-02-15.pdf',
            paymentMethod: PaymentMethodType.CREDIT_CARD,
            transactionId: 'TXN-2025-02-15-001'
          },
          {
            id: '2',
            date: new Date('2025-01-15'),
            serviceTitle: 'Monthly Subscription',
            details: 'Professional Plus • Team: 5 members • Storage: 100GB',
            amount: 299.99,
            status: PaymentStatus.COMPLETED,
            invoiceUrl: '/invoices/2025-01-15.pdf',
            paymentMethod: PaymentMethodType.CREDIT_CARD,
            transactionId: 'TXN-2025-01-15-001'
          },
          {
            id: '3',
            date: new Date('2025-01-10'),
            serviceTitle: 'Additional Storage',
            details: 'Extra 50GB Storage • Module: Document Cycle',
            amount: 49.99,
            status: PaymentStatus.COMPLETED,
            invoiceUrl: '/invoices/2025-01-10.pdf',
            paymentMethod: PaymentMethodType.CREDIT_CARD,
            transactionId: 'TXN-2025-01-10-001'
          },
          {
            id: '4',
            date: new Date('2024-12-15'),
            serviceTitle: 'Monthly Subscription',
            details: 'Professional Plus • Team: 5 members • Storage: 50GB',
            amount: 299.99,
            status: PaymentStatus.COMPLETED,
            invoiceUrl: '/invoices/2024-12-15.pdf',
            paymentMethod: PaymentMethodType.CREDIT_CARD,
            transactionId: 'TXN-2024-12-15-001'
          },
          {
            id: '5',
            date: new Date('2024-12-01'),
            serviceTitle: 'Team Member License',
            details: 'Additional Member • New Member: Sarah Wilson',
            amount: 29.99,
            status: PaymentStatus.COMPLETED,
            invoiceUrl: '/invoices/2024-12-01.pdf',
            paymentMethod: PaymentMethodType.CREDIT_CARD,
            transactionId: 'TXN-2024-12-01-001'
          }
        ];

        resolve({
          data: mockPayments,
          total: mockPayments.length,
          page: 1,
          pageSize: 10,
          hasMore: false
        });
      }, 500);
    });
  }

  // Dashboard Stats
  async getSystemSettingsStats(): Promise<SystemSettingsStats> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          profileCompletion: 85,
          teamMembers: {
            total: 8,
            active: 6
          },
          processTemplates: {
            total: 12,
            active: 8
          },
          serviceRequests: 25,
          notifications: {
            total: 45,
            unread: 12
          }
        });
      }, 500);
    });
  }
}

export const systemSettingsService = new SystemSettingsService();
