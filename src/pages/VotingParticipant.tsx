import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Vote, 
  Clock, 
  CheckCircle, 
  Shield,
  Download,
  Bell,
  AlertTriangle,
  Users,
  FileText
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { votingService } from "@/services/votingService";
import { VotingRequest, Resolution, VoteChoice } from "@/types/voting";
import { statusToPhase } from "@/utils/votingStatus";
import { format } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const VotingParticipant = () => {
  return (
    <DashboardLayout>
      <VotingParticipantModule />
    </DashboardLayout>
  );
};

const VotingParticipantModule = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [votingRequest, setVotingRequest] = useState<VotingRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState<Record<string, VoteChoice>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);

  // Mock current participant - in real app, this would come from auth context
  const currentParticipant = {
    id: "1",
    name: "John Smith",
    votingShare: 25
  };

  useEffect(() => {
    if (id) {
      loadVotingRequest();
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadVotingRequest = async () => {
    try {
      setLoading(true);
      const data = await votingService.getVotingRequest(id!);
      if (data) {
        setVotingRequest(data);
        // Initialize votes from existing participant votes
        const existingVotes: Record<string, VoteChoice> = {};
        data.resolutions.forEach(resolution => {
          const participantVote = resolution.votes.find(v => v.participantId === currentParticipant.id);
          if (participantVote) {
            existingVotes[resolution.id] = participantVote.choice;
          }
        });
        setVotes(existingVotes);
      } else {
        navigate("/voting");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load voting request",
        variant: "destructive",
      });
      navigate("/voting");
    } finally {
      setLoading(false);
    }
  };

  const handleVoteChange = (resolutionId: string, choice: VoteChoice) => {
    setVotes(prev => ({ ...prev, [resolutionId]: choice }));
  };

  const handleLockVote = async (resolutionId: string) => {
    if (!votes[resolutionId]) {
      toast({
        title: "Error",
        description: "Please select a vote option first",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(resolutionId);
      await votingService.castVote(id!, resolutionId, currentParticipant.id, votes[resolutionId]);
      
      // Reload data to get updated state
      await loadVotingRequest();
      
      toast({
        title: "Success",
        description: "Your vote has been recorded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit vote",
        variant: "destructive",
      });
    } finally {
      setSubmitting(null);
    }
  };

  const calculateTimeRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Voting period has ended";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days} days, ${hours} hours`;
    return `${hours} hours`;
  };

  const getResolutionStatus = (resolution: Resolution) => {
    const participantVote = resolution.votes.find(v => v.participantId === currentParticipant.id);
    if (participantVote) {
      return {
        status: "voted" as const,
        choice: participantVote.choice,
        votedAt: participantVote.votedAt
      };
    }
    return { status: "pending" as const };
  };

  const getVoteChoiceLabel = (choice: VoteChoice) => {
    switch (choice) {
      case "agree": return "Agree";
      case "disagree": return "Disagree";
      case "abstain": return "Abstain";
    }
  };

  const calculateVotingProgress = () => {
    if (!votingRequest) return 0;
    const totalResolutions = votingRequest.resolutions.length;
    const votedResolutions = votingRequest.resolutions.filter(r => 
      r.votes.some(v => v.participantId === currentParticipant.id)
    ).length;
    return Math.round((votedResolutions / totalResolutions) * 100);
  };

  const getPendingResolutionsCount = () => {
    if (!votingRequest) return 0;
    return votingRequest.resolutions.filter(r => 
      !r.votes.some(v => v.participantId === currentParticipant.id)
    ).length;
  };

  const getParticipationStats = () => {
    if (!votingRequest) return { participation: 0, resolution1: 0, resolution2: 0 };
    
    const totalParticipants = votingRequest.totalParticipants;
    const votedParticipants = votingRequest.votedParticipants;
    const participation = Math.round((votedParticipants / totalParticipants) * 100);
    
    // Mock resolution stats - in real app, calculate from actual votes
    return {
      participation,
      resolution1: 65,
      resolution2: 85
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32" />
        <Skeleton className="h-96" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!votingRequest) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Voting Request Not Found</h2>
        <p className="text-gray-600 mt-2">The voting request you're looking for doesn't exist or you don't have access to it.</p>
        <Button className="mt-4" onClick={() => navigate("/voting")}>
          Back to Voting Dashboard
        </Button>
      </div>
    );
  }

  const stats = getParticipationStats();
  const phase = statusToPhase(votingRequest.status);

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Vote className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">E-VOTING PORTAL</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                Secure Session Active
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">{votingRequest.title}</h2>
              <p className="text-gray-600">{votingRequest.entityName}</p>
              <p className="text-sm text-gray-500">Meeting ID: {votingRequest.id}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium">Participant:</span> {currentParticipant.name}
              </div>
              <div>
                <span className="font-medium">Your Voting Share:</span> {currentParticipant.votingShare}%
              </div>
              <div>
                <span className="font-medium">Time Remaining:</span> 
                <span className="text-orange-600 ml-1">
                  ⏰ {calculateTimeRemaining(votingRequest.endDate)}
                </span>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <span className="font-medium">Voting Period:</span> {format(new Date(votingRequest.startDate), 'MMMM dd, yyyy HH:mm a')} - {format(new Date(votingRequest.endDate), 'MMMM dd, yyyy HH:mm a')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resolutions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resolutions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {votingRequest.resolutions.map((resolution, index) => {
            const resolutionStatus = getResolutionStatus(resolution);
            const isVoted = resolutionStatus.status === "voted";
            
            return (
              <div key={resolution.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold">
                    Resolution {index + 1}: {resolution.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    {isVoted ? (
                      <Badge className="bg-green-100 text-green-800">
                        ✅ Voted ({getVoteChoiceLabel(resolutionStatus.choice!)})
                      </Badge>
                    ) : (
                      <Badge variant="secondary">⚪ Pending</Badge>
                    )}
                  </div>
                </div>

                <div className="border-b pb-4 mb-4">
                  <p className="text-gray-700 leading-relaxed">{resolution.description}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Required to Pass:</span> {resolution.minimumPassPercentage}% of {resolution.calculationBase === "total_vote" ? "total voting shares" : "votes present"}
                  </p>
                </div>

                {isVoted ? (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-medium">Your Vote: ✅ {getVoteChoiceLabel(resolutionStatus.choice!)}</span>
                    </div>
                    <p className="text-sm text-green-600 mt-1">
                      Submitted: {format(new Date(resolutionStatus.votedAt!), 'MMMM dd, yyyy HH:mm a')}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-base font-medium">Your Vote:</Label>
                      <RadioGroup
                        value={votes[resolution.id] || ""}
                        onValueChange={(value) => handleVoteChange(resolution.id, value as VoteChoice)}
                        className="flex gap-6 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="agree" id={`agree-${resolution.id}`} />
                          <Label htmlFor={`agree-${resolution.id}`}>Agree</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="disagree" id={`disagree-${resolution.id}`} />
                          <Label htmlFor={`disagree-${resolution.id}`}>Disagree</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="abstain" id={`abstain-${resolution.id}`} />
                          <Label htmlFor={`abstain-${resolution.id}`}>Abstain</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <Button 
                      onClick={() => handleLockVote(resolution.id)}
                      disabled={!votes[resolution.id] || submitting === resolution.id}
                      className="w-auto"
                    >
                      {submitting === resolution.id ? "Submitting..." : "Lock Vote"}
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Voting Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Vote className="h-5 w-5" />
            Voting Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Progress: {votingRequest.resolutions.length - getPendingResolutionsCount()} of {votingRequest.resolutions.length} resolutions voted</span>
              <span>{calculateVotingProgress()}%</span>
            </div>
            <Progress value={calculateVotingProgress()} className="h-3" />
          </div>

          {getPendingResolutionsCount() > 0 && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <span className="text-amber-800">
                You have {getPendingResolutionsCount()} pending resolution(s) requiring your vote
              </span>
            </div>
          )}

          <div className="flex gap-4">
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              Request Extension
            </Button>
            {phase === 'concluded' && (
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Voting Summary
              </Button>
            )}
            <Button variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Set Reminder
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Participants */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Participants
          </CardTitle>
          <p className="text-sm text-gray-600">(Visible as per meeting type and law requirements)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Participants:</span> {votingRequest.totalParticipants}
            </div>
            <div>
              <span className="font-medium">Voted:</span> {votingRequest.votedParticipants} ({stats.participation}%)
            </div>
            <div>
              <span className="font-medium">Pending:</span> {votingRequest.totalParticipants - votingRequest.votedParticipants} ({100 - stats.participation}%)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-semibold">{stats.participation}% Participation</div>
                <Progress value={stats.participation} className="h-2 mt-2" />
              </CardContent>
            </Card>
            {phase === 'concluded' ? (
              <>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-semibold">Resolution 1</div>
                    <div className="text-sm text-gray-600">{stats.resolution1}% in favor</div>
                    <div className="text-xs text-gray-500">(needs 51%)</div>
                    <Progress value={stats.resolution1} className="h-2 mt-2" />
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-lg font-semibold">Resolution 2</div>
                    <div className="text-sm text-gray-600">{stats.resolution2}% in favor</div>
                    <div className="text-xs text-gray-500">(needs 66%)</div>
                    <Progress value={stats.resolution2} className="h-2 mt-2" />
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="md:col-span-2">
                <CardContent className="p-4 text-center text-sm text-gray-600">
                  Detailed in-favor/against breakdown will be available after voting concludes.
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VotingParticipant;
