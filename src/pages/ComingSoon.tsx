import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Construction, 
  ArrowLeft, 
  Clock, 
  Zap, 
  CheckCircle,
  Calendar,
  Bell
} from "lucide-react";

const ComingSoon = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getModuleName = (pathname: string) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length === 0) return "Home";
    
    const moduleMap: Record<string, string> = {
      'entity-management': 'Entity Management',
      'meetings': 'Meetings Management',
      'voting': 'E-Voting System',
      'data-room': 'Virtual Data Room',
      'claims': 'Claims Management',
      'timeline': 'Timeline Management',
      'ar-facilitators': 'AR & Facilitators',
      'litigation': 'Litigation Management',
      'resolution': 'Resolution System',
      'compliance': 'Regulatory Compliance',
      'admin': 'Admin Panel'
    };

    return moduleMap[pathSegments[0]] || pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1);
  };

  const moduleName = getModuleName(location.pathname);
  const isCompliance = location.pathname.startsWith('/compliance');

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{moduleName}</h1>
            <p className="text-muted-foreground">Professional Module</p>
          </div>
        </div>

        {/* Main Coming Soon Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 border-blue-200">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-20 h-20 flex items-center justify-center">
                <Construction className="w-10 h-10 text-blue-600" />
              </div>
              <CardTitle className="text-3xl font-bold text-blue-900 mb-2">
                {moduleName} Module
              </CardTitle>
              <Badge variant="secondary" className="bg-blue-200 text-blue-800">
                Coming Soon
              </Badge>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <p className="text-lg text-blue-800 max-w-2xl mx-auto">
                We're working hard to bring you an amazing {moduleName.toLowerCase()} experience. 
                This module is currently under development and will be available soon.
              </p>

              {/* Features Preview */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <Card className="bg-white/70 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-900 mb-1">Smart Features</h3>
                    <p className="text-sm text-blue-700">AI-powered automation and intelligent workflows</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/70 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-900 mb-1">Comprehensive</h3>
                    <p className="text-sm text-blue-700">Complete solution for all your business needs</p>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/70 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Calendar className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-900 mb-1">Integrated</h3>
                    <p className="text-sm text-blue-700">Seamlessly works with other modules</p>
                  </CardContent>
                </Card>
              </div>

              {/* Timeline */}
              <div className="bg-white/50 rounded-lg p-6 mt-8">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-5 h-5 text-blue-600 mr-2" />
                  <h3 className="font-semibold text-blue-900">Development Timeline</h3>
                </div>
                <div className="flex items-center justify-center space-x-4 text-sm text-blue-700">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Planning Complete
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    In Development
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                    Coming Soon
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
                
                {!isCompliance && (
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/compliance')}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Try Compliance Module
                  </Button>
                )}
              </div>

              {/* Notification */}
              <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 mt-6">
                <div className="flex items-center justify-center text-blue-800">
                  <Bell className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    Want to be notified when this module is ready? Contact your administrator.
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComingSoon;
