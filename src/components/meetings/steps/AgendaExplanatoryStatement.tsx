import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Save } from "lucide-react";

interface AgendaItem {
  id: number;
  title: string;
  description: string;
  type: 'ordinary' | 'special';
}

interface AgendaExplanatoryStatementProps {
  formData: any;
  setFormData: (data: any) => void;
  prevStep: () => void;
  nextStep: () => void;
  saveAsDraft: () => void;
}

const AgendaExplanatoryStatement = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }: AgendaExplanatoryStatementProps) => {
  const [useAIGeneration, setUseAIGeneration] = useState(false);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    { id: 1, title: "To receive, consider and adopt the Audited Financial Statements", description: "Review and approve the annual financial statements", type: 'ordinary' },
    { id: 2, title: "To appoint Auditors", description: "Appointment of statutory auditors for the next financial year", type: 'ordinary' }
  ]);

  const addAgendaItem = () => {
    const newId = agendaItems.length > 0 ? Math.max(...agendaItems.map(item => item.id)) + 1 : 1;
    setAgendaItems([...agendaItems, {
      id: newId,
      title: "",
      description: "",
      type: 'ordinary'
    }]);
  };

  const removeAgendaItem = (id: number) => {
    setAgendaItems(agendaItems.filter(item => item.id !== id));
  };

  const updateAgendaItem = (id: number, field: keyof AgendaItem, value: string) => {
    setAgendaItems(agendaItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const generateAIAgenda = () => {
    // Placeholder for AI generation
    console.log("Generating AI agenda...");
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Agenda/Explanatory Statement</h3>
        <p className="text-sm text-muted-foreground mb-6">Create meeting agenda and explanatory statements</p>
      </div>

      {/* AI Generation Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI-Powered Agenda Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="ai-generation"
              checked={useAIGeneration}
              onCheckedChange={setUseAIGeneration}
            />
            <Label htmlFor="ai-generation">Enable AI agenda generation</Label>
          </div>
          
          {useAIGeneration && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="ai-prompt">AI Generation Prompt:</Label>
                <Textarea
                  id="ai-prompt"
                  placeholder="Describe what you want to include in the agenda..."
                  className="min-h-20"
                />
              </div>
              <Button onClick={generateAIAgenda} className="w-full">
                Generate Agenda with AI
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Manual Agenda Items */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base">Agenda Items</CardTitle>
            <Button onClick={addAgendaItem} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {agendaItems.map((item, index) => (
            <div key={item.id} className="border rounded-md p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 space-y-3">
                  <div>
                    <Label htmlFor={`agenda-title-${item.id}`}>
                      Agenda Item {index + 1} Title:
                    </Label>
                    <Input
                      id={`agenda-title-${item.id}`}
                      value={item.title}
                      onChange={(e) => updateAgendaItem(item.id, 'title', e.target.value)}
                      placeholder="Enter agenda item title"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`agenda-desc-${item.id}`}>Description:</Label>
                    <Textarea
                      id={`agenda-desc-${item.id}`}
                      value={item.description}
                      onChange={(e) => updateAgendaItem(item.id, 'description', e.target.value)}
                      placeholder="Enter detailed description"
                      className="min-h-20"
                    />
                  </div>
                  
                  <div>
                    <Label>Type:</Label>
                    <div className="flex space-x-4 mt-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`type-${item.id}`}
                          value="ordinary"
                          checked={item.type === 'ordinary'}
                          onChange={(e) => updateAgendaItem(item.id, 'type', e.target.value as 'ordinary' | 'special')}
                        />
                        <span>Ordinary Business</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`type-${item.id}`}
                          value="special"
                          checked={item.type === 'special'}
                          onChange={(e) => updateAgendaItem(item.id, 'type', e.target.value as 'ordinary' | 'special')}
                        />
                        <span>Special Business</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAgendaItem(item.id)}
                  className="ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Explanatory Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Explanatory Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Enter explanatory statement for special business items..."
            className="min-h-32"
          />
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>
          <Save className="w-4 h-4 mr-2" />
          Save as Draft
        </Button>
        <Button onClick={nextStep}>Next: Reminder Settings →</Button>
      </div>
    </div>
  );
};

export default AgendaExplanatoryStatement;
