import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import {
  Users,
  UserPlus,
  Mail,
  Phone,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  Plus,
  Minus,
  Search,
  Filter,
  ArrowLeft,
  Calendar,
  Award,
  Briefcase,
  Globe,
  Shield,
  TrendingUp,
  MessageSquare,
  ExternalLink,
  UserCheck,
  History,
  Zap,
  Target
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";
import { professionalInvitationService } from "@/services/professionalInvitationService";
import {
  Professional,
  ProfessionalProfile,
  ProfessionalSelectionCriteria,
  ProfessionalInvitationStats
} from "@/types/professionalInvitation";

const ProfessionalInvitation = () => {
  const { serviceRequestId } = useParams<{ serviceRequestId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("selection");

  // Selection criteria state
  const [selectionCriteria, setSelectionCriteria] = useState<ProfessionalSelectionCriteria>({
    inviteChosenProfessionals: false,
    chosenProfessionalEmails: [''],
    chosenProfessionalPhones: [''],
    repeatPastProfessionals: false,
    selectedPastProfessionals: [],
    maxPlatformSuggestions: 5,
    platformSuggestedProfessionals: [],
    customInvitationMessage: '',
    invitationDeadline: undefined
  });

  // Professional lists
  const [pastProfessionals, setPastProfessionals] = useState<Professional[]>([]);
  const [platformSuggestedProfessionals, setPlatformSuggestedProfessionals] = useState<Professional[]>([]);
  const [chosenProfessionals, setChosenProfessionals] = useState<Professional[]>([]);
  const [finalInvitationList, setFinalInvitationList] = useState<Professional[]>([]);

  // UI states
  const [loadingPast, setLoadingPast] = useState(false);
  const [loadingSuggested, setLoadingSuggested] = useState(false);
  const [checkingEmails, setCheckingEmails] = useState(false);
  const [sendingInvitations, setSendingInvitations] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [invitationStats, setInvitationStats] = useState<ProfessionalInvitationStats | null>(null);

  // Load initial data
  useEffect(() => {
    if (serviceRequestId) {
      loadInvitationStats();
    }
  }, [serviceRequestId]);

  // Load invitation stats
  const loadInvitationStats = useCallback(async () => {
    try {
      const stats = await professionalInvitationService.getInvitationStats(serviceRequestId!);
      setInvitationStats(stats);
    } catch (error) {
      console.error('Failed to load invitation stats:', error);
    }
  }, [serviceRequestId]);

  // Load past professionals
  const loadPastProfessionals = useCallback(async () => {
    if (!user?.id) return;
    
    setLoadingPast(true);
    try {
      const professionals = await professionalInvitationService.getPastProfessionals(user.id);
      setPastProfessionals(professionals);
    } catch (error) {
      console.error('Failed to load past professionals:', error);
      toast({
        title: "Error",
        description: "Failed to load past professionals",
        variant: "destructive",
      });
    } finally {
      setLoadingPast(false);
    }
  }, [user?.id]);

  // Load platform suggested professionals
  const loadPlatformSuggestedProfessionals = useCallback(async () => {
    if (!serviceRequestId) return;
    
    setLoadingSuggested(true);
    try {
      const professionals = await professionalInvitationService.getPlatformSuggestedProfessionals(
        serviceRequestId,
        [],
        selectionCriteria.maxPlatformSuggestions
      );
      setPlatformSuggestedProfessionals(professionals);
    } catch (error) {
      console.error('Failed to load platform suggested professionals:', error);
      toast({
        title: "Error",
        description: "Failed to load suggested professionals",
        variant: "destructive",
      });
    } finally {
      setLoadingSuggested(false);
    }
  }, [serviceRequestId, selectionCriteria.maxPlatformSuggestions]);

  useEffect(() => {
    loadInvitationStats();
  }, [loadInvitationStats]);

  // Load past professionals when checkbox is checked
  useEffect(() => {
    if (selectionCriteria.repeatPastProfessionals && user?.id) {
      loadPastProfessionals();
    }
  }, [selectionCriteria.repeatPastProfessionals, user?.id, loadPastProfessionals]);

  // Load platform suggested professionals
  useEffect(() => {
    if (serviceRequestId) {
      loadPlatformSuggestedProfessionals();
    }
  }, [serviceRequestId, loadPlatformSuggestedProfessionals]);



  const checkChosenProfessionals = async () => {
    setCheckingEmails(true);
    try {
      const foundProfessionals: Professional[] = [];
      const emails = selectionCriteria.chosenProfessionalEmails.filter(email => email.trim());
      const phones = selectionCriteria.chosenProfessionalPhones.filter(phone => phone.trim());

      for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const phone = phones[i];
        const professional = await professionalInvitationService.checkProfessionalExists(email, phone);
        if (professional) {
          foundProfessionals.push({ ...professional, isChosenProfessional: true });
        }
      }

      setChosenProfessionals(foundProfessionals);
      
      if (foundProfessionals.length > 0) {
        toast({
          title: "Professionals Found",
          description: `Found ${foundProfessionals.length} registered professionals from your list.`
        });
      }

      const externalEmails = emails.filter(email => 
        !foundProfessionals.some(prof => prof.email.toLowerCase() === email.toLowerCase())
      );
      
      if (externalEmails.length > 0) {
        toast({
          title: "External Invitations",
          description: `${externalEmails.length} professionals will receive registration invitations.`
        });
      }

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check professional details.",
        variant: "destructive"
      });
    } finally {
      setCheckingEmails(false);
    }
  };

  const addEmailField = () => {
    setSelectionCriteria(prev => ({
      ...prev,
      chosenProfessionalEmails: [...prev.chosenProfessionalEmails, ''],
      chosenProfessionalPhones: [...prev.chosenProfessionalPhones, '']
    }));
  };

  const removeEmailField = (index: number) => {
    setSelectionCriteria(prev => ({
      ...prev,
      chosenProfessionalEmails: prev.chosenProfessionalEmails.filter((_, i) => i !== index),
      chosenProfessionalPhones: prev.chosenProfessionalPhones.filter((_, i) => i !== index)
    }));
  };

  const updateEmailField = (index: number, email: string) => {
    setSelectionCriteria(prev => ({
      ...prev,
      chosenProfessionalEmails: prev.chosenProfessionalEmails.map((e, i) => i === index ? email : e)
    }));
  };

  const updatePhoneField = (index: number, phone: string) => {
    setSelectionCriteria(prev => ({
      ...prev,
      chosenProfessionalPhones: prev.chosenProfessionalPhones.map((p, i) => i === index ? phone : p)
    }));
  };

  const togglePastProfessional = (professionalId: string) => {
    setSelectionCriteria(prev => ({
      ...prev,
      selectedPastProfessionals: prev.selectedPastProfessionals.includes(professionalId)
        ? prev.selectedPastProfessionals.filter(id => id !== professionalId)
        : [...prev.selectedPastProfessionals, professionalId]
    }));
  };

  const togglePlatformSuggested = (professionalId: string) => {
    setSelectionCriteria(prev => ({
      ...prev,
      platformSuggestedProfessionals: prev.platformSuggestedProfessionals.includes(professionalId)
        ? prev.platformSuggestedProfessionals.filter(id => id !== professionalId)
        : [...prev.platformSuggestedProfessionals, professionalId]
    }));
  };

  const prepareFinalInvitationList = useCallback(() => {
    const finalList: Professional[] = [];

    // Add chosen professionals
    if (selectionCriteria.inviteChosenProfessionals) {
      finalList.push(...chosenProfessionals);
    }

    // Add selected past professionals
    if (selectionCriteria.repeatPastProfessionals) {
      const selectedPast = pastProfessionals.filter(prof => 
        selectionCriteria.selectedPastProfessionals.includes(prof.id)
      );
      finalList.push(...selectedPast);
    }

    // Add platform suggested professionals
    const selectedSuggested = platformSuggestedProfessionals.filter(prof =>
      selectionCriteria.platformSuggestedProfessionals.includes(prof.id)
    );
    finalList.push(...selectedSuggested);

    setFinalInvitationList(finalList);
  }, [
    selectionCriteria,
    chosenProfessionals,
    pastProfessionals,
    platformSuggestedProfessionals
  ]);

  useEffect(() => {
    prepareFinalInvitationList();
  }, [prepareFinalInvitationList]);

  const sendInvitations = async () => {
    if (finalInvitationList.length === 0) {
      toast({
        title: "No Professionals Selected",
        description: "Please select at least one professional to invite.",
        variant: "destructive"
      });
      return;
    }

    setSendingInvitations(true);
    try {
      // Send invitations to registered professionals
      const registeredProfessionals = finalInvitationList.filter(prof => prof.isRegistered);
      if (registeredProfessionals.length > 0) {
        await professionalInvitationService.sendInvitations({
          serviceRequestId: serviceRequestId!,
          professionalIds: registeredProfessionals.map(prof => prof.id),
          customMessage: selectionCriteria.customInvitationMessage,
          deadline: selectionCriteria.invitationDeadline,
          invitedBy: user!.id,
          invitationType: 'chosen'
        });
      }

      // Send external invitations
      const externalEmails = selectionCriteria.chosenProfessionalEmails.filter(email => 
        email.trim() && !chosenProfessionals.some(prof => prof.email.toLowerCase() === email.toLowerCase())
      );
      const externalPhones = selectionCriteria.chosenProfessionalPhones.filter((phone, index) => 
        externalEmails.includes(selectionCriteria.chosenProfessionalEmails[index])
      );

      if (externalEmails.length > 0) {
        await professionalInvitationService.sendExternalInvitations(
          serviceRequestId!,
          externalEmails,
          externalPhones,
          user!.id,
          selectionCriteria.customInvitationMessage
        );
      }

      toast({
        title: "Invitations Sent",
        description: `Successfully sent invitations to ${finalInvitationList.length} professionals.`
      });

      // Navigate back to service request details
      navigate(`/service-requests/${serviceRequestId}`);

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitations. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSendingInvitations(false);
    }
  };

  const viewProfessionalProfile = async (professionalId: string) => {
    setSelectedProfileId(professionalId);
    setProfileDialogOpen(true);
  };

  const renderProfessionalCard = (professional: Professional, onToggle?: (id: string) => void, isSelected?: boolean) => (
    <Card key={professional.id} className={`transition-all duration-200 hover:shadow-md ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-gray-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900 truncate">{professional.name}</h3>
                {professional.isVerified && (
                  <Shield className="h-4 w-4 text-green-500" />
                )}
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="text-sm text-gray-600">
                  {professional.rating} ({professional.totalReviews} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-1 mt-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{professional.location}</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {professional.specialization.slice(0, 2).map((spec, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {spec}
                  </Badge>
                ))}
                {professional.specialization.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{professional.specialization.length - 2} more
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Badge 
              variant={professional.availability === 'available' ? 'default' : 'secondary'}
              className="text-xs"
            >
              {professional.availability}
            </Badge>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => viewProfessionalProfile(professional.id)}
              >
                <Eye className="h-4 w-4" />
              </Button>
              {onToggle && (
                <div className="flex justify-start">
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggle(professional.id)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStatsCards = () => {
    if (!invitationStats) return null;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Invited</p>
                <p className="text-2xl font-bold">{invitationStats.totalInvited}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">{invitationStats.pendingResponses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Accepted</p>
                <p className="text-2xl font-bold">{invitationStats.acceptedInvitations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">New Registrations</p>
                <p className="text-2xl font-bold">{invitationStats.newRegistrations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Determine user type for layout
  const isServiceSeeker = user?.role && [
    UserRole.SERVICE_SEEKER_INDIVIDUAL_PARTNER,
    UserRole.SERVICE_SEEKER_ENTITY_ADMIN,
    UserRole.SERVICE_SEEKER_TEAM_MEMBER
  ].includes(user.role);

  return (
    <DashboardLayout userType={isServiceSeeker ? "service_seeker" : "service_provider"}>
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/service-requests/${serviceRequestId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Service Request
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Invite Professionals</h1>
              <p className="text-gray-600 mt-1">
                Select and invite professionals to bid on your service request
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="selection">Professional Selection</TabsTrigger>
            <TabsTrigger value="review">Review & Send</TabsTrigger>
            <TabsTrigger value="tracking">Invitation Tracking</TabsTrigger>
          </TabsList>

          {/* Professional Selection Tab */}
          <TabsContent value="selection" className="space-y-6">
            {/* Chosen Professionals Section */}
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-2">
                  <div className="mt-1">
                    <Checkbox
                      id="invite-chosen"
                      checked={selectionCriteria.inviteChosenProfessionals}
                      onCheckedChange={(checked) => 
                        setSelectionCriteria(prev => ({ ...prev, inviteChosenProfessionals: !!checked }))
                      }
                    />
                  </div>
                  <Label htmlFor="invite-chosen" className="text-lg font-semibold">
                    Invite Chosen Professionals
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  Invite specific professionals by providing their email/mobile. If they're registered, they'll be added to your invitation list. Otherwise, they'll receive a registration invitation.
                </p>
              </CardHeader>
              {selectionCriteria.inviteChosenProfessionals && (
                <CardContent className="space-y-4">
                  {selectionCriteria.chosenProfessionalEmails.map((email, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          placeholder="Professional email"
                          value={email}
                          onChange={(e) => updateEmailField(index, e.target.value)}
                        />
                      </div>
                      <div className="flex-1">
                        <Input
                          placeholder="Professional mobile (optional)"
                          value={selectionCriteria.chosenProfessionalPhones[index] || ''}
                          onChange={(e) => updatePhoneField(index, e.target.value)}
                        />
                      </div>
                      {selectionCriteria.chosenProfessionalEmails.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeEmailField(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={addEmailField}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Professional
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={checkChosenProfessionals}
                      disabled={checkingEmails || !selectionCriteria.chosenProfessionalEmails.some(email => email.trim())}
                    >
                      {checkingEmails ? (
                        <>
                          <Skeleton className="h-4 w-4 mr-2" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Check Professionals
                        </>
                      )}
                    </Button>
                  </div>
                  {chosenProfessionals.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-semibold text-green-600">Found Registered Professionals:</h4>
                      <div className="space-y-2">
                        {chosenProfessionals.map(professional => 
                          renderProfessionalCard(professional)
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Past Professionals Section */}
            <Card>
              <CardHeader>
                <div className="flex items-start space-x-2">
                  <div className="mt-1">
                    <Checkbox
                      id="repeat-past"
                      checked={selectionCriteria.repeatPastProfessionals}
                      onCheckedChange={(checked) => 
                        setSelectionCriteria(prev => ({ ...prev, repeatPastProfessionals: !!checked }))
                      }
                    />
                  </div>
                  <Label htmlFor="repeat-past" className="text-lg font-semibold">
                    Reconnect with Previous Professionals
                  </Label>
                </div>
                <p className="text-sm text-gray-600">
                  Select from professionals you've worked with before. They'll be prioritized in your invitation list.
                </p>
              </CardHeader>
              {selectionCriteria.repeatPastProfessionals && (
                <CardContent>
                  {loadingPast ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : pastProfessionals.length > 0 ? (
                    <div className="space-y-2">
                      {pastProfessionals.map(professional => 
                        renderProfessionalCard(
                          professional,
                          togglePastProfessional,
                          selectionCriteria.selectedPastProfessionals.includes(professional.id)
                        )
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No previous professionals found</p>
                    </div>
                  )}
                </CardContent>
              )}
            </Card>

            {/* Platform Suggested Professionals */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5" />
                      <span>Platform-Suggested Professionals</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      AI-curated professionals based on your requirements, location, ratings, and availability.
                    </p>
                  </div>
                  <Select
                    value={selectionCriteria.maxPlatformSuggestions.toString()}
                    onValueChange={(value) => 
                      setSelectionCriteria(prev => ({ ...prev, maxPlatformSuggestions: parseInt(value) }))
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 suggestions</SelectItem>
                      <SelectItem value="5">5 suggestions</SelectItem>
                      <SelectItem value="10">10 suggestions</SelectItem>
                      <SelectItem value="15">15 suggestions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {loadingSuggested ? (
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {platformSuggestedProfessionals.map(professional => 
                      renderProfessionalCard(
                        professional,
                        togglePlatformSuggested,
                        selectionCriteria.platformSuggestedProfessionals.includes(professional.id)
                      )
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Review & Send Tab */}
          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Review Final Invitation List</CardTitle>
                <p className="text-sm text-gray-600">
                  Review and customize your invitation before sending to selected professionals.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Final List */}
                <div>
                  <h3 className="font-semibold mb-3">
                    Professionals for Inviting Bids ({finalInvitationList.length})
                  </h3>
                  {finalInvitationList.length > 0 ? (
                    <div className="space-y-2">
                      {finalInvitationList.map(professional => 
                        renderProfessionalCard(professional)
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No professionals selected yet</p>
                      <p className="text-sm">Go back to selection tab to choose professionals</p>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Custom Message */}
                <div>
                  <Label htmlFor="custom-message" className="text-base font-semibold">
                    Custom Invitation Message (Optional)
                  </Label>
                  <p className="text-sm text-gray-600 mb-3">
                    Add a personalized message to your invitation
                  </p>
                  <Textarea
                    id="custom-message"
                    placeholder="We would like to invite you to submit a bid for our service request..."
                    value={selectionCriteria.customInvitationMessage}
                    onChange={(e) => 
                      setSelectionCriteria(prev => ({ ...prev, customInvitationMessage: e.target.value }))
                    }
                    className="min-h-24"
                  />
                </div>

                {/* Send Invitations Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("selection")}
                  >
                    Back to Selection
                  </Button>
                  <Button
                    onClick={sendInvitations}
                    disabled={sendingInvitations || finalInvitationList.length === 0}
                    className="flex items-center space-x-2"
                  >
                    {sendingInvitations ? (
                      <>
                        <Skeleton className="h-4 w-4" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send Invitations ({finalInvitationList.length})</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invitation Tracking Tab */}
          <TabsContent value="tracking" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Invitation Status Tracking</CardTitle>
                <p className="text-sm text-gray-600">
                  Monitor the status of sent invitations and professional responses.
                </p>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Invitation tracking will appear here after sending invitations</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Professional Profile Dialog */}
        <ProfessionalProfileDialog
          professionalId={selectedProfileId}
          open={profileDialogOpen}
          onOpenChange={setProfileDialogOpen}
        />
      </div>
    </DashboardLayout>
  );
};

// Professional Profile Dialog Component
interface ProfessionalProfileDialogProps {
  professionalId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProfessionalProfileDialog: React.FC<ProfessionalProfileDialogProps> = ({
  professionalId,
  open,
  onOpenChange,
}) => {
  const [profile, setProfile] = useState<ProfessionalProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!professionalId) return;
    
    setLoading(true);
    try {
      const profileData = await professionalInvitationService.getProfessionalProfile(professionalId);
      setProfile(profileData);
    } catch (error) {
      console.error('Failed to load professional profile:', error);
      toast({
        title: "Error",
        description: "Failed to load professional profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [professionalId]);

  useEffect(() => {
    if (professionalId && open) {
      loadProfile();
    }
  }, [professionalId, open, loadProfile]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Professional Profile</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : profile ? (
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.basicInfo.profileImage} />
                <AvatarFallback>{profile.basicInfo.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{profile.basicInfo.name}</h3>
                <p className="text-gray-600">{profile.basicInfo.specialization.join(', ')}</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{profile.performance.rating}</span>
                    <span className="text-gray-500">({profile.performance.totalReviews} reviews)</span>
                  </div>
                  <Badge variant={profile.availability.status === 'available' ? 'default' : 'secondary'}>
                    {profile.availability.status}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Contact Info (Masked) */}
            <div>
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <div className="space-y-1 text-sm">
                <p><strong>Location:</strong> {profile.basicInfo.location}</p>
                <p><strong>Experience:</strong> {profile.basicInfo.experience} years</p>
                <p><strong>Response Time:</strong> {profile.performance.responseTime}</p>
              </div>
            </div>

            {/* Specializations */}
            <div>
              <h4 className="font-semibold mb-2">Specializations</h4>
              <div className="flex flex-wrap gap-2">
                {profile.basicInfo.specialization.map((spec, index) => (
                  <Badge key={index} variant="outline">{spec}</Badge>
                ))}
              </div>
            </div>

            {/* Qualifications */}
            <div>
              <h4 className="font-semibold mb-2">Qualifications</h4>
              <div className="space-y-2">
                {profile.qualifications.certifications.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Certifications:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.qualifications.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{cert}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {profile.qualifications.education.length > 0 && (
                  <div>
                    <p className="text-sm font-medium">Education:</p>
                    <div className="flex flex-wrap gap-1">
                      {profile.qualifications.education.map((edu, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">{edu}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Portfolio Summary */}
            <div>
              <h4 className="font-semibold mb-2">Portfolio</h4>
              <p className="text-sm text-gray-600">{profile.portfolio.summary}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Failed to load professional profile</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProfessionalInvitation;
