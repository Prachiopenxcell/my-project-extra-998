import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Lock, 
  Mail, 
  Key, 
  AlertTriangle, 
  Eye, 
  Calendar, 
  User,
  Building,
  FolderOpen,
  Target,
  BarChart3
} from "lucide-react";
import { Link } from "react-router-dom";

const ExternalAccess = () => {
  const [email, setEmail] = useState("alex.kim@startup.com");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const accessInfo = {
    roomName: "Due Diligence - Series A Funding",
    entity: "ABC Corp Ltd",
    accessLevel: "Editor",
    invitedBy: "John Doe (john.doe@company.com)",
    validUntil: "Jan 15, 2024"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">998p</span>
            </div>
            <span className="text-xl font-semibold">VDR Access Portal</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Secure Access
            </span>
          </div>
        </div>

        {/* Main Access Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Document Room Access
              </CardTitle>
              <CardDescription className="mt-2">
                <div className="space-y-1">
                  <p className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    {accessInfo.roomName}
                  </p>
                  <p className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {accessInfo.entity}
                  </p>
                </div>
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Login Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  📧 Email Address:
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  🔑 Access Password:
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your access password"
                  className="h-11"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="text-sm">Remember Me</Label>
                </div>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  🔗 Forgot Password?
                </Link>
              </div>

              <Button className="w-full h-11 text-base" size="lg">
                <Lock className="h-4 w-4 mr-2" />
                🔐 Secure Access
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Access Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Access Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <span className="text-sm flex items-center gap-2">
                <Target className="h-4 w-4" />
                Your Access Level: <Badge variant="secondary">{accessInfo.accessLevel}</Badge>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              <span className="text-sm">👤 Invited by: {accessInfo.invitedBy}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-sm">📅 Access Valid Until: {accessInfo.validUntil}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              <span className="text-sm flex items-center gap-2">
                <Shield className="h-4 w-4" />
                This is a secure, confidential workspace
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Security Notice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-orange-700">
            <p className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              All activities are logged for security and compliance
            </p>
            <p className="flex items-center gap-2">
              <Lock className="h-4 w-4" />
              Documents are confidential and legally protected
            </p>
            <p className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Your access and actions will be tracked
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          🛡️ Powered by VDR Security
        </div>
      </div>
    </div>
  );
};

export default ExternalAccess;
