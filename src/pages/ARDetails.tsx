import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SidebarProvider, Sidebar, SidebarContent, SidebarInset, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, FileText, AlertTriangle, User } from "lucide-react";

const ARDetails = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/service-requests">Service Requests</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/my-bids">My Bids</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/my-work-orders">My Work Orders</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/my-workspace">My Workspace</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/resource-pool">Resource Pool</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/settings">Settings</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <div className="px-3 py-2">
                <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                  PROFESSIONAL MODULES
                </h2>
              </div>
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/entity-management">My Entity</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/meetings">Meetings</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/voting">E-Voting</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/virtual-data-room">Virtual Data Room</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/claims-management">Claims Management</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/litigation-management">Litigation Mgmt</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/resolution-system">Resolution System</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/compliance">Compliance</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive>
                  <Link to="/ar-facilitators">AR & Facilitators</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">AR Details & Management</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={() => navigate("/ar-facilitators")}
            >
              <ArrowLeft size={16} /> Back
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="mb-6">
            <Tabs defaultValue="details" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="feeStructure">Fee Structure</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="facilitator">Facilitator</TabsTrigger>
                <TabsTrigger value="fees">Fees</TabsTrigger>
              </TabsList>

              {/* Details Tab */}
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>AR DETAILS</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Class of Creditors</p>
                      <p className="font-medium">Financial Creditors-Secured</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Selected AR</p>
                      <p className="font-medium">John Smith (IBBI Reg: IB123456)</p>
                    </div>

                    {/* Appointment Details */}
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Appointment Details</h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Appointment Date</p>
                          <p>25 Jan 2025</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Terms of Appointment</p>
                          <p className="text-sm">Standard CIRP terms apply. Fees as per regulation...</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-2">Supporting Documents</p>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-primary">📄</span>
                              <span>Appointment Letter.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-primary">📄</span>
                              <span>Resolution Copy.pdf</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-primary">📄</span>
                              <span>Court Order.pdf</span>
                            </div>
                            <Button variant="outline" size="sm" className="flex items-center gap-1 mt-2">
                              <span>📎</span> Upload Document
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* AR Contact Information */}
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">AR Contact Information</h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <p>john.smith@email.com</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Phone</p>
                          <p>+91-9876543210</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Office</p>
                          <p>123 Business District, Mumbai - 400001</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Firm</p>
                          <p>Smith & Associates</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Actions</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" className="flex items-center gap-2">
                          <Mail size={16} /> Send Notification
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <FileText size={16} /> Generate Letter
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <AlertTriangle size={16} /> Remove AR
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2">
                          <User size={16} /> View Profile
                        </Button>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Quick Stats</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">CoC Meetings Attended</p>
                          <p className="font-medium">5/6</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Fees Earned</p>
                          <p className="font-medium">₹1,50,000</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Class Meetings Held</p>
                          <p className="font-medium">3</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Meeting</p>
                          <p className="font-medium">05 Feb 2025</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fee Structure Tab */}
              <TabsContent value="feeStructure">
                <Card>
                  <CardHeader>
                    <CardTitle>FEE STRUCTURE</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <p>AR: John Smith | Class: Financial Creditors-Secured</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Law Type</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>IBBI CIRP</option>
                          <option>IBBI Liquidation</option>
                          <option>SEBI</option>
                          <option>IBBI Insolvency</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Fee Structure Type</label>
                        <select className="w-full p-2 border rounded-md">
                          <option>Event Basis</option>
                          <option>Monthly Basis</option>
                          <option>Hourly Basis</option>
                        </select>
                      </div>
                    </div>

                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Event-Based Fees (CIRP Regulations)</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="font-medium mb-2">CoC Meeting Attendance:</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm">Creditors in Class</label>
                              <select className="w-full p-2 border rounded-md">
                                <option>101-1000</option>
                                <option>1-100</option>
                                <option>1001-5000</option>
                                <option>5001+</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm">Fee per Meeting</label>
                              <div className="flex items-center gap-2">
                                <input 
                                  type="text" 
                                  value="₹40,000" 
                                  disabled 
                                  className="w-full p-2 border rounded-md bg-gray-50"
                                />
                                <span className="text-xs text-muted-foreground">(As per regulation)</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <p className="font-medium mb-2">Class Creditor Meetings:</p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm">Fee per Meeting</label>
                              <input 
                                type="text" 
                                value="₹12,000" 
                                className="w-full p-2 border rounded-md"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Attendance Tab */}
              <TabsContent value="attendance">
                <Card>
                  <CardHeader>
                    <CardTitle>ATTENDANCE RECORD</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Attendance records for John Smith</p>
                    
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-3 text-left">Meeting Date</th>
                            <th className="p-3 text-left">Meeting Type</th>
                            <th className="p-3 text-left">Attendance</th>
                            <th className="p-3 text-left">Duration</th>
                            <th className="p-3 text-left">Fee</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">05 Jan 2025</td>
                            <td className="p-3">CoC Meeting</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Present
                              </span>
                            </td>
                            <td className="p-3">2h 15m</td>
                            <td className="p-3">₹40,000</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">12 Jan 2025</td>
                            <td className="p-3">Class Meeting</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Present
                              </span>
                            </td>
                            <td className="p-3">1h 30m</td>
                            <td className="p-3">₹12,000</td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">18 Jan 2025</td>
                            <td className="p-3">CoC Meeting</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                Absent
                              </span>
                            </td>
                            <td className="p-3">-</td>
                            <td className="p-3">₹0</td>
                          </tr>
                          <tr>
                            <td className="p-3">25 Jan 2025</td>
                            <td className="p-3">Class Meeting</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Present
                              </span>
                            </td>
                            <td className="p-3">2h 45m</td>
                            <td className="p-3">₹12,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Facilitator Tab */}
              <TabsContent value="facilitator">
                <Card>
                  <CardHeader>
                    <CardTitle>FACILITATOR MANAGEMENT</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p>Manage facilitators for Financial Creditors-Secured class</p>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Assigned Facilitators</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-md">
                          <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">Rajesh Kumar</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Contact</p>
                            <p>rajesh.k@email.com</p>
                          </div>
                          <div className="flex justify-end items-center">
                            <Button variant="outline" size="sm">Remove</Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-md">
                          <div>
                            <p className="text-sm text-muted-foreground">Name</p>
                            <p className="font-medium">Priya Sharma</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Contact</p>
                            <p>priya.s@email.com</p>
                          </div>
                          <div className="flex justify-end items-center">
                            <Button variant="outline" size="sm">Remove</Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button className="mt-4">
                        + Add New Facilitator
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Facilitator Responsibilities</h3>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Assist AR in communication with class members</li>
                        <li>Collect and organize documentation from creditors</li>
                        <li>Coordinate meetings and voting processes</li>
                        <li>Prepare reports and summaries for the AR</li>
                        <li>Handle queries from class members</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fees Tab */}
              <TabsContent value="fees">
                <Card>
                  <CardHeader>
                    <CardTitle>FEES MANAGEMENT</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-muted-foreground">AR: John Smith</p>
                        <p className="font-medium">Financial Creditors-Secured</p>
                      </div>
                      <Button>Generate Invoice</Button>
                    </div>
                    
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="p-3 text-left">Period</th>
                            <th className="p-3 text-left">Description</th>
                            <th className="p-3 text-left">Amount</th>
                            <th className="p-3 text-left">Status</th>
                            <th className="p-3 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="p-3">Jan 2025</td>
                            <td className="p-3">CoC Meeting (1) + Class Meeting (2)</td>
                            <td className="p-3">₹64,000</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Paid
                              </span>
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm">View</Button>
                            </td>
                          </tr>
                          <tr className="border-b">
                            <td className="p-3">Feb 2025</td>
                            <td className="p-3">CoC Meeting (2)</td>
                            <td className="p-3">₹80,000</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm">Process</Button>
                            </td>
                          </tr>
                          <tr>
                            <td className="p-3">Mar 2025</td>
                            <td className="p-3">Class Meeting (1)</td>
                            <td className="p-3">₹12,000</td>
                            <td className="p-3">
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Draft
                              </span>
                            </td>
                            <td className="p-3">
                              <Button variant="ghost" size="sm">Edit</Button>
                            </td>
                          </tr>
                        </tbody>
                        <tfoot className="bg-muted/50">
                          <tr>
                            <td className="p-3" colSpan={2}><strong>Total</strong></td>
                            <td className="p-3" colSpan={3}><strong>₹1,56,000</strong></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    
                    <div className="border rounded-md p-4">
                      <h3 className="font-medium mb-3">Payment Details</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Bank Account</p>
                          <p>HDFC Bank - XXXX1234</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Payment Method</p>
                          <p>NEFT/RTGS</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">GST Number</p>
                          <p>22AAAAA0000A1Z5</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">PAN</p>
                          <p>AAAAA0000A</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="mt-8 text-sm text-muted-foreground border-t pt-4">
            John Doe - Service Provider - ID: REG-636169
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ARDetails;
