import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  FolderOpen, 
  Upload, 
  Share, 
  Settings, 
  Search, 
  Users, 
  FileText, 
  Calendar, 
  MoreHorizontal,
  Shield,
  Activity,
  Eye,
  Edit,
  Download,
  MessageSquare,
  Home
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DocumentRoomView = () => {
  const { roomId } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  const roomData = {
    name: "Due Diligence - Series A",
    privacy: "Private",
    users: 8,
    owner: "John Doe",
    created: "Dec 15, 2023"
  };

  const folders = [
    {
      id: 1,
      name: "Financial Documents",
      members: 3,
      documents: 15,
      modified: "2 hours ago",
      icon: FolderOpen
    },
    {
      id: 2,
      name: "Legal & Compliance",
      members: 5,
      documents: 23,
      modified: "4 hours ago",
      icon: FolderOpen
    },
    {
      id: 3,
      name: "Business Plans & Strategy",
      members: 2,
      documents: 8,
      modified: "1 day ago",
      icon: FolderOpen
    }
  ];

  const files = [
    {
      id: 1,
      name: "Investment_Term_Sheet_v3.pdf",
      size: "2.3MB",
      owner: "Sarah Smith",
      modified: "Dec 18, 2023",
      access: "Editor Access",
      icon: FileText
    },
    {
      id: 2,
      name: "Company_Overview_2023.pptx",
      size: "5.7MB",
      owner: "Mike Johnson",
      modified: "Dec 17, 2023",
      access: "View Only",
      icon: FileText
    }
  ];

  const recentActivity = [
    "Sarah uploaded Investment_Term_Sheet_v3.pdf",
    "Mike commented on Company_Overview_2023.pptx",
    "John shared Financial Documents folder with Alex"
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto flex-1 space-y-6 p-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Home className="h-4 w-4" />
          <span>VDR</span>
          <span>&gt;</span>
          <span>Document Storage</span>
          <span>&gt;</span>
          <span className="text-foreground font-medium">{roomData.name}</span>
        </div>

        {/* Room Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <FolderOpen className="h-6 w-6 text-primary" />
                  <h1 className="text-2xl font-bold">{roomData.name}</h1>
                  <Badge variant="secondary">🔒 {roomData.privacy}</Badge>
                  <Badge variant="outline">
                    <Users className="h-3 w-3 mr-1" />
                    {roomData.users} users
                  </Badge>
                </div>
                <p className="text-muted-foreground">
                  Owner: {roomData.owner} • Created: {roomData.created}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Link to={`/data-room/document-storage/room/${roomId}/manage`}>
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Access
                  </Button>
                </Link>
                <Link to={`/data-room/document-storage/room/${roomId}/activity`}>
                  <Button variant="outline" size="sm">
                    <Activity className="h-4 w-4 mr-2" />
                    Activity Log
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Button>
                <FolderOpen className="h-4 w-4 mr-2" />
                New Folder
              </Button>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                📋 Bulk Actions
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Navigation & Search */}
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>📍 Path: / Root</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search in room..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="icon">
                📋
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                🔽
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Folder Structure */}
        <Card>
          <CardHeader>
            <CardTitle>Folder Structure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {folders.map((folder) => {
              const Icon = folder.icon;
              return (
                <div key={folder.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold">{folder.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          <Users className="h-3 w-3 mr-1" />
                          {folder.members}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          <FileText className="h-3 w-3 mr-1" />
                          {folder.documents}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        📅 Modified: {folder.modified}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Open Folder</DropdownMenuItem>
                        <DropdownMenuItem>Share Folder</DropdownMenuItem>
                        <DropdownMenuItem>Manage Access</DropdownMenuItem>
                        <DropdownMenuItem>Download</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}

            {files.map((file) => {
              const Icon = file.icon;
              return (
                <div key={file.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-blue-500" />
                        <h3 className="font-semibold">{file.name}</h3>
                        <Badge variant="outline" className="text-xs">{file.size}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>👤 {file.owner} • 📅 {file.modified} • {file.access === "Editor Access" ? "✏️" : "👁️"} {file.access}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Comment
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Activity Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>• {activity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DocumentRoomView;
