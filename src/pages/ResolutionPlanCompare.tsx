import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Target } from 'lucide-react';

interface NPVAnalysis {
  discountingFactor: number;
  cirpCost: number;
  liquidationCost: number;
  liquidatorFee: number;
  statutoryClaims: number;
  netDistribution: number;
}

interface Plan {
  id: string;
  praName: string;
  groupType: 'standalone' | 'group';
  entityType: 'company' | 'partnership' | 'individual' | 'fund';
  submissionDate: string;
  status: 'submitted' | 'under-review' | 'approved' | 'rejected' | 'modified';
  planValue: number;
  liquidationValue: number;
  fairValue: number;
  complianceScore: number;
  npvAnalysis: NPVAnalysis;
  documents: { id: string; name: string }[];
  queries: { id: string }[];
}

const mockPlans: Plan[] = [
  {
    id: '1', praName: 'Resolution Partners LLC', groupType: 'standalone', entityType: 'company',
    submissionDate: '2024-02-10', status: 'under-review', planValue: 15000000, liquidationValue: 12000000, fairValue: 18000000,
    complianceScore: 92,
    npvAnalysis: { discountingFactor: 12.5, cirpCost: 500000, liquidationCost: 800000, liquidatorFee: 300000, statutoryClaims: 200000, netDistribution: 13200000 },
    documents: [{ id: '1', name: 'Resolution Plan - Main Document.pdf' }],
    queries: [{ id: '1' }]
  },
  {
    id: '2', praName: 'Strategic Investments Ltd.', groupType: 'group', entityType: 'company',
    submissionDate: '2024-02-12', status: 'submitted', planValue: 18500000, liquidationValue: 14000000, fairValue: 20000000,
    complianceScore: 78,
    npvAnalysis: { discountingFactor: 11.0, cirpCost: 450000, liquidationCost: 750000, liquidatorFee: 280000, statutoryClaims: 180000, netDistribution: 17340000 },
    documents: [{ id: '3', name: 'Resolution Plan Document.pdf' }],
    queries: []
  }
];

const ResolutionPlanCompare: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const left = useMemo(() => mockPlans.find(p => p.id === id) || mockPlans[0], [id]);
  const [rightId, setRightId] = useState<string>('');
  const right = useMemo(() => mockPlans.find(p => p.id === rightId), [rightId]);

  const fmt = (n: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const row = (label: string, l: React.ReactNode, r: React.ReactNode) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border-b py-2">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="font-medium">{l}</div>
      <div className="font-medium">{r}</div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/resolution/plans')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Plans
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Compare Resolution Plans</h1>
              <p className="text-muted-foreground">Select another plan to compare against {left.praName}</p>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" /> Side-by-side Comparison
            </CardTitle>
            <CardDescription>Review key metrics across both plans</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-md p-3">
                <div className="font-semibold">{left.praName}</div>
                <div className="text-sm text-muted-foreground">{left.groupType} • {left.entityType}</div>
                <div className="text-sm">Submitted: {new Date(left.submissionDate).toLocaleDateString()}</div>
              </div>
              <div className="border rounded-md p-3">
                <Select value={rightId} onValueChange={setRightId}>
                  <SelectTrigger><SelectValue placeholder="Select plan to compare" /></SelectTrigger>
                  <SelectContent>
                    {mockPlans.filter(p => p.id !== left.id).map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.praName}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {right && (
                  <div className="mt-2">
                    <div className="font-semibold">{right.praName}</div>
                    <div className="text-sm text-muted-foreground">{right.groupType} • {right.entityType}</div>
                    <div className="text-sm">Submitted: {new Date(right.submissionDate).toLocaleDateString()}</div>
                  </div>
                )}
              </div>
            </div>

            {row('Plan Value', fmt(left.planValue), right ? fmt(right.planValue) : '—')}
            {row('Compliance Score', `${left.complianceScore}%`, right ? `${right.complianceScore}%` : '—')}
            {row('Documents', left.documents.length, right ? right.documents.length : '—')}
            {row('Queries', left.queries.length, right ? right.queries.length : '—')}

            <div className="border rounded-md p-3">
              <div className="font-medium mb-2">NPV Analysis</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">Discount Factor</div>
                  <div>{left.npvAnalysis.discountingFactor}% vs {right ? `${right.npvAnalysis.discountingFactor}%` : '—'}</div>
                </div>
                {/* <div>
                  <div className="text-xs text-muted-foreground">CIRP Cost</div>
                  <div>{fmt(left.npvAnalysis.cirpCost)} vs {right ? fmt(right.npvAnalysis.cirpCost) : '—'}</div>
                </div> */}
                <div>
                  <div className="text-xs text-muted-foreground">Net Distribution</div>
                  <div>{fmt(left.npvAnalysis.netDistribution)} vs {right ? fmt(right.npvAnalysis.netDistribution) : '—'}</div>
                </div>
              </div>
            </div>

            {!right && (
              <div className="text-sm text-muted-foreground">Select another plan on the right to complete the comparison.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ResolutionPlanCompare;
