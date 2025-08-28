import React from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Package, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Crown,
  Calendar,
  CreditCard,
  Settings,
  ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SubscriptionStatusIndicatorProps {
  moduleId?: string;
  compact?: boolean;
}

export const SubscriptionStatusIndicator: React.FC<SubscriptionStatusIndicatorProps> = ({
  moduleId = 'entity-management',
  compact = false
}) => {
  const { moduleAccess, subscriptions, hasModuleAccess, loading } = useSubscription();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-pulse bg-muted rounded-full h-6 w-16"></div>
      </div>
    );
  }

  const module = moduleAccess.find(m => m.id === moduleId);
  const hasAccess = hasModuleAccess(moduleId);
  const activeSubscriptions = subscriptions.filter(s => s.status === 'active');
  const totalModules = moduleAccess.filter(m => m.isActive).length;

  if (compact) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 h-8">
            <Package className="h-4 w-4" />
            <Badge 
              variant={hasAccess ? "default" : "secondary"} 
              className={`text-xs ${hasAccess ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}
            >
              {totalModules} Active
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-primary" />
            Subscription Status
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {/* Active Modules */}
          <div className="p-2">
            <div className="text-xs font-medium text-muted-foreground mb-2">Active Modules ({totalModules})</div>
            <div className="space-y-1">
              {moduleAccess.filter(m => m.isActive).map((mod) => (
                <div key={mod.id} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    {mod.name}
                  </span>
                  <Badge variant="outline" className="text-xs">Active</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Inactive Modules */}
          {moduleAccess.filter(m => !m.isActive).length > 0 && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  Available Modules ({moduleAccess.filter(m => !m.isActive).length})
                </div>
                <div className="space-y-1">
                  {moduleAccess.filter(m => !m.isActive).map((mod) => (
                    <div key={mod.id} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <AlertTriangle className="h-3 w-3 text-amber-500" />
                        {mod.name}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {mod.expiryDate ? 'Expired' : 'Not Purchased'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/subscription')}>
            <Settings className="h-4 w-4 mr-2" />
            Manage Subscriptions
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/subscription/browse')}>
            <CreditCard className="h-4 w-4 mr-2" />
            Subscription Packages
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Full card view
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <span className="font-semibold">Subscriptions</span>
          </div>
          <Badge 
            variant={activeSubscriptions.length > 0 ? "default" : "secondary"}
            className={activeSubscriptions.length > 0 ? "bg-green-100 text-green-800" : ""}
          >
            {activeSubscriptions.length} Active
          </Badge>
        </div>

        {/* Current Module Status */}
        {module && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{module.name}</span>
              <Badge 
                variant={hasAccess ? "default" : "secondary"}
                className={`text-xs ${hasAccess ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
              >
                {hasAccess ? (
                  <><CheckCircle className="h-3 w-3 mr-1" />Active</>
                ) : (
                  <><Clock className="h-3 w-3 mr-1" />Inactive</>
                )}
              </Badge>
            </div>
            {module.expiryDate && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {hasAccess ? 'Expires' : 'Expired'}: {new Date(module.expiryDate).toLocaleDateString()}
              </div>
            )}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{totalModules}</div>
            <div className="text-xs text-muted-foreground">Active Modules</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-primary">{activeSubscriptions.length}</div>
            <div className="text-xs text-muted-foreground">Subscriptions</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate('/subscription')}
          >
            <Settings className="h-3 w-3 mr-1" />
            Manage
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            onClick={() => navigate('/subscription/browse')}
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Upgrade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
