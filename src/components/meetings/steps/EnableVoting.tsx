import { Button } from "@/components/ui/button";

interface EnableVotingProps {
  formData: any;
  setFormData: (data: any) => void;
  prevStep: () => void;
  nextStep: () => void;
  saveAsDraft: () => void;
}

const EnableVoting = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }: EnableVotingProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Enable Voting</h3>
        <p className="text-sm text-muted-foreground mb-6">Configure voting settings for the meeting</p>
      </div>

      <div className="border rounded-md p-6 text-center">
        <p className="text-muted-foreground">Configure voting settings</p>
        {/* TODO: Implement voting configuration functionality */}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>Save as Draft</Button>
        <Button onClick={nextStep}>Next: Create and Circulate Notice →</Button>
      </div>
    </div>
  );
};

export default EnableVoting;
