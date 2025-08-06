import { LoginForm } from "@/components/auth/LoginForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = async (data: any) => {
    try {
      // Mock authentication - replace with actual API call
      console.log("Login data:", data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please try again.");
    }
  };

  return <LoginForm onSubmit={handleLogin} />;
};

export default Login;