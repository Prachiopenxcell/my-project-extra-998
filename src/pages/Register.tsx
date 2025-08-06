import { RegisterForm } from "@/components/auth/RegisterForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();

  const handleRegister = async (data: any) => {
    try {
      // Mock registration - replace with actual API call
      console.log("Registration data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Registration successful! Please verify your phone number.");
      navigate("/verify-otp");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return <RegisterForm onSubmit={handleRegister} />;
};

export default Register;