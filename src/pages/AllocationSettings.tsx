import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Settings, CheckCircle, SplitSquareHorizontal, Scale3D } from "lucide-react";

interface TeamMember { id: string; name: string; }

const mockTeam: TeamMember[] = [
  { id: 'tm-1', name: 'John Doe' },
  { id: 'tm-2', name: 'Jane Smith' },
  { id: 'tm-3', name: 'Mike Johnson' },
  { id: 'tm-4', name: 'Priya Kapoor' },
];

export default function AllocationSettings() {
  const { toast } = useToast();
  const [entity, setEntity] = useState('entity-1');
  const [activeTab, setActiveTab] = useState('global');

  // Global rules state (applies to all claims under entity)
  const [globalRules, setGlobalRules] = useState({
    verificationAllocator: '',
    admissionAllocator: '',
    distributeEqually: false,
    distributeBy: 'fixed_amount' as 'fixed_amount' | 'claims_or_amount' | 'range',
    fixedAmount: 1000000,
    considerNumClaimants: true,
    considerClaimedAmount: false,
    amountRangeMin: 0,
    amountRangeMax: 5000000,
    claimantRangeMin: 1,
    claimantRangeMax: 20,
  });

  const applyGlobalRules = () => {
    toast({
      title: 'Global Allocation Rules Saved',
      description: 'All incoming claims for the selected entity will follow these rules. You can still modify allocation per claim.',
    });
  };

  const runGlobalDistribution = () => {
    toast({
      title: 'Claims Distributed',
      description: 'Claims have been equally distributed to team members based on the selected parameters.',
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Claim Allocation Settings</h1>
            <p className="text-gray-600 mt-1">Define rules to automatically allocate claims to team members</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={entity} onValueChange={setEntity}>
              <SelectTrigger className="w-[220px]"><SelectValue placeholder="Select Entity" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="entity-1">ABC Corporation Ltd</SelectItem>
                <SelectItem value="entity-2">XYZ Industries Ltd</SelectItem>
                <SelectItem value="entity-3">PQR Services Ltd</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList>
            <TabsTrigger value="global"><Settings className="w-4 h-4 mr-2"/>Global Rules</TabsTrigger>
            <TabsTrigger value="distribute"><SplitSquareHorizontal className="w-4 h-4 mr-2"/>Distribute</TabsTrigger>
          </TabsList>

          {/* Global Rules */}
          <TabsContent value="global">
            <Card>
              <CardHeader>
                <CardTitle>Global Allocation for All Claims under Entity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Default Verifier</Label>
                    <Select value={globalRules.verificationAllocator} onValueChange={(v)=>setGlobalRules(prev=>({...prev, verificationAllocator:v}))}>
                      <SelectTrigger><SelectValue placeholder="Not Allocated"/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not Allocated</SelectItem>
                        {mockTeam.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Default Admitter</Label>
                    <Select value={globalRules.admissionAllocator} onValueChange={(v)=>setGlobalRules(prev=>({...prev, admissionAllocator:v}))}>
                      <SelectTrigger><SelectValue placeholder="Not Allocated"/></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Not Allocated</SelectItem>
                        {mockTeam.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="distribute" checked={globalRules.distributeEqually} onCheckedChange={(c)=>setGlobalRules(prev=>({...prev, distributeEqually: !!c}))} />
                    <Label htmlFor="distribute">Enable Equal Distribution of claims when volume is high</Label>
                  </div>

                  {globalRules.distributeEqually && (
                    <div className="space-y-4">
                      <div>
                        <Label>Distribution Method</Label>
                        <Select value={globalRules.distributeBy} onValueChange={(v:any)=>setGlobalRules(prev=>({...prev, distributeBy:v}))}>
                          <SelectTrigger><SelectValue/></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fixed_amount">Allocation by Fixed Amount</SelectItem>
                            <SelectItem value="claims_or_amount">By No. of Claimants and/or Claimed Amount</SelectItem>
                            <SelectItem value="range">Allocation by Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {globalRules.distributeBy === 'fixed_amount' && (
                        <div>
                          <Label>Fixed Amount Threshold (₹)</Label>
                          <Input type="number" className="mt-1" value={globalRules.fixedAmount} onChange={(e)=>setGlobalRules(prev=>({...prev, fixedAmount: parseInt(e.target.value||'0',10)}))} />
                          <p className="text-xs text-gray-500 mt-1">Claims up to this amount will be distributed equally across team members.</p>
                        </div>
                      )}

                      {globalRules.distributeBy === 'claims_or_amount' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2 mt-6">
                            <Checkbox id="numClaimants" checked={globalRules.considerNumClaimants} onCheckedChange={(c)=>setGlobalRules(prev=>({...prev, considerNumClaimants: !!c}))}/>
                            <Label htmlFor="numClaimants">Consider number of claimants</Label>
                          </div>
                          <div className="flex items-center space-x-2 mt-6">
                            <Checkbox id="claimedAmount" checked={globalRules.considerClaimedAmount} onCheckedChange={(c)=>setGlobalRules(prev=>({...prev, considerClaimedAmount: !!c}))}/>
                            <Label htmlFor="claimedAmount">Consider total claimed amount</Label>
                          </div>
                        </div>
                      )}

                      {globalRules.distributeBy === 'range' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Allocation Amount Range (₹)</Label>
                            <div className="flex items-center gap-3 mt-2">
                              <Input type="number" value={globalRules.amountRangeMin} onChange={(e)=>setGlobalRules(prev=>({...prev, amountRangeMin: parseInt(e.target.value||'0',10)}))} />
                              <span className="text-gray-500">to</span>
                              <Input type="number" value={globalRules.amountRangeMax} onChange={(e)=>setGlobalRules(prev=>({...prev, amountRangeMax: parseInt(e.target.value||'0',10)}))} />
                            </div>
                          </div>
                          <div>
                            <Label>Allocation Claimant Number Range</Label>
                            <div className="flex items-center gap-3 mt-2">
                              <Input type="number" value={globalRules.claimantRangeMin} onChange={(e)=>setGlobalRules(prev=>({...prev, claimantRangeMin: parseInt(e.target.value||'0',10)}))} />
                              <span className="text-gray-500">to</span>
                              <Input type="number" value={globalRules.claimantRangeMax} onChange={(e)=>setGlobalRules(prev=>({...prev, claimantRangeMax: parseInt(e.target.value||'0',10)}))} />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">System suggests ranges based on total claimants and team size.</p>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <Button onClick={applyGlobalRules}><CheckCircle className="w-4 h-4 mr-2"/>Save Global Rules</Button>
                        <Button variant="outline" onClick={runGlobalDistribution}><Scale3D className="w-4 h-4 mr-2"/>Run Distribution</Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distribute (manual helper)} */}
          <TabsContent value="distribute">
            <Card>
              <CardHeader>
                <CardTitle>Manual Distribution Helper</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">Use this to preview how claims would be split across team members before confirming.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {mockTeam.map(m => (
                    <div key={m.id} className="p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600"/>
                        <span className="font-medium">{m.name}</span>
                      </div>
                      <div className="mt-3">
                        <Label>Projected Allocation (claims)</Label>
                        <Slider defaultValue={[3]} max={10} step={1} className="mt-2"/>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button onClick={()=>toast({title:'Distribution Confirmed', description:'Allocations saved and applied across team members.'})}>
                    <CheckCircle className="w-4 h-4 mr-2"/>Confirm & Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
