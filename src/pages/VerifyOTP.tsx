import { OTPVerificationForm } from "@/components/auth/OTPVerificationForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const VerifyOTP = () => {
  const navigate = useNavigate();

  const handleOTPVerification = async (otp: string) => {
    try {
      // Mock OTP verification - replace with actual API call
      console.log("Verifying OTP:", otp);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("OTP verified successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Invalid OTP. Please try again.");
    }
  };

  const handleResendOTP = async () => {
    try {
      // Mock resend OTP - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("OTP resent successfully!");
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    }
  };

  return (
    <OTPVerificationForm 
      onSubmit={handleOTPVerification}
      onResendOTP={handleResendOTP}
    />
  );
};

export default VerifyOTP;