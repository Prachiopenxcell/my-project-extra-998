import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

interface OTPVerificationFormProps {
  onSubmit: (otp: string) => void;
  onResendOTP: () => void;
  isLoading?: boolean;
  phoneNumber?: string;
}

export function OTPVerificationForm({ 
  onSubmit, 
  onResendOTP, 
  isLoading = false,
  phoneNumber = "xxxxxxx890"
}: OTPVerificationFormProps) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(24);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 4) {
      onSubmit(otp);
    }
  };

  const handleResend = () => {
    onResendOTP();
    setCountdown(24);
    setOtp("");
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
            <CardTitle className="text-2xl font-bold text-foreground">Verification</CardTitle>
            <CardDescription className="text-muted-foreground">
              OTP Will Be Sent On The User's Entered Phone Number
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* OTP Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">OTP</label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={4}
                    value={otp}
                    onChange={setOtp}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} className="w-16 h-16 text-xl" />
                      <InputOTPSlot index={1} className="w-16 h-16 text-xl" />
                      <InputOTPSlot index={2} className="w-16 h-16 text-xl" />
                      <InputOTPSlot index={3} className="w-16 h-16 text-xl" />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold"
                disabled={isLoading || otp.length !== 4}
                variant="professional"
              >
                {isLoading ? "Verifying..." : "Submit"}
              </Button>
            </form>

            {/* Resend OTP */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-muted-foreground">
                  <span className="text-destructive cursor-pointer">Resend OTP</span>
                  {" "}in {countdown} seconds
                </p>
              ) : (
                <Button
                  variant="link"
                  onClick={handleResend}
                  className="text-destructive p-0 h-auto"
                >
                  Resend OTP
                </Button>
              )}
            </div>

            {/* Back to Login */}
            <div className="text-center text-sm text-muted-foreground">
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