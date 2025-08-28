import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { 
  Search, 
  Filter,
  ArrowLeft,
  ArrowRight,
  Building,
  MapPin,
  Users,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  Zap,
  Edit,
  Trash2,
  Plus,
  Save,
  Eye,
  Settings,
  Upload,
  Briefcase
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

interface Entity {
  id: string;
  name: string;
  type: string;
  location: string;
  sector: string;
  employees: string;
  turnover: string;
  status: 'active' | 'inactive';
  currentCompliances: number;
  lastSetup: string;
  setupRequired: boolean;
}

const ComplianceEntitySetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntities, setSelectedEntities] = useState<string[]>([]);
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterSector, setFilterSector] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<string | null>(null);
  const [editingEntity, setEditingEntity] = useState<string | null>(null);

  // Mock data - replace with actual API calls
  const [entities, setEntities] = useState<Entity[]>([
    {
      id: "1",
      name: "ABC Corporation Ltd",
      type: "Private Limited",
      location: "Mumbai",
      sector: "IT",
      employees: "50-100",
      turnover: "₹10Cr",
      status: "active",
      currentCompliances: 12,
      lastSetup: "6 months ago",
      setupRequired: false
    },
    {
      id: "2",
      name: "XYZ Partnership LLP",
      type: "LLP",
      location: "Delhi",
      sector: "Consulting",
      employees: "8",
      turnover: "₹5Cr",
      status: "active",
      currentCompliances: 8,
      lastSetup: "Never",
      setupRequired: true
    },
    {
      id: "3",
      name: "Tech Innovations Pvt Ltd",
      type: "Private Limited",
      location: "Bangalore",
      sector: "Technology",
      employees: "25-50",
      turnover: "₹8Cr",
      status: "active",
      currentCompliances: 15,
      lastSetup: "3 months ago",
      setupRequired: false
    },
    {
      id: "4",
      name: "StartUp Ventures OPC",
      type: "OPC",
      location: "Pune",
      sector: "Startup",
      employees: "5-10",
      turnover: "₹2Cr",
      status: "active",
      currentCompliances: 6,
      lastSetup: "1 year ago",
      setupRequired: true
    }
  ]);

  const filteredEntities = entities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || entity.type === filterType;
    const matchesLocation = filterLocation === 'all' || entity.location === filterLocation;
    const matchesSector = filterSector === 'all' || entity.sector === filterSector;
    return matchesSearch && matchesType && matchesLocation && matchesSector;
  });

  const handleEntitySelection = (entityId: string, checked: boolean) => {
    if (checked) {
      setSelectedEntities([...selectedEntities, entityId]);
    } else {
      setSelectedEntities(selectedEntities.filter(id => id !== entityId));
    }
  };

  const handleViewEntity = (entityId: string) => {
    navigate(`/compliance/tracking?entity=${entityId}`);
  };

  const handleEditEntity = (entityId: string) => {
    setEditingEntity(entityId);
    // In a real app, you'd fetch entity details and populate a form
    toast({
      title: "Edit Mode",
      description: "Entity edit functionality would open here.",
    });
  };

  const handleDeleteEntity = (entityId: string) => {
    setEntityToDelete(entityId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteEntity = () => {
    if (entityToDelete) {
      setEntities(entities.filter(entity => entity.id !== entityToDelete));
      toast({
        title: "Entity Deleted",
        description: "The entity has been successfully removed.",
      });
      setDeleteDialogOpen(false);
      setEntityToDelete(null);
    }
  };

  const handleViewCompliance = (entityId: string, entityName: string) => {
    toast({
      title: "View Compliance",
      description: `Opening compliance details for ${entityName}`,
    });
    // Navigate to compliance tracking with entity filter
    navigate(`/compliance/tracking?entity=${entityId}`);
  };

  const handleSetupNew = (entityId: string, entityName: string) => {
    toast({
      title: "Setup New Compliance",
      description: `Starting compliance setup for ${entityName}`,
    });
    // Navigate to checklist generation with selected entity
    navigate(`/compliance/checklist?entity=${entityId}`);
  };

  const handleAddNewEntity = () => {
    // In a real app, this would open a form to add a new entity
    toast({
      title: "Add New Entity",
      description: "New entity form would open here.",
    });
  };

  const handleContinue = () => {
    if (selectedEntities.length > 0) {
      // Navigate to checklist generation with selected entities
      navigate('/compliance/checklist', { 
        state: { selectedEntities: selectedEntities } 
      });
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Regulatory Compliance</h1>
            <p className="text-muted-foreground">Entity Setup</p>
          </div>
        </div>

        {/* Progress Indicator */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Building className="w-6 h-6 text-blue-600 mr-3" />
              <div>
                <h3 className="font-semibold text-blue-900">SELECT ENTITY FOR COMPLIANCE SETUP</h3>
                <p className="text-blue-700 text-sm mt-1">Step 1 of 3: Choose Entity</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search Entities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm" className="h-9">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="private">Private Limited</SelectItem>
                    <SelectItem value="llp">LLP</SelectItem>
                    <SelectItem value="opc">OPC</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterLocation} onValueChange={setFilterLocation}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="mumbai">Mumbai</SelectItem>
                    <SelectItem value="delhi">Delhi</SelectItem>
                    <SelectItem value="bangalore">Bangalore</SelectItem>
                    <SelectItem value="pune">Pune</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterSector} onValueChange={setFilterSector}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Sectors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sectors</SelectItem>
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="startup">Startup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Entities List */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              YOUR ENTITIES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredEntities.map((entity) => (
                <Card key={entity.id} className={`border transition-all ${
                  selectedEntities.includes(entity.id) 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          checked={selectedEntities.includes(entity.id)}
                          onClick={() => handleEntitySelection(entity.id, !selectedEntities.includes(entity.id))}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900 mb-2">
                            {entity.name}
                          </h3>
                          
                          <div className="space-y-3">
                            {/* First Row - Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Type:</span>
                                <p className="font-medium mt-1">{entity.type}</p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Location:</span>
                                <p className="font-medium flex items-center mt-1">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {entity.location}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Sector:</span>
                                <p className="font-medium flex items-center mt-1">
                                  <Briefcase className="w-3 h-3 mr-1" />
                                  {entity.sector}
                                </p>
                              </div>
                            </div>
                            
                            {/* Second Row - Business Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Employees:</span>
                                <p className="font-medium flex items-center mt-1">
                                  <Users className="w-3 h-3 mr-1" />
                                  {entity.employees}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Turnover:</span>
                                <p className="font-medium flex items-center mt-1">
                                  <TrendingUp className="w-3 h-3 mr-1" />
                                  {entity.turnover}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-500 text-xs uppercase tracking-wide">Status:</span>
                                <div className="mt-1">
                                  <Badge variant={entity.status === 'active' ? 'default' : 'secondary'}>
                                    {entity.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-4 space-x-4  pt-3 border-t">
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Current Compliances: <strong>{entity.currentCompliances}</strong></span>
                              <span>Last Setup: <strong>{entity.lastSetup}</strong></span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              {entity.setupRequired && (
                                <Badge variant="destructive" className="flex items-center">
                                  <AlertTriangle className="w-3 h-3 mr-1" />
                                  Setup Required
                                </Badge>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9"
                                onClick={() => handleViewCompliance(entity.id, entity.name)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Compliance
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="h-9"
                                onClick={() => handleSetupNew(entity.id, entity.name)}
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                Setup New
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between items-center mt-6 pt-4 border-t">
              <div className="flex space-x-4">
                <Button variant="outline" size="sm" className="h-9">
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Entity
                </Button>
                <Button variant="outline" size="sm" className="h-9">
                  <Upload className="mr-2 h-4 w-4" />
                  Import from CSV
                </Button>
              </div>
              
              {selectedEntities.length > 0 && (
                <div className="text-sm text-gray-600">
                  {selectedEntities.length} entit{selectedEntities.length === 1 ? 'y' : 'ies'} selected
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Notice */}
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-orange-600 mr-3" />
              <div>
                <p className="text-orange-800">
                  <strong>Notice:</strong> Minimum 1 entity required for compliance module
                </p>
                <div className="flex space-x-4 mt-2">
                  <Button variant="link" className="p-0 text-orange-700 hover:text-orange-800">
                    Subscribe to Entity Module
                  </Button>
                  <Button variant="link" className="p-0 text-orange-700 hover:text-orange-800">
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" size="sm" className="h-9" onClick={() => navigate('/compliance')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <Button 
            onClick={handleContinue}
            disabled={selectedEntities.length === 0}
            size="sm" 
            className="h-9"
          >
            Continue to Checklist Generation
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ComplianceEntitySetup;
