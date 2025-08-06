import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

// Import all step components
import EntryDetails from "@/components/meetings/steps/EntryDetails";
import MeetingDetails from "@/components/meetings/steps/MeetingDetails";
import ParticipantsManagement from "@/components/meetings/steps/ParticipantsManagement";
import LastMeetingDetails from "@/components/meetings/steps/LastMeetingDetails";
import AgendaExplanatoryStatement from "@/components/meetings/steps/AgendaExplanatoryStatement";
import ReminderSettings from "@/components/meetings/steps/ReminderSettings";
import ChairpersonSelection from "@/components/meetings/steps/ChairpersonSelection";
import SecretarySelection from "@/components/meetings/steps/SecretarySelection";
import ScrutinizerSelection from "@/components/meetings/steps/ScrutinizerSelection";
import EnableVoting from "@/components/meetings/steps/EnableVoting";
import CreateAndCirculateNotice from "@/components/meetings/steps/CreateAndCirculateNotice";

const CreateMeetingContent = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    entity: "",
    entityType: "Private Limited Company",
    entityName: "Acme Corporation",
    meetingTitle: "",
    meetingClass: "",
    meetingNumber: "2023-Q3-001",
    meetingType: "",
    meetingNature: "",
    meetingDate: null,
    meetingTime: "",
    venue: "",
    virtualMeetingOption: "generate",
    meetingLink: "",
    quorum: 51,
    votingParticipants: [],
    nonVotingParticipants: [],
    agendaItems: [],
    documents: []
  });

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveAsDraft = () => {
    console.log("Saving as draft:", formData);
    // Implement save as draft functionality
  };

  const submitMeeting = () => {
    console.log("Submitting meeting:", formData);
    // Implement submit functionality
    navigate("/meetings");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <EntryDetails
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            saveAsDraft={saveAsDraft}
          />
        );
      case 2:
        return (
          <MeetingDetails
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            nextStep={nextStep}
            saveAsDraft={saveAsDraft}
          />
        );
      case 3:
        return (
          <ParticipantsManagement
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            nextStep={nextStep}
            saveAsDraft={saveAsDraft}
          />
        );
      case 4:
        return (
          <LastMeetingDetails
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            nextStep={nextStep}
            saveAsDraft={saveAsDraft}
          />
        );
      case 5:
        return (
          <AgendaExplanatoryStatement
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            nextStep={nextStep}
            saveAsDraft={saveAsDraft}
          />
        );
      case 6:
        return (
          <ChairpersonSelection
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            nextStep={nextStep}
            saveAsDraft={saveAsDraft}
          />
        );
      case 7:
        return (
          <CreateAndCirculateNotice
            formData={formData}
            setFormData={setFormData}
            prevStep={prevStep}
            saveAsDraft={saveAsDraft}
            submitMeeting={submitMeeting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Meeting</h1>
        <p className="text-gray-600">Step {currentStep} of 7</p>
      </div>

      <Card>
        <CardContent className="p-6">
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

const CreateMeeting = () => {
  return (
    <DashboardLayout>
      <CreateMeetingContent />
    </DashboardLayout>
  );
};

export default CreateMeeting;
