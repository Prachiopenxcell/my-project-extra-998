import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Upload, FileText, Plus, X, Sparkles, Edit } from "lucide-react";

interface FileUpload {
  id: number;
  name: string;
  size: string;
  type: string;
}

interface AgendaItem {
  id: number;
  title: string;
  isEditable: boolean;
  isAISuggested?: boolean;
}

interface LastMeetingDetailsProps {
  formData: {
    agendaItems?: AgendaItem[];
    uploadedFiles?: FileUpload[];
    [key: string]: any;
  };
  setFormData: (data: any) => void;
  prevStep: () => void;
  nextStep: () => void;
  saveAsDraft: () => void;
}

const LastMeetingDetails = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }: LastMeetingDetailsProps) => {
  const [agendaItems, setAgendaItems] = useState(formData.agendaItems || []);
  const [newAgendaItem, setNewAgendaItem] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState(formData.uploadedFiles || []);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  // AI suggested agenda items based on meeting type
  const aiSuggestedAgenda = [
    "Confirmation of previous meeting minutes",
    "Chairman's opening remarks",
    "Financial performance review",
    "Approval of annual budget",
    "Board composition and appointments",
    "Risk management update",
    "Compliance and regulatory matters",
    "Any other business"
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles: FileUpload[] = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      type: file.type
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
    setFormData(prev => ({ ...prev, uploadedFiles: [...uploadedFiles, ...newFiles] }));
  };

  const removeFile = (fileId) => {
    const updatedFiles = uploadedFiles.filter(file => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    setFormData(prev => ({ ...prev, uploadedFiles: updatedFiles }));
  };

  const addAgendaItem = () => {
    if (newAgendaItem.trim()) {
      const newItem = {
        id: Date.now(),
        title: newAgendaItem.trim(),
        isEditable: true
      };
      const updatedItems = [...agendaItems, newItem];
      setAgendaItems(updatedItems);
      setFormData(prev => ({ ...prev, agendaItems: updatedItems }));
      setNewAgendaItem("");
    }
  };

  const addAISuggestedItem = (suggestion) => {
    const newItem = {
      id: Date.now(),
      title: suggestion,
      isEditable: true,
      isAISuggested: true
    };
    const updatedItems = [...agendaItems, newItem];
    setAgendaItems(updatedItems);
    setFormData(prev => ({ ...prev, agendaItems: updatedItems }));
  };

  const removeAgendaItem = (itemId) => {
    const updatedItems = agendaItems.filter(item => item.id !== itemId);
    setAgendaItems(updatedItems);
    setFormData(prev => ({ ...prev, agendaItems: updatedItems }));
  };

  const updateAgendaItem = (itemId, newTitle) => {
    const updatedItems = agendaItems.map(item => 
      item.id === itemId ? { ...item, title: newTitle } : item
    );
    setAgendaItems(updatedItems);
    setFormData(prev => ({ ...prev, agendaItems: updatedItems }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Last Meeting Details</h3>
        <p className="text-sm text-muted-foreground mb-6">Upload previous meeting documents and manage agenda items for notice generation</p>
      </div>

      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Previous Meeting Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Upload minutes, resolutions, or other documents from previous meetings
            </p>
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt"
            />
            <Label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer">
                Choose Files
              </Button>
            </Label>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Uploaded Files:</Label>
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{file.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Agenda Items Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Agenda Items for Notice
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Add agenda items to be included in the meeting notice. These will be editable in the generated notice.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Agenda Item */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter new agenda item"
              value={newAgendaItem}
              onChange={(e) => setNewAgendaItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addAgendaItem()}
              className="flex-1"
            />
            <Button onClick={addAgendaItem} disabled={!newAgendaItem.trim()}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>

          {/* AI Suggestions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => setShowAISuggestions(!showAISuggestions)}
              className="w-full"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {showAISuggestions ? 'Hide' : 'Show'} AI Suggested Agenda Items
            </Button>

            {showAISuggestions && (
              <div className="border rounded-lg p-4 bg-blue-50">
                <p className="text-sm font-medium mb-3">AI Suggested Agenda Items:</p>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestedAgenda.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-100"
                      onClick={() => addAISuggestedItem(suggestion)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Current Agenda Items */}
          {agendaItems.length > 0 && (
            <div className="space-y-3">
              <Label>Current Agenda Items:</Label>
              {agendaItems.map((item, index) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-500 min-w-[2rem]">
                    {index + 1}.
                  </span>
                  <Input
                    value={item.title}
                    onChange={(e) => updateAgendaItem(item.id, e.target.value)}
                    className="flex-1 bg-white"
                  />
                  {item.isAISuggested && (
                    <Badge variant="secondary" className="text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAgendaItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {agendaItems.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No agenda items added yet</p>
              <p className="text-sm">Add items manually or use AI suggestions</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>Save as Draft</Button>
        <Button onClick={nextStep}>Next: Participants →</Button>
      </div>
    </div>
  );
};

export default LastMeetingDetails;
