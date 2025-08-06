import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const handleForgotPassword = async (email: string) => {
    try {
      // Mock API call - replace with actual API call
      console.log("Forgot password for:", email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Password reset instructions sent to your email!");
      navigate("/verify-otp");
    } catch (error) {
      toast.error("Failed to send reset instructions. Please try again.");
    }
  };

  return <ForgotPasswordForm onSubmit={handleForgotPassword} />;
};

export default ForgotPassword;