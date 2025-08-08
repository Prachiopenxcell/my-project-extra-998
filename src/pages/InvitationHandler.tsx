import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, UserPlus, CheckCircle, XCircle } from 'lucide-react';
import { UserRole, ROLE_DISPLAY_NAMES } from '@/types/auth';
import { toast } from 'sonner';

interface InvitationInfo {
  token: string;
  email: string;
  role: UserRole;
  invitedBy: string;
  organizationName?: string;
  moduleContext?: string;
  expiresAt: Date;
  isValid: boolean;
}

export default function InvitationHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [invitation, setInvitation] = useState<InvitationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const role = searchParams.get('role') as UserRole;

    if (!token || !email || !role) {
      setError('Invalid invitation link. Please check the URL and try again.');
      setIsLoading(false);
      return;
    }

    // Validate invitation
    validateInvitation(token, email, role);
  }, [searchParams]);

  const validateInvitation = async (token: string, email: string, role: UserRole) => {
    try {
      // Mock invitation validation - in real app, this would call your API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock invitation data
      const mockInvitation: InvitationInfo = {
        token,
        email,
        role,
        invitedBy: 'John Admin',
        organizationName: role.includes('entity') ? 'Sample Organization' : undefined,
        moduleContext: 'Meeting Participation',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        isValid: true
      };

      setInvitation(mockInvitation);
    } catch (error) {
      console.error('Invitation validation error:', error);
      setError('Failed to validate invitation. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = () => {
    if (!invitation) return;

    // Redirect to registration with pre-filled role and invitation token
    const params = new URLSearchParams({
      role: invitation.role,
      email: invitation.email,
      token: invitation.token,
      invited: 'true'
    });

    navigate(`/register?${params.toString()}`);
  };

  const handleDeclineInvitation = () => {
    toast.success('Invitation declined.');
    navigate('/');
  };

  const isExpired = invitation && new Date() > invitation.expiresAt;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Validating invitation...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !invitation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">998-P Platform</span>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span>Invalid Invitation</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive">
                <AlertDescription>
                  {error || 'This invitation link is invalid or has expired.'}
                </AlertDescription>
              </Alert>
              <div className="mt-4">
                <Button 
                  onClick={() => navigate('/')} 
                  className="w-full"
                >
                  Go to Homepage
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">998-P Platform</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">You're Invited!</h1>
          <p className="text-gray-600 mt-2">Join our professional services platform</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <UserPlus className="h-5 w-5" />
              <span>Invitation Details</span>
            </CardTitle>
            <CardDescription>
              You've been invited to join as {ROLE_DISPLAY_NAMES[invitation.role]}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Invitation Info */}
            <div className="bg-blue-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Invited by:</span>
                <span className="text-gray-900">{invitation.invitedBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-900">{invitation.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Role:</span>
                <span className="text-gray-900">{ROLE_DISPLAY_NAMES[invitation.role]}</span>
              </div>
              {invitation.organizationName && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Organization:</span>
                  <span className="text-gray-900">{invitation.organizationName}</span>
                </div>
              )}
              {invitation.moduleContext && (
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Context:</span>
                  <span className="text-gray-900">{invitation.moduleContext}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="font-medium text-gray-700">Expires:</span>
                <span className="text-gray-900">
                  {invitation.expiresAt.toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Expiration Warning */}
            {isExpired && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>
                  This invitation has expired. Please contact the person who invited you for a new invitation.
                </AlertDescription>
              </Alert>
            )}

            {/* Success Message */}
            {!isExpired && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  This invitation is valid and ready to use. Click "Accept Invitation" to create your account.
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col space-y-2 pt-4">
              {!isExpired ? (
                <>
                  <Button 
                    onClick={handleAcceptInvitation}
                    className="w-full"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Accept Invitation
                  </Button>
                  <Button 
                    onClick={handleDeclineInvitation}
                    variant="outline"
                    className="w-full"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Decline Invitation
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Go to Homepage
                </Button>
              )}
            </div>

            {/* Additional Info */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600 hover:text-blue-500"
                  onClick={() => navigate(`/login?role=${invitation.role}&email=${invitation.email}`)}
                >
                  Sign in here
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
