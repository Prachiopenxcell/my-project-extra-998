import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, ArrowLeft, Edit, Download, FileText, Users, Building, Landmark, Trash2 } from "lucide-react";
import { entityService } from "@/services/entityServiceFactory";
import { useToast } from "@/components/ui/use-toast";
import { EntityFormData } from "@/components/entity";

const EntityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entity, setEntity] = useState<EntityFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("basic");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    const fetchEntity = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await entityService.getEntityById(id);
        setEntity(data);
      } catch (error) {
        console.error('Error fetching entity:', error);
        toast({
          title: "Error",
          description: "Failed to load entity details. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntity();
  }, [id, toast]);

  if (loading) {
    return (
      <DashboardLayout userType="service_provider">
        <div className="container mx-auto p-6 flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin mb-4" />
            <p className="text-lg">Loading entity details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!entity) {
    return (
      <DashboardLayout userType="service_provider">
        <div className="container mx-auto p-6">
          <div className="bg-card rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Entity Not Found</h2>
            <p className="mb-6">The entity you are looking for does not exist or has been deleted.</p>
            <Button onClick={() => navigate("/entity-management")}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Entities
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="service_provider">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="space-y-6">
          {/* Navigation */}
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={() => navigate("/entity-management")} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <nav className="text-sm text-muted-foreground">
              Dashboard &gt; My Entities &gt; {entity.entityName}
            </nav>
          </div>
          
          {/* Title and Actions */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight">{entity.entityName}</h1>
                <Badge 
                  variant={entity.companyStatus === 'Active' ? "default" : "secondary"} 
                  className={`px-3 py-1 text-sm font-medium ${
                    entity.companyStatus === 'Active' 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-amber-100 text-amber-800 border-amber-200"
                  }`}
                >
                  {entity.companyStatus}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground">
                CIN: {entity.cinNumber}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={() => navigate(`/edit-entity/${id}`)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Entity
              </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsExporting(true);
                // Simulate export process
                setTimeout(() => {
                  const fileName = `${entity.entityName.replace(/\s+/g, '_')}_details.json`;
                  const dataStr = JSON.stringify(entity, null, 2);
                  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
                  
                  const linkElement = document.createElement('a');
                  linkElement.setAttribute('href', dataUri);
                  linkElement.setAttribute('download', fileName);
                  linkElement.click();
                  
                  setIsExporting(false);
                  toast({
                    title: "Export Complete",
                    description: `Entity details exported as ${fileName}`,
                  });
                }, 1000);
              }}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" /> Export Details
                </>
              )}
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </>
              )}
            </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}

        <Tabs defaultValue="basic" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-7 mb-6">
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="address">Address & Contact</TabsTrigger>
            <TabsTrigger value="personnel">Key Personnel</TabsTrigger>
            <TabsTrigger value="industry">Industry Details</TabsTrigger>
            <TabsTrigger value="financial">Financial Records</TabsTrigger>
            <TabsTrigger value="creditors">Creditors</TabsTrigger>
            <TabsTrigger value="bank">Bank Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Entity Information</CardTitle>
                <CardDescription>Registration and identification details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Registration Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Entity Type:</span>
                        <span className="font-medium">{entity.entityType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">CIN/LLPIN:</span>
                        <span className="font-medium">{entity.cinNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Registration No:</span>
                        <span className="font-medium">{entity.registrationNo || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ROC Name:</span>
                        <span className="font-medium">{entity.rocName || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Category:</span>
                        <span className="font-medium">{entity.category || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subcategory:</span>
                        <span className="font-medium">{entity.subcategory || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Additional Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last AGM Date:</span>
                        <span className="font-medium">{entity.lastAgmDate || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Balance Sheet Date:</span>
                        <span className="font-medium">{entity.balanceSheetDate || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Company Status:</span>
                        <span className="font-medium">{entity.companyStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Index of Charges:</span>
                        <span className="font-medium">{entity.indexOfCharges}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">PAN:</span>
                        <span className="font-medium">{entity.pan || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">GSTN Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="font-medium">{entity.gstn?.available ? "Yes" : "No"}</span>
                      </div>
                      {entity.gstn?.available && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Number:</span>
                          <span className="font-medium">{entity.gstn.number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">MSME Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="font-medium">{entity.msme?.available ? "Yes" : "No"}</span>
                      </div>
                      {entity.msme?.available && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Number:</span>
                          <span className="font-medium">{entity.msme.number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Shop & Establishment</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Available:</span>
                        <span className="font-medium">{entity.shopEstablishment?.available ? "Yes" : "No"}</span>
                      </div>
                      {entity.shopEstablishment?.available && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Number:</span>
                          <span className="font-medium">{entity.shopEstablishment.number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="address" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Address & Contact Information</CardTitle>
                <CardDescription>Office locations and contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Registered Office</h3>
                    {entity.registeredOffice && (
                      <div className="space-y-2">
                        <p>{entity.registeredOffice.address}</p>
                        <p>
                          {entity.registeredOffice.city}, {entity.registeredOffice.state}, {entity.registeredOffice.pincode}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Corporate Office</h3>
                    {entity.corporateOffice && (
                      <div className="space-y-2">
                        <p>{entity.corporateOffice.address}</p>
                        <p>
                          {entity.corporateOffice.city}, {entity.corporateOffice.state}, {entity.corporateOffice.pincode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Factory Office</h3>
                    <p>{entity.factoryOffice || "Not provided"}</p>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Correspondence Address</h3>
                    <p>{entity.correspondenceAddress || "Not provided"}</p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-4">Email Addresses</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Primary Email:</span>
                        <span className="font-medium">{entity.email || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Registered Email:</span>
                        <span className="font-medium">{entity.registeredEmail || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Alternate Email:</span>
                        <span className="font-medium">{entity.alternateEmail || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Correspondence Email:</span>
                        <span className="font-medium">{entity.correspondenceEmail || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Phone Numbers</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone Number:</span>
                        <span className="font-medium">{entity.phoneNumber || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Alternative Phone:</span>
                        <span className="font-medium">{entity.phone || "N/A"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personnel" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Key Personnel</CardTitle>
                <CardDescription>Directors and key management personnel</CardDescription>
              </CardHeader>
              <CardContent>
                {entity.directors && entity.directors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entity.directors.map((director, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">{director.name}</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Designation:</span>
                            <span className="font-medium">{director.designation}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">DIN:</span>
                            <span className="font-medium">{director.din || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date of Birth:</span>
                            <span className="font-medium">{director.dob || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No key personnel information available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="industry" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Industry & Operational Details</CardTitle>
                <CardDescription>Business activities and operational information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-4">Business Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Business Activity:</span>
                        <span className="font-medium">{entity.businessActivity || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Turnover:</span>
                        <span className="font-medium">{entity.turnover || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Operational Status:</span>
                        <span className="font-medium">{entity.operationalStatus}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-4">Employee Information</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Employees:</span>
                        <span className="font-medium">{entity.employeeCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Male Employees:</span>
                        <span className="font-medium">{entity.maleEmployeeCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Female Employees:</span>
                        <span className="font-medium">{entity.femaleEmployeeCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <h3 className="font-semibold mb-4">Industries</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {entity.industries?.map((industry, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-1">
                      {industry}
                    </Badge>
                  ))}
                </div>
                
                <h3 className="font-semibold mb-4">Industry Details</h3>
                {entity.industryDetails && entity.industryDetails.length > 0 ? (
                  <div className="space-y-4">
                    {entity.industryDetails.map((detail, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <h4 className="font-medium mb-2">{detail.industry}</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Products/Services:</span>
                              <span className="font-medium">{detail.products?.join(', ') || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Installed Capacity:</span>
                              <span className="font-medium">{detail.installedCapacity}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Sales Quantity:</span>
                              <span className="font-medium">{detail.salesQuantity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Sales Value:</span>
                              <span className="font-medium">{detail.salesValue}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No industry details available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Records & Financial Details</CardTitle>
                <CardDescription>Financial documents and records</CardDescription>
              </CardHeader>
              <CardContent>
                {entity.financialRecords && entity.financialRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Document Type</th>
                          <th className="text-left py-3 px-4">Year</th>
                          <th className="text-left py-3 px-4">File Name</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entity.financialRecords.map((record, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{record.documentType}</td>
                            <td className="py-3 px-4">{record.financialYear}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                <span className="text-blue-600 hover:underline cursor-pointer">
                                  {record.fileName}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={record.status === 'Verified' ? "default" : "outline"}>
                                {record.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{record.remarks || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No financial records available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creditors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Creditors in Class</CardTitle>
                <CardDescription>Creditor details and claims</CardDescription>
              </CardHeader>
              <CardContent>
                {entity.creditors && entity.creditors.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Creditor Name</th>
                          <th className="text-left py-3 px-4">Class</th>
                          <th className="text-left py-3 px-4">Subclass</th>
                          <th className="text-right py-3 px-4">Claim Amount</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entity.creditors.map((creditor, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{creditor.name}</td>
                            <td className="py-3 px-4">{creditor.class}</td>
                            <td className="py-3 px-4">{creditor.subClass || "—"}</td>
                            <td className="py-3 px-4 text-right">₹{creditor.amount.toLocaleString()}</td>
                            <td className="py-3 px-4">
                              <Badge variant={creditor.status === 'Verified' ? "default" : "outline"}>
                                {creditor.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{creditor.remarks || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No creditor information available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bank" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Bank & Investment Documents</CardTitle>
                <CardDescription>Bank accounts and investment information</CardDescription>
              </CardHeader>
              <CardContent>
                {entity.bankDocuments && entity.bankDocuments.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4">Bank Name</th>
                          <th className="text-left py-3 px-4">Document Type</th>
                          <th className="text-left py-3 px-4">Date</th>
                          <th className="text-left py-3 px-4">File</th>
                          <th className="text-left py-3 px-4">Status</th>
                          <th className="text-left py-3 px-4">Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {entity.bankDocuments.map((doc, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="py-3 px-4">{doc.bankName}</td>
                            <td className="py-3 px-4">{doc.documentType}</td>
                            <td className="py-3 px-4">{doc.documentDate}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <FileText className="h-4 w-4 mr-2" />
                                <span className="text-blue-600 hover:underline cursor-pointer">
                                  {doc.fileName}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge variant={doc.status === 'Verified' ? "default" : "outline"}>
                                {doc.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{doc.remarks || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No bank documents available</p>
                  </div>
                )}
                
                {entity.investmentSummary && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-2">Investment Summary</h3>
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <p>{entity.investmentSummary}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete <strong>{entity?.entityName}</strong> and all of its associated data.
                    This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => {
                      setIsDeleting(true);
                      entityService.deleteEntity(entity.id!)
                        .then(() => {
                          toast({
                            title: "Entity Deleted",
                            description: `${entity.entityName} has been successfully deleted.`,
                          });
                          navigate("/entity-management");
                        })
                        .catch((error) => {
                          console.error('Error deleting entity:', error);
                          toast({
                            title: "Error",
                            description: "Failed to delete entity. Please try again.",
                            variant: "destructive"
                          });
                        })
                        .finally(() => {
                          setIsDeleting(false);
                        });
                    }}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Delete Entity
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
      </div>
    </DashboardLayout>
  );
};

export default EntityDetails;
