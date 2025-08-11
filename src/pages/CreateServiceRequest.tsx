import { DashboardLayout } from "@/components/layout/DashboardLayout";
import CreateServiceRequestForm from "@/components/service-requests/seeker/CreateServiceRequest";

const CreateServiceRequest = () => {
  return (
    <DashboardLayout userType="service_seeker">
      <div className="container mx-auto p-6">
        <CreateServiceRequestForm />
      </div>
    </DashboardLayout>
  );
};

export default CreateServiceRequest;
