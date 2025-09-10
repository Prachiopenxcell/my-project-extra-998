import {
  Notification,
  NotificationType,
  NotificationPriority,
  NotificationStatus,
  DeliveryChannel,
  NotificationAction
} from '@/types/notification';

// Helper function to create notification
const createNotification = (
  id: string,
  type: NotificationType,
  priority: NotificationPriority,
  status: NotificationStatus,
  title: string,
  message: string,
  userRole: string,
  actions: NotificationAction[] = [],
  moduleId: string = 'system',
  daysAgo: number = 0,
  entityIdOverride?: string
): Notification => {
  const baseDate = new Date();
  return {
    id,
    type,
    priority,
    status,
    title,
    message,
    summary: message.length > 100 ? message.substring(0, 100) + '...' : message,
    userId: 'user-123',
    userRole,
    entityId: entityIdOverride !== undefined ? entityIdOverride : (userRole.includes('ENTITY') ? 'entity-1' : undefined),
    moduleId,
    relatedId: `rel-${id}`,
    relatedType: type === NotificationType.ACTIVITY ? 'work_order' : 'system',
    actions,
    deliveryChannels: [DeliveryChannel.IN_APP, DeliveryChannel.EMAIL],
    createdAt: new Date(baseDate.getTime() - daysAgo * 24 * 60 * 60 * 1000),
    readAt: status === NotificationStatus.READ ? new Date(baseDate.getTime() - (daysAgo - 0.5) * 24 * 60 * 60 * 1000) : undefined,
    archivedAt: status === NotificationStatus.ARCHIVED ? new Date(baseDate.getTime() - (daysAgo - 1) * 24 * 60 * 60 * 1000) : undefined
  };
};

export const getServiceSeekerIndividualNotifications = (userRole: string): Notification[] => [
  createNotification(
    'ss-ind-regret-1',
    NotificationType.SYSTEM,
    NotificationPriority.HIGH,
    NotificationStatus.UNREAD,
    'Service Request Regret',
    'We regret to inform you that the requested "Specialized Maritime Law Consultation" service is currently not available on our platform. We are working to onboard qualified professionals for this service.',
    userRole,
    [
      { id: '1', label: 'Browse Available Services', url: '/service-requests/create', primary: true },
      { id: '2', label: 'Contact Support', url: '/support' }
    ],
    'service-requests',
    0
  ),
  createNotification(
    'ss-ind-1',
    NotificationType.ACTIVITY,
    NotificationPriority.HIGH,
    NotificationStatus.UNREAD,
    'New Bid Received',
    'You have received a new bid of ₹45,000 for your Corporate Law consultation request from Advocate Sharma & Associates.',
    userRole,
    [
      { id: '1', label: 'View Bid', url: '/service-requests/SR-2024-001', primary: true },
      { id: '2', label: 'Compare Bids', url: '/service-requests/SR-2024-001/bids' }
    ],
    'service-requests',
    0
  ),
  createNotification(
    'ss-ind-2',
    NotificationType.REMINDER,
    NotificationPriority.MEDIUM,
    NotificationStatus.UNREAD,
    'Subscription Expiring Soon',
    'Your Entity Management subscription expires in 5 days. Renew now to continue accessing premium features.',
    userRole,
    [
      { id: '1', label: 'Renew Now', url: '/subscription', primary: true },
      { id: '2', label: 'View Plans', url: '/subscription/packages' }
    ],
    'subscription',
    1
  ),
  createNotification(
    'ss-ind-3',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'Work Order Completed',
    'Work Order #WO-2024-156 for "Annual Compliance Review" has been completed by CA Rajesh Kumar. Please review and provide feedback.',
    userRole,
    [
      { id: '1', label: 'Review Work', url: '/work-orders/WO-2024-156', primary: true },
      { id: '2', label: 'Provide Feedback', url: '/work-orders/WO-2024-156/feedback' }
    ],
    'work-orders',
    2
  ),
  createNotification(
    'ss-ind-4',
    NotificationType.SYSTEM,
    NotificationPriority.LOW,
    NotificationStatus.READ,
    'Platform Update Available',
    'New features have been added to the Claims Management module. Explore enhanced document verification and AI-powered claim analysis.',
    userRole,
    [
      { id: '1', label: 'View Updates', url: '/claims', primary: true }
    ],
    'system',
    3
  ),
  createNotification(
    'ss-ind-5',
    NotificationType.SECURITY,
    NotificationPriority.HIGH,
    NotificationStatus.READ,
    'New Device Login',
    'A new login was detected from Chrome on Windows from IP 103.25.67.89 (Mumbai, Maharashtra) on Jan 12, 2025 at 2:30 PM.',
    userRole,
    [
      { id: '1', label: 'Review Activity', url: '/security/activity', primary: true },
      { id: '2', label: 'Secure Account', url: '/security/settings' }
    ],
    'security',
    4
  ),
  createNotification(
    'ss-ind-6',
    NotificationType.REMINDER,
    NotificationPriority.MEDIUM,
    NotificationStatus.UNREAD,
    'Meeting Reminder',
    'You have a scheduled meeting "Quarterly Board Review" tomorrow at 3:00 PM with 5 participants. Please ensure all documents are uploaded.',
    userRole,
    [
      { id: '1', label: 'Join Meeting', url: '/meetings/MTG-2024-089', primary: true },
      { id: '2', label: 'Upload Documents', url: '/meetings/MTG-2024-089/documents' }
    ],
    'meetings',
    0
  )
];

export const getServiceSeekerEntityAdminNotifications = (userRole: string): Notification[] => [
  
  createNotification(
    'ss-ent-1',
    NotificationType.ACTIVITY,
    NotificationPriority.HIGH,
    NotificationStatus.UNREAD,
    'Team Member Added',
    'Priya Sharma has been successfully added to your organization as a Team Member with access to Entity Management and Meetings modules.',
    userRole,
    [
      { id: '1', label: 'View Team', url: '/entity-management', primary: true },
      { id: '2', label: 'Manage Permissions', url: '/entity-management/team' }
    ],
    'entity-management',
    0
  ),
  createNotification(
    'ss-ent-2',
    NotificationType.REMINDER,
    NotificationPriority.URGENT,
    NotificationStatus.UNREAD,
    'Compliance Deadline Approaching',
    'Annual ROC filing deadline is in 15 days. 3 out of 7 required documents are still pending upload. Immediate action required.',
    userRole,
    [
      { id: '1', label: 'Upload Documents', url: '/compliance/roc-filing', primary: true },
      { id: '2', label: 'View Checklist', url: '/compliance/checklist' }
    ],
    'compliance',
    1
  ),
  createNotification(
    'ss-ent-3',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.UNREAD,
    'Multiple Work Orders Assigned',
    '4 new work orders have been assigned to your team members for Q4 audit preparation. Total value: ₹2,85,000.',
    userRole,
    [
      { id: '1', label: 'View All Orders', url: '/work-orders', primary: true },
      { id: '2', label: 'Team Dashboard', url: '/entity-management/dashboard' }
    ],
    'work-orders',
    1
  ),
  createNotification(
    'ss-ent-4',
    NotificationType.SYSTEM,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'Subscription Upgraded',
    'Your organization subscription has been upgraded to Enterprise plan. New features: Advanced Analytics, Priority Support, and Custom Workflows.',
    userRole,
    [
      { id: '1', label: 'Explore Features', url: '/subscription/features', primary: true }
    ],
    'subscription',
    2
  ),
  createNotification(
    'ss-ent-5',
    NotificationType.ACTIVITY,
    NotificationPriority.HIGH,
    NotificationStatus.READ,
    'Board Resolution Approved',
    'Board Resolution #BR-2024-012 "Appointment of Additional Director" has been approved by 6 out of 7 board members via e-voting.',
    userRole,
    [
      { id: '1', label: 'View Resolution', url: '/voting/BR-2024-012', primary: true },
      { id: '2', label: 'Download Certificate', url: '/voting/BR-2024-012/certificate' }
    ],
    'voting',
    3
  ),
  createNotification(
    'ss-ent-6',
    NotificationType.REMINDER,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'Monthly Team Review Due',
    'Monthly performance review for your 12 team members is due. 8 reviews completed, 4 pending.',
    userRole,
    [
      { id: '1', label: 'Complete Reviews', url: '/entity-management/reviews', primary: true }
    ],
    'entity-management',
    5
  )
];

export const getServiceSeekerTeamMemberNotifications = (userRole: string): Notification[] => [
  
  createNotification(
    'ss-tm-1',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.UNREAD,
    'Task Assignment',
    'You have been assigned to "Q4 Financial Statement Review" task by Admin. Deadline: January 25, 2025.',
    userRole,
    [
      { id: '1', label: 'View Task', url: '/entity-management/tasks/TSK-2024-089', primary: true },
      { id: '2', label: 'Accept Task', action: 'accept_task' }
    ],
    'entity-management',
    0
  ),
  createNotification(
    'ss-tm-2',
    NotificationType.REMINDER,
    NotificationPriority.HIGH,
    NotificationStatus.UNREAD,
    'Document Review Pending',
    'Contract review for "Vendor Agreement - TechCorp" is pending your approval. Document uploaded 2 days ago.',
    userRole,
    [
      { id: '1', label: 'Review Document', url: '/data-room/documents/DOC-2024-156', primary: true }
    ],
    'data-room',
    2
  ),
  createNotification(
    'ss-tm-3',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'Meeting Invitation',
    'You have been invited to "Compliance Strategy Discussion" meeting scheduled for January 15, 2025 at 11:00 AM.',
    userRole,
    [
      { id: '1', label: 'Accept Invitation', url: '/meetings/MTG-2024-078', primary: true },
      { id: '2', label: 'View Agenda', url: '/meetings/MTG-2024-078/agenda' }
    ],
    'meetings',
    3
  ),
  createNotification(
    'ss-tm-4',
    NotificationType.REMINDER,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'Profile Update Required',
    'Please update your professional qualifications and certifications in your profile to access advanced features.',
    userRole,
    [
      { id: '1', label: 'Update Profile', url: '/profile/edit', primary: true }
    ],
    'profile',
    4
  )
];

export const getServiceProviderIndividualNotifications = (userRole: string): Notification[] => [
 /*  createNotification(
    'sp-ind-regret-1',
    NotificationType.SYSTEM,
    NotificationPriority.MEDIUM,
    NotificationStatus.UNREAD,
    'Service Request Regret',
    'We regret to inform you that the service category "Quantum Computing Legal Framework" requested by a client is currently not available on our platform. Consider expanding your service offerings if you have expertise in this area.',
    userRole,
    [
      { id: '1', label: 'Update Service Portfolio', url: '/profile/services', primary: true },
      { id: '2', label: 'View Available Opportunities', url: '/service-requests' }
    ],
    'service-requests',
    0,
    'entity-1'
  ), */
  createNotification(
    'sp-ind-1',
    NotificationType.ACTIVITY,
    NotificationPriority.HIGH,
    NotificationStatus.UNREAD,
    'New Opportunity Available',
    'High-value opportunity: "Corporate Restructuring Legal Advisory" posted by Reliance Industries Ltd. Estimated value: ₹15,00,000. Deadline to bid: 2 days.',
    userRole,
    [
      { id: '1', label: 'View Opportunity', url: '/service-requests/SR-2024-234', primary: true },
      { id: '2', label: 'Submit Bid', url: '/service-requests/SR-2024-234/bid' }
    ],
    'service-requests',
    0
  ),
  createNotification(
    'sp-ind-2',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.UNREAD,
    'Work Order Accepted',
    'Your work order "Tax Planning for FY 2024-25" has been accepted by Mahindra Group. Project value: ₹75,000. Start date: January 20, 2025.',
    userRole,
    [
      { id: '1', label: 'View Work Order', url: '/work-orders/WO-2024-189', primary: true },
      { id: '2', label: 'Start Project', url: '/work-orders/WO-2024-189/start' }
    ],
    'work-orders',
    1
  ),
  createNotification(
    'sp-ind-3',
    NotificationType.REMINDER,
    NotificationPriority.HIGH,
    NotificationStatus.UNREAD,
    'Payment Received',
    'Payment of ₹1,25,000 has been received for Work Order #WO-2024-145 "Annual Audit Services". Amount credited to your account.',
    userRole,
    [
      { id: '1', label: 'View Invoice', url: '/work-orders/WO-2024-145/invoice', primary: true },
      { id: '2', label: 'Download Receipt', url: '/work-orders/WO-2024-145/receipt' }
    ],
    'work-orders',
    1
  ),
  createNotification(
    'sp-ind-4',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'Client Feedback Received',
    'Positive feedback received from Tata Consultancy Services for "GST Compliance Review". Rating: 4.8/5. Great work!',
    userRole,
    [
      { id: '1', label: 'View Feedback', url: '/work-orders/WO-2024-134/feedback', primary: true }
    ],
    'work-orders',
    2
  ),
  createNotification(
    'sp-ind-5',
    NotificationType.REMINDER,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'Subscription Renewal',
    'Your Professional subscription expires in 7 days. Renew to continue receiving premium opportunities and priority support.',
    userRole,
    [
      { id: '1', label: 'Renew Now', url: '/subscription', primary: true },
      { id: '2', label: 'Upgrade Plan', url: '/subscription/upgrade' }
    ],
    'subscription',
    3
  ),
  createNotification(
    'sp-ind-6',
    NotificationType.SYSTEM,
    NotificationPriority.LOW,
    NotificationStatus.READ,
    'New Resource Available',
    'New legal templates and compliance checklists have been added to the Resource Library. Access 50+ updated templates.',
    userRole,
    [
      { id: '1', label: 'Browse Resources', url: '/guidance-reference', primary: true }
    ],
    'guidance-reference',
    4
  ),
  createNotification(
    'sp-ind-7',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.UNREAD,
    'Bid Status Update',
    'Your bid for "IPO Legal Documentation" project has been shortlisted. Client interview scheduled for January 18, 2025 at 4:00 PM.',
    userRole,
    [
      { id: '1', label: 'View Details', url: '/service-requests/SR-2024-178', primary: true },
      { id: '2', label: 'Prepare Interview', url: '/service-requests/SR-2024-178/interview' }
    ],
    'service-requests',
    1
  )
];

export const getServiceProviderEntityAdminNotifications = (userRole: string): Notification[] => [
  createNotification(
    'sp-ent-regret-1',
    NotificationType.SYSTEM,
    NotificationPriority.MEDIUM,
    NotificationStatus.UNREAD,
    'Service Request Regret',
    'We regret to inform you that the specialized service "Blockchain Regulatory Compliance" requested by multiple clients is currently not available on our platform. This represents a potential business opportunity for your organization.',
    userRole,
    [
      { id: '1', label: 'Expand Service Offerings', url: '/profile/services', primary: true },
      { id: '2', label: 'Contact Business Development', url: '/support/business-development' }
    ],
    'service-requests',
    0
  ),
  createNotification(
    'sp-ent-1',
    NotificationType.ACTIVITY,
    NotificationPriority.HIGH,
    NotificationStatus.UNREAD,
    'Large Contract Opportunity',
    'Multi-year contract opportunity from Government of Maharashtra for "Legal Advisory Services". Estimated value: ₹2.5 Crores. Team allocation required.',
    userRole,
    [
      { id: '1', label: 'View Opportunity', url: '/service-requests/SR-2024-456', primary: true },
      { id: '2', label: 'Allocate Team', url: '/entity-management/allocate' }
    ],
    'service-requests',
    0
  ),
  createNotification(
    'sp-ent-2',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.UNREAD,
    'Team Performance Report',
    'Monthly performance report ready: 15 active projects, 89% client satisfaction, ₹45,67,000 revenue generated. 3 team members exceeded targets.',
    userRole,
    [
      { id: '1', label: 'View Report', url: '/entity-management/reports', primary: true },
      { id: '2', label: 'Team Dashboard', url: '/entity-management/dashboard' }
    ],
    'entity-management',
    1
  ),
  createNotification(
    'sp-ent-3',
    NotificationType.REMINDER,
    NotificationPriority.HIGH,
    NotificationStatus.UNREAD,
    'Resource Sharing Request',
    'CA Firm "Deloitte & Associates" has requested to share resources for "International Tax Advisory" project. Mutual benefit opportunity.',
    userRole,
    [
      { id: '1', label: 'Review Request', url: '/resource-sharing/requests/RSR-2024-67', primary: true },
      { id: '2', label: 'Respond', url: '/resource-sharing/requests/RSR-2024-67/respond' }
    ],
    'resource-sharing',
    1
  ),
  createNotification(
    'sp-ent-4',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'New Team Member Onboarded',
    'Advocate Neha Patel has completed onboarding and is now active. Assigned to Corporate Law division with access to 5 modules.',
    userRole,
    [
      { id: '1', label: 'View Profile', url: '/entity-management/team/neha-patel', primary: true }
    ],
    'entity-management',
    2
  ),
  createNotification(
    'sp-ent-5',
    NotificationType.SYSTEM,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'Compliance Alert',
    'Bar Council registration renewal due for 3 team members in next 30 days. Ensure timely renewal to maintain practice eligibility.',
    userRole,
    [
      { id: '1', label: 'View Details', url: '/compliance/bar-council', primary: true },
      { id: '2', label: 'Set Reminders', url: '/compliance/reminders' }
    ],
    'compliance',
    3
  ),
  createNotification(
    'sp-ent-6',
    NotificationType.ACTIVITY,
    NotificationPriority.HIGH,
    NotificationStatus.READ,
    'Client Retention Success',
    'Successfully retained 8 out of 10 major clients for annual retainer contracts. Total value: ₹1.2 Crores. Excellent team performance!',
    userRole,
    [
      { id: '1', label: 'View Contracts', url: '/work-orders/retainers', primary: true }
    ],
    'work-orders',
    4
  )
];

export const getServiceProviderTeamMemberNotifications = (userRole: string): Notification[] => [
  createNotification(
    'sp-tm-regret-1',
    NotificationType.SYSTEM,
    NotificationPriority.MEDIUM,
    NotificationStatus.UNREAD,
    'Service Request Regret',
    'We regret to inform you that the requested "Space Law Consultation" service is currently not available on our platform. Please inform your team admin about this potential service gap.',
    userRole,
    [
      { id: '1', label: 'View Current Services', url: '/service-requests', primary: true },
      { id: '2', label: 'Contact Team Admin', url: '/entity-management/team' }
    ],
    'service-requests',
    0
  ),
  createNotification(
    'sp-tm-1',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.UNREAD,
    'Work Order Assigned',
    'New work order "Due Diligence for M&A Transaction" assigned by Senior Partner. Client: Wipro Technologies. Deadline: January 30, 2025.',
    userRole,
    [
      { id: '1', label: 'View Work Order', url: '/work-orders/WO-2024-267', primary: true },
      { id: '2', label: 'Accept Assignment', action: 'accept_work_order' }
    ],
    'work-orders',
    0
  ),
  createNotification(
    'sp-tm-2',
    NotificationType.REMINDER,
    NotificationPriority.HIGH,
    NotificationStatus.UNREAD,
    'Document Submission Due',
    'Draft agreement for "Software Licensing Contract" is due for review today. Client meeting scheduled tomorrow at 2:00 PM.',
    userRole,
    [
      { id: '1', label: 'Upload Draft', url: '/work-orders/WO-2024-245/documents', primary: true }
    ],
    'work-orders',
    0
  ),
  createNotification(
    'sp-tm-3',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'Training Completion',
    'Successfully completed "Advanced Corporate Law" training module. Certificate generated. 15 CPE hours credited to your profile.',
    userRole,
    [
      { id: '1', label: 'Download Certificate', url: '/guidance-reference/certificates/ADV-CORP-2024', primary: true }
    ],
    'guidance-reference',
    1
  ),
  createNotification(
    'sp-tm-4',
    NotificationType.ACTIVITY,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'Performance Recognition',
    'Excellent work on "IPO Legal Documentation" project! Client rated your work 5/5. Bonus of ₹25,000 approved by management.',
    userRole,
    [
      { id: '1', label: 'View Feedback', url: '/work-orders/WO-2024-198/feedback', primary: true }
    ],
    'work-orders',
    2
  ),
  createNotification(
    'sp-tm-5',
    NotificationType.REMINDER,
    NotificationPriority.MEDIUM,
    NotificationStatus.READ,
    'Skill Assessment Due',
    'Quarterly skill assessment for "Contract Drafting" and "Legal Research" is due. Complete by January 20 to maintain certification.',
    userRole,
    [
      { id: '1', label: 'Take Assessment', url: '/guidance-reference/assessments', primary: true }
    ],
    'guidance-reference',
    3
  )
];

export const getRoleSpecificNotifications = (userRole: string): Notification[] => {
  switch (userRole) {
    case 'SERVICE_SEEKER_INDIVIDUAL':
    case 'SERVICE_SEEKER_INDIVIDUAL_PARTNER':
      return getServiceSeekerIndividualNotifications(userRole);
    
    case 'SERVICE_SEEKER_ENTITY_ADMIN':
      return getServiceSeekerEntityAdminNotifications(userRole);
    
    case 'SERVICE_SEEKER_TEAM_MEMBER':
      return getServiceSeekerTeamMemberNotifications(userRole);
    
    case 'SERVICE_PROVIDER_INDIVIDUAL':
    case 'SERVICE_PROVIDER_INDIVIDUAL_PARTNER':
      return getServiceProviderIndividualNotifications(userRole);
    
    case 'SERVICE_PROVIDER_ENTITY_ADMIN':
      return getServiceProviderEntityAdminNotifications(userRole);
    
    case 'SERVICE_PROVIDER_TEAM_MEMBER':
      return getServiceProviderTeamMemberNotifications(userRole);
    
    default:
      return [];
  }
};
