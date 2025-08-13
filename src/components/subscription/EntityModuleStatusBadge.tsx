import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Building,
  Calendar,
  Crown,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EntityModuleStatusBadgeProps {
  showDetails?: boolean;
  variant?: 'compact' | 'detailed' | 'banner';
}

export const EntityModuleStatusBadge: React.FC<EntityModuleStatusBadgeProps> = ({
  showDetails = false,
  variant = 'compact'
}) => {
  const { hasModuleAccess, getModuleAccess, loading } = useSubscription();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="animate-pulse bg-muted rounded-full h-6 w-20"></div>
    );
  }

  const hasAccess = hasModuleAccess('entity-management');
  const moduleAccess = getModuleAccess('entity-management');

  if (variant === 'banner' && hasAccess) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Building className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-green-900">Entity Management Active</h3>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              </div>
              <p className="text-sm text-green-700">
                You have full access to create and manage business entities
                {moduleAccess?.expiryDate && (
                  <span className="ml-2">
                    • Expires: {new Date(moduleAccess.expiryDate).toLocaleDateString()}
                  </span>
                )}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/subscription')}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            Manage Subscription
          </Button>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`p-3 rounded-lg border ${
        hasAccess 
          ? 'bg-green-50 border-green-200' 
          : 'bg-amber-50 border-amber-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building className={`h-4 w-4 ${
              hasAccess ? 'text-green-600' : 'text-amber-600'
            }`} />
            <span className={`font-medium text-sm ${
              hasAccess ? 'text-green-900' : 'text-amber-900'
            }`}>
              Entity Management
            </span>
          </div>
          <Badge 
            variant={hasAccess ? "default" : "secondary"}
            className={`text-xs ${
              hasAccess 
                ? "bg-green-100 text-green-800 border-green-200" 
                : "bg-amber-100 text-amber-800 border-amber-200"
            }`}
          >
            {hasAccess ? (
              <><CheckCircle className="h-3 w-3 mr-1" />Active</>
            ) : (
              <><AlertTriangle className="h-3 w-3 mr-1" />Inactive</>
            )}
          </Badge>
        </div>
        
        {showDetails && (
          <div className="mt-2 space-y-1">
            {hasAccess ? (
              <>
                <div className="flex items-center gap-1 text-xs text-green-700">
                  <Sparkles className="h-3 w-3" />
                  Full access to entity creation and management
                </div>
                {moduleAccess?.expiryDate && (
                  <div className="flex items-center gap-1 text-xs text-green-600">
                    <Calendar className="h-3 w-3" />
                    Expires: {new Date(moduleAccess.expiryDate).toLocaleDateString()}
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-1 text-xs text-amber-700">
                <Clock className="h-3 w-3" />
                {moduleAccess?.expiryDate ? 'Subscription expired' : 'Purchase required for access'}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Compact variant (default)
  return (
    <Badge 
      variant={hasAccess ? "default" : "secondary"}
      className={`text-xs cursor-pointer transition-colors ${
        hasAccess 
          ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" 
          : "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200"
      }`}
      onClick={() => navigate('/subscription')}
    >
      {hasAccess ? (
        <>
          <CheckCircle className="h-3 w-3 mr-1" />
          Entity Module Active
        </>
      ) : (
        <>
          <AlertTriangle className="h-3 w-3 mr-1" />
          Entity Module Inactive
        </>
      )}
    </Badge>
  );
};
