import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ParticipantsManagementProps {
  formData: any;
  setFormData: (data: any) => void;
  prevStep: () => void;
  nextStep: () => void;
  saveAsDraft: () => void;
}

const ParticipantsManagement = ({ formData, setFormData, prevStep, nextStep, saveAsDraft }: ParticipantsManagementProps) => {
  const [votingParticipants, setVotingParticipants] = useState([
    { id: 1, name: "John Smith", email: "john@email.com", address: "123 Main St", distinctiveNo: "DP001", votingPercentage: "25%" },
    { id: 2, name: "Sarah Johnson", email: "sarah@email.com", address: "456 Oak Ave", distinctiveNo: "DP002", votingPercentage: "15%" },
    { id: 3, name: "Michael Brown", email: "michael@email.com", address: "789 Pine Rd", distinctiveNo: "DP003", votingPercentage: "30%" }
  ]);

  const [nonVotingInvitees, setNonVotingInvitees] = useState([
    { id: 1, name: "Robert Wilson", email: "robert@email.com", role: "Legal Advisor" },
    { id: 2, name: "Lisa Anderson", email: "lisa@email.com", role: "Auditor" }
  ]);

  const addVotingParticipant = () => {
    const newId = votingParticipants.length > 0 ? Math.max(...votingParticipants.map(p => p.id)) + 1 : 1;
    setVotingParticipants([...votingParticipants, { 
      id: newId, 
      name: "", 
      email: "", 
      address: "", 
      distinctiveNo: "", 
      votingPercentage: "0%" 
    }]);
  };

  const removeVotingParticipant = (id: number) => {
    setVotingParticipants(votingParticipants.filter(p => p.id !== id));
  };

  const addNonVotingInvitee = () => {
    const newId = nonVotingInvitees.length > 0 ? Math.max(...nonVotingInvitees.map(p => p.id)) + 1 : 1;
    setNonVotingInvitees([...nonVotingInvitees, { 
      id: newId, 
      name: "", 
      email: "", 
      role: "" 
    }]);
  };

  const removeNonVotingInvitee = (id: number) => {
    setNonVotingInvitees(nonVotingInvitees.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">List of Participants</h3>
        <p className="text-sm text-muted-foreground mb-6">Add and manage meeting participants</p>
      </div>

      <Tabs defaultValue="voting" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="voting">Voting Members</TabsTrigger>
          <TabsTrigger value="non-voting">Non-Voting Invitees</TabsTrigger>
        </TabsList>
        
        <TabsContent value="voting" className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium">Voting Members</Label>
            <Button onClick={addVotingParticipant}>+ Add Voting Member</Button>
          </div>
          
          <div className="border rounded-md">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Address</th>
                  <th className="text-left p-3 font-medium">Distinctive No.</th>
                  <th className="text-left p-3 font-medium">Voting %</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {votingParticipants.map((participant) => (
                  <tr key={participant.id} className="border-t">
                    <td className="p-2">
                      <Input 
                        value={participant.name} 
                        placeholder="Enter name"
                        className="border-none bg-transparent"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        value={participant.email} 
                        placeholder="Enter email"
                        className="border-none bg-transparent"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        value={participant.address} 
                        placeholder="Enter address"
                        className="border-none bg-transparent"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        value={participant.distinctiveNo} 
                        placeholder="DP001"
                        className="border-none bg-transparent"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        value={participant.votingPercentage} 
                        placeholder="0%"
                        className="border-none bg-transparent"
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeVotingParticipant(participant.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
        
        <TabsContent value="non-voting" className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-base font-medium">Non-Voting Invitees</Label>
            <Button onClick={addNonVotingInvitee}>+ Add Invitee</Button>
          </div>
          
          <div className="border rounded-md">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Role</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {nonVotingInvitees.map((invitee) => (
                  <tr key={invitee.id} className="border-t">
                    <td className="p-2">
                      <Input 
                        value={invitee.name} 
                        placeholder="Enter name"
                        className="border-none bg-transparent"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        value={invitee.email} 
                        placeholder="Enter email"
                        className="border-none bg-transparent"
                      />
                    </td>
                    <td className="p-2">
                      <Input 
                        value={invitee.role} 
                        placeholder="Enter role"
                        className="border-none bg-transparent"
                      />
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeNonVotingInvitee(invitee.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td colSpan={4} className="p-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start" 
                      onClick={addNonVotingInvitee}
                    >
                      + Add New Invitee
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4 pt-4">
        <Button variant="outline" onClick={prevStep}>← Back</Button>
        <Button variant="outline" onClick={saveAsDraft}>Save as Draft</Button>
        <Button onClick={nextStep}>Next: Documents →</Button>
      </div>
    </div>
  );
};

export default ParticipantsManagement;
