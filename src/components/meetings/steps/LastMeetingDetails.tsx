import { Button } from "@/components/ui/button";

interface LastMeetingDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  prevStep: () => void;
  nextStep: () => void;
  saveAsDraft: () => void;
}

const LastMeetingDetails = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }: LastMeetingDetailsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Last Meeting Details</h3>
        <p className="text-sm text-muted-foreground mb-6">Upload previous meeting documents and details</p>
      </div>

      <div className="border rounded-md p-6 text-center">
        <p className="text-muted-foreground">Upload previous meeting documents</p>
        {/* TODO: Implement file upload functionality */}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>Save as Draft</Button>
        <Button onClick={nextStep}>Next: Agenda/Explanatory Statement →</Button>
      </div>
    </div>
  );
};

export default LastMeetingDetails;
