import { Button } from "@/components/ui/button";

interface ReminderSettingsProps {
  formData: any;
  setFormData: (data: any) => void;
  prevStep: () => void;
  nextStep: () => void;
  saveAsDraft: () => void;
}

const ReminderSettings = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }: ReminderSettingsProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Reminder Settings</h3>
        <p className="text-sm text-muted-foreground mb-6">Configure meeting reminders and notifications</p>
      </div>

      <div className="border rounded-md p-6 text-center">
        <p className="text-muted-foreground">Configure meeting reminders</p>
        {/* TODO: Implement reminder settings functionality */}
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>Save as Draft</Button>
        <Button onClick={nextStep}>Next: Chairperson of Meeting →</Button>
      </div>
    </div>
  );
};

export default ReminderSettings;
