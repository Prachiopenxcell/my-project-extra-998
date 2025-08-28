import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar, 
  Zap,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity
} from 'lucide-react';

interface SubscriptionStatsProps {
  stats: {
    totalActive: number;
    totalSpend: number;
    expiringCount: number;
    usagePercentage: number;
    monthlyGrowth: number;
    renewalRate: number;
  };
  currency?: string;
}

const SubscriptionStats: React.FC<SubscriptionStatsProps> = ({ 
  stats, 
  currency = 'USD' 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getGrowthColor = (growth: number) => {
    if (growth > 0) return 'text-green-600';
    if (growth < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getGrowthIcon = (growth: number) => {
    if (growth > 0) return <TrendingUp className="w-4 h-4" />;
    if (growth < 0) return <TrendingDown className="w-4 h-4" />;
    return <Activity className="w-4 h-4" />;
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 75) return 'bg-yellow-500';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage >= 90) return { color: 'text-red-600', label: 'High Usage' };
    if (percentage >= 75) return { color: 'text-yellow-600', label: 'Moderate Usage' };
    return { color: 'text-green-600', label: 'Normal Usage' };
  };

  const usageStatus = getUsageStatus(stats.usagePercentage);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Active Subscriptions */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-10 -mt-10" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Active Subscriptions
          </CardTitle>
          <div className="p-2 bg-blue-50 rounded-lg">
            <Zap className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.totalActive}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              All Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total Spend */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-10 -mt-10" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Monthly Spend
          </CardTitle>
          <div className="p-2 bg-green-50 rounded-lg">
            <DollarSign className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {formatCurrency(stats.totalSpend)}
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-xs ${getGrowthColor(stats.monthlyGrowth)}`}>
              {getGrowthIcon(stats.monthlyGrowth)}
              <span className="font-medium">
                {Math.abs(stats.monthlyGrowth).toFixed(1)}%
              </span>
            </div>
            <span className="text-xs text-gray-500">vs last month</span>
          </div>
        </CardContent>
      </Card>

      {/* Expiring Soon */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-transparent rounded-full -mr-10 -mt-10" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Expiring Soon
          </CardTitle>
          <div className="p-2 bg-yellow-50 rounded-lg">
            <Clock className="h-4 w-4 text-yellow-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stats.expiringCount}
          </div>
          <div className="flex items-center gap-2">
            {stats.expiringCount > 0 ? (
              <Badge variant="secondary" className="text-xs bg-yellow-50 text-yellow-700">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Action Needed
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">
                <CheckCircle className="w-3 h-3 mr-1" />
                All Good
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Usage Overview */}
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-10 -mt-10" />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Overall Usage
          </CardTitle>
          <div className="p-2 bg-purple-50 rounded-lg">
            <Activity className="h-4 w-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 mb-2">
            {stats.usagePercentage}%
          </div>
          <div className="space-y-2">
            <Progress 
              value={stats.usagePercentage} 
              className="h-2"
              style={{
                background: 'rgb(243 244 246)'
              }}
            />
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={`text-xs ${usageStatus.color.replace('text-', 'bg-').replace('-600', '-50')} ${usageStatus.color}`}>
                {usageStatus.label}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionStats;
