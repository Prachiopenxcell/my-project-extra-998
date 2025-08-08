import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Home, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function Unauthorized() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">998-P Platform</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You don't have permission to access this resource</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              <span>Unauthorized Access</span>
            </CardTitle>
            <CardDescription>
              {user 
                ? `Your current role (${user.role}) doesn't have permission to access this page.`
                : 'You need to be logged in to access this page.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {user 
                  ? 'If you believe this is an error, please contact your administrator to request the necessary permissions.'
                  : 'Please log in with an account that has the required permissions.'
                }
              </AlertDescription>
            </Alert>

            {/* User Info */}
            {user && (
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Current User:</span>
                  <span className="text-gray-900">{user.firstName} {user.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="text-gray-900">{user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Role:</span>
                  <span className="text-gray-900">{user.role.replace(/_/g, ' ').toUpperCase()}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 pt-4">
              <Button 
                onClick={handleGoHome}
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                {user ? 'Go to Dashboard' : 'Go to Homepage'}
              </Button>
              
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="w-full"
              >
                Go Back
              </Button>

              {user && (
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              )}
            </div>

            {/* Additional Help */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Need help?{' '}
                <Link
                  to="/contact"
                  className="text-blue-600 hover:text-blue-500"
                >
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
