import { Resource, ResourceStatus, ResourceType, Request, RequestStatus, QueryParams, PagedResult } from '@/types/resourceSharing';

let resources: Resource[] = [];
let requests: Request[] = [];

// Seed with a couple of examples
(() => {
  const now = new Date().toISOString();
  const r1: Resource = {
    id: 'r1',
    type: 'Infrastructure',
    title: 'Conference Room - 10 Seats',
    information: 'Equipped with projector, whiteboard, Wi-Fi.',
    ownerName: 'Priya Sharma',
    location: 'Mumbai',
    endDate: undefined,
    status: 'Available',
    createdAt: now,
    requestIds: []
  };
  const r2: Resource = {
    id: 'r2',
    type: 'Trainee_CS',
    title: 'CS Trainee - 3 Months',
    information: 'Available for compliance filings and research.',
    ownerName: 'Rahul Mehta',
    location: 'Pune',
    endDate: undefined,
    status: 'Available',
    createdAt: now,
    requestIds: []
  };
  const r3: Resource = {
    id: 'r3',
    type: 'Article',
    title: 'GST Return Filing Checklist',
    information: 'Detailed checklist for monthly GST filings with practical tips.',
    ownerName: 'Neha Gupta',
    location: 'Remote',
    endDate: undefined,
    status: 'Available',
    createdAt: now,
    requestIds: []
  };
  const r4: Resource = {
    id: 'r4',
    type: 'Infrastructure',
    title: 'Hot Desk - 1 Seat',
    information: 'Ergonomic chair, dual monitors, docking station.',
    ownerName: 'Aman Verma',
    location: 'Ahmedabad',
    endDate: undefined,
    status: 'Occupied',
    createdAt: now,
    requestIds: []
  };
  const r5: Resource = {
    id: 'r5',
    type: 'Trainee_CA',
    title: 'CA Trainee - 6 Months',
    information: 'Assists with audits, bookkeeping, and MIS.',
    ownerName: 'Sneha Iyer',
    location: 'Bengaluru',
    endDate: undefined,
    status: 'Available',
    createdAt: now,
    requestIds: []
  };
  const r6: Resource = {
    id: 'r6',
    type: 'Article',
    title: 'Companies Act Annual Compliance Calendar',
    information: 'Key dates and forms for private companies.',
    ownerName: 'Priya Sharma',
    location: 'Remote',
    endDate: undefined,
    status: 'Inactive',
    createdAt: now,
    requestIds: []
  };
  resources = [r1, r2, r3, r4, r5, r6];

  // Seed a few requests across statuses
  const q1: Request = {
    id: 'q1',
    resourceId: 'r1',
    typeOfRequest: 'Booking',
    purpose: 'Team sprint planning',
    requestedStart: new Date(Date.now() + 24*60*60*1000).toISOString(),
    requestedEnd: new Date(Date.now() + 26*60*60*1000).toISOString(),
    durationLabel: '2 hours',
    mode: 'In-Person',
    confidentiality: false,
    comments: 'Need projector and whiteboard',
    urgency: 'Normal',
    createdAt: now,
    status: 'Action Pending'
  };
  const q2: Request = {
    id: 'q2',
    resourceId: 'r2',
    typeOfRequest: 'Consultation',
    purpose: 'ROC filings help',
    mode: 'Remote',
    confidentiality: true,
    comments: 'Sensitive client data',
    urgency: 'Urgent',
    createdAt: now,
    status: 'Accepted'
  };
  const q3: Request = {
    id: 'q3',
    resourceId: 'r4',
    typeOfRequest: 'Booking',
    purpose: 'Visiting client workstation',
    mode: 'In-Person',
    confidentiality: false,
    urgency: 'Low',
    createdAt: now,
    status: 'Rejected'
  };

  requests = [q1, q2, q3];
  // Link request ids to resources
  resources = resources.map(r => ({
    ...r,
    requestIds: requests.filter(req => req.resourceId === r.id).map(req => req.id)
  }));
  // Update resource statuses based on accepted requests
  for (const req of requests) {
    if (req.status === 'Accepted') {
      const resItem = resources.find(r => r.id === req.resourceId);
      if (resItem) resItem.status = 'Occupied';
    }
  }
})();

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const resourceSharingService = {
  // Resources
  async createResource(payload: Omit<Resource, 'id' | 'createdAt' | 'updatedAt' | 'requestIds'>): Promise<Resource> {
    await delay(300);
    const newR: Resource = {
      ...payload,
      id: `r${resources.length + 1}`,
      createdAt: new Date().toISOString(),
      requestIds: []
    };
    resources = [newR, ...resources];
    return newR;
  },

  async updateResource(id: string, updates: Partial<Resource>): Promise<Resource | undefined> {
    await delay(300);
    const idx = resources.findIndex(r => r.id === id);
    if (idx === -1) return undefined;
    resources[idx] = { ...resources[idx], ...updates, updatedAt: new Date().toISOString() };
    return resources[idx];
  },

  async deleteResource(id: string): Promise<boolean> {
    await delay(200);
    const before = resources.length;
    resources = resources.filter(r => r.id !== id);
    // Also delete related requests
    requests = requests.filter(req => req.resourceId !== id);
    return resources.length < before;
  },

  async getResourceById(id: string): Promise<Resource | undefined> {
    await delay(150);
    return resources.find(r => r.id === id);
  },

  async listResources(q: QueryParams = {}): Promise<PagedResult<Resource>> {
    await delay(250);
    const { search = '', type = 'All', status = 'All', sort = 'Latest', page = 1, pageSize = 10 } = q;
    let data = [...resources];

    if (type !== 'All') data = data.filter(r => r.type === (type as ResourceType));
    if (status !== 'All') data = data.filter(r => r.status === (status as ResourceStatus));
    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter(r => (
        r.title.toLowerCase().includes(s) ||
        r.information.toLowerCase().includes(s) ||
        r.location.toLowerCase().includes(s)
      ));
    }

    if (sort === 'Latest') data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sort === 'Oldest') data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const total = data.length;
    const start = (page - 1) * pageSize;
    const items = data.slice(start, start + pageSize);
    return { items, total, page, pageSize };
  },

  // Requests
  async createRequest(payload: Omit<Request, 'id' | 'createdAt' | 'status'> & { status?: RequestStatus }): Promise<Request> {
    await delay(300);
    const newReq: Request = {
      ...payload,
      id: `q${requests.length + 1}`,
      createdAt: new Date().toISOString(),
      status: payload.status ?? 'Action Pending'
    };
    requests = [newReq, ...requests];
    // Link to resource
    const rIdx = resources.findIndex(r => r.id === newReq.resourceId);
    if (rIdx !== -1 && !resources[rIdx].requestIds.includes(newReq.id)) {
      resources[rIdx].requestIds.unshift(newReq.id);
    }
    return newReq;
  },

  async updateRequest(id: string, updates: Partial<Request>): Promise<Request | undefined> {
    await delay(250);
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) return undefined;
    requests[idx] = { ...requests[idx], ...updates };
    return requests[idx];
  },

  async listRequestsByResource(resourceId: string): Promise<Request[]> {
    await delay(200);
    return requests.filter(r => r.resourceId === resourceId);
  },

  async listMyRequests(q: { search?: string; status?: RequestStatus | 'All'; sort?: 'Latest' | 'Oldest'; page?: number; pageSize?: number } = {}): Promise<PagedResult<Request>> {
    await delay(250);
    const { search = '', status = 'All', sort = 'Latest', page = 1, pageSize = 10 } = q;
    let data = [...requests];

    if (status !== 'All') data = data.filter(r => r.status === status);
    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter(r => (
        r.purpose.toLowerCase().includes(s) ||
        r.comments?.toLowerCase().includes(s) || ''
      ));
    }

    if (sort === 'Latest') data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    if (sort === 'Oldest') data.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

    const total = data.length;
    const start = (page - 1) * pageSize;
    const items = data.slice(start, start + pageSize);
    return { items, total, page, pageSize };
  },

  async acceptRequest(requestId: string): Promise<{ request?: Request; resource?: Resource }> {
    await delay(250);
    const req = requests.find(r => r.id === requestId);
    if (!req) return {};
    req.status = 'Accepted';
    const resItem = resources.find(r => r.id === req.resourceId);
    if (resItem) resItem.status = 'Occupied';
    return { request: req, resource: resItem };
  },

  async rejectRequest(requestId: string): Promise<Request | undefined> {
    await delay(250);
    const req = requests.find(r => r.id === requestId);
    if (!req) return undefined;
    req.status = 'Rejected';
    return req;
  }
};
