import { Button } from "@/components/ui/button";

interface ScrutinizerSelectionProps {
  formData: any;
  setFormData: (data: any) => void;
  prevStep: () => void;
  nextStep: () => void;
  saveAsDraft: () => void;
}

const ScrutinizerSelection = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }: ScrutinizerSelectionProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Scrutinizer Selection</h3>
        <p className="text-sm text-muted-foreground mb-6">Select meeting scrutinizer</p>
      </div>

      <div className="border rounded-md p-6 text-center">
        <p className="text-muted-foreground">Select meeting scrutinizer</p>
        {/* TODO: Implement scrutinizer selection functionality */}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>Save as Draft</Button>
        <Button onClick={nextStep}>Next: Enable Voting →</Button>
      </div>
    </div>
  );
};

export default ScrutinizerSelection;
