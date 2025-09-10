export type ResourceType = 'Infrastructure' | 'Article' | 'Trainee_CA' | 'Trainee_CS';

export type ResourceStatus = 'Available' | 'Occupied' | 'Inactive';

export type RequestType = 'Module' | 'Checklist Task' | 'Sub Task' | 'Other';

export type CollaborationMode = 'Virtual' | 'In-Person' | 'Hybrid';

export type Urgency = 'High' | 'Medium' | 'Low';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  information: string;
  ownerName: string; // provider/team member name (masked for seekers)
  location: string;
  endDate?: string; // ISO
  status: ResourceStatus;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
  requestIds: string[]; // linked requests
}

export interface RequestAttachmentMeta {
  name: string;
  size: number; // bytes
  type: string; // mime
}

export type RequestStatus = 'Action Pending' | 'Accepted' | 'Rejected';

export interface Request {
  id: string;
  resourceId: string;
  typeOfRequest: RequestType;
  otherRequestText?: string;
  purpose: string;
  requestedStart?: string; // ISO datetime
  requestedEnd?: string; // ISO datetime
  durationLabel?: string; // e.g., "2 Days", "4 Hours", "1 Week"
  mode: CollaborationMode;
  attachment?: RequestAttachmentMeta;
  confidentiality: boolean;
  comments?: string;
  urgency: Urgency;
  recurrence?: boolean;
  recurrenceFrequency?: 'Daily' | 'Weekly' | 'Monthly';
  status: RequestStatus;
  createdAt: string; // ISO
}

export interface QueryParams {
  search?: string;
  type?: ResourceType | 'All';
  status?: ResourceStatus | 'All';
  sort?: 'Latest' | 'Oldest';
  page?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}
