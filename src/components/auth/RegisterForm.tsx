import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Shield, Info } from "lucide-react";
import { Link } from "react-router-dom";

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
}

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  userType: "service_seeker" | "service_provider";
  entityType: "individual" | "partner" | "organization";
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export function RegisterForm({ onSubmit, isLoading = false }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    userType: "service_seeker",
    entityType: "individual",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof RegisterFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">LOGO</span>
          </div>
        </div>

        <Card className="shadow-elegant">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold text-foreground">Sign Up</CardTitle>
            <CardDescription className="text-muted-foreground">
              Hey there! Please fill out the form below to access the website's features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Type Selection */}
            <Tabs 
              value={formData.userType} 
              onValueChange={(value) => handleInputChange("userType", value)}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-muted">
                <TabsTrigger value="service_seeker" className="text-sm">Service Seeker</TabsTrigger>
                <TabsTrigger value="service_provider" className="text-sm">Service Provider</TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                    className="h-11"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              {/* Mobile Number */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-muted text-sm">
                    +91
                  </div>
                  <Input
                    id="mobileNumber"
                    type="tel"
                    placeholder="Mobile number"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange("mobileNumber", e.target.value)}
                    required
                    className="h-11 rounded-l-none"
                  />
                </div>
              </div>

              {/* Type of Person */}
              <div className="space-y-2">
                <Label htmlFor="entityType">Type of Person</Label>
                <Select value={formData.entityType} onValueChange={(value) => handleInputChange("entityType", value)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Individual" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="partner">Partner</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    className="h-11 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    required
                    className="h-11 pr-12"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) => handleInputChange("acceptTerms", checked)}
                  className="mt-1"
                />
                <Label htmlFor="acceptTerms" className="text-sm leading-5">
                  By Sign up you will be Agree to{" "}
                  <Link to="/terms" className="text-primary underline">Terms and Conditions</Link>
                  {" & "}
                  <Link to="/privacy" className="text-primary underline">Privacy policy</Link>
                </Label>
              </div>

              {/* Sign Up Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading || !formData.acceptTerms}
                variant="professional"
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>
            </form>

            {/* Login Link */}
            <div className="text-center text-sm text-muted-foreground">
              Already I have an account?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}