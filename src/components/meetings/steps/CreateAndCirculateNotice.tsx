import { Button } from "@/components/ui/button";

interface CreateAndCirculateNoticeProps {
  formData: any;
  setFormData: (data: any) => void;
  prevStep: () => void;
  saveAsDraft: () => void;
  submitMeeting: () => void;
}

const CreateAndCirculateNotice = ({ formData, setFormData, prevStep, saveAsDraft, submitMeeting }: CreateAndCirculateNoticeProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Create and Circulate Notice</h3>
        <p className="text-sm text-muted-foreground mb-6">Create meeting notice and circulation settings</p>
      </div>

      <div className="border rounded-md p-6 text-center">
        <p className="text-muted-foreground">Create meeting notice and circulation settings</p>
        {/* TODO: Implement notice creation and circulation functionality */}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>Save as Draft</Button>
        <Button onClick={submitMeeting}>Create & Circulate Meeting</Button>
      </div>
    </div>
  );
};

export default CreateAndCirculateNotice;
