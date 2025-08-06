import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  isLoading?: boolean;
}

export function ForgotPasswordForm({ onSubmit, isLoading = false }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-subtle px-4">
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
            <CardTitle className="text-2xl font-bold text-foreground">Forgot Password</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter your Email ID to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading}
                variant="professional"
              >
                {isLoading ? "Sending..." : "Submit"}
              </Button>
            </form>

            {/* Back to Login */}
            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}