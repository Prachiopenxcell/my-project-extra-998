// Quick test script to set mock authentication in localStorage
// Run this in browser console to test ServiceRequestDetails page

const mockUser = {
  id: '1',
  email: 'test@example.com',
  firstName: 'John',
  lastName: 'Doe',
  role: 'SERVICE_SEEKER_INDIVIDUAL_PARTNER',
  userType: 'SERVICE_SEEKER',
  permissions: ['VIEW_SERVICE_REQUESTS', 'CREATE_SERVICE_REQUESTS', 'MANAGE_BIDS'],
  isActive: true,
  isVerified: true,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
};

// Set mock user in localStorage
localStorage.setItem('user', JSON.stringify(mockUser));

console.log('Mock user set in localStorage. Refresh the page to test ServiceRequestDetails.');
console.log('Now you can navigate to: http://localhost:8086/service-requests/sr-001');
