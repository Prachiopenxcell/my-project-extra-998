import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Search,
  Bell,
  Settings,
  LogOut,
  User,
  Menu,
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  Vote,
  FolderOpen,
  AlertTriangle,
  Scale,
  UserCheck,
  Building,
  CreditCard,
  BarChart3,
  CirclePlus,
  ListFilter,
  FileSpreadsheet,
  Briefcase,
  Landmark,
  Clock,
  Book,
  HelpCircle,
  Phone,
  Package,
  Newspaper,
  Info,
  Play,
  Shield,
  Lock,
  Cookie,
  Gavel,
} from "lucide-react";
import { SubscriptionStatusIndicator } from "@/components/subscription/SubscriptionStatusIndicator";
import { NotificationBell } from "@/components/notifications/NotificationBell";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { UserRole, UserType } from "@/types/auth";
import { getUserTypeFromRole, getUserTypeFromUserType } from "@/utils/userTypeUtils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userType?: "service_seeker" | "service_provider" | "admin";
  userRole?: UserRole;
  userName?: string;
}

const navigationItems = {
  service_seeker: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Service Requests", href: "/service-requests", icon: FileText },
    { name: "My Work Orders", href: "/work-orders", icon: Users },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name:'Subscriptions', href: "/subscription", icon: CreditCard},
    { name: "My Workspace", href: "/workspace", icon: Building },
    { name: "System Settings", href: "/settings", icon: Settings },
  ],
  service_provider: [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Opportunities", href: "/service-requests", icon: FileText }, //change name to opportunities after module is ready
    { name: "My Work Orders", href: "/work-orders", icon: Users },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name:'Feedback', href: "/feedback", icon:Users},
    { name:'Guidance and Reference', href: "/guidance-reference", icon: Book},
    {
      name: "Resource Pooling/Sharing",
      href: "/resource-sharing",
      icon: Users,
    },  
    { name:'Subscriptions', href: "/subscription", icon: CreditCard},
    { name: "My Workspace", href: "/workspace", icon: Building },
   

    { name: "System Settings", href: "/settings", icon: Settings },
  ],
  /* admin: [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    {
      name: "Service Requests",
      href: "/admin/service-requests",
      icon: FileText,
    },
    { name: "Work Orders", href: "/admin/work-orders", icon: Users },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ], */
};

// Static Pages
const staticPages = [
  { name: "FAQ", href: "/faq", icon: HelpCircle },
  { name: "Contact Us", href: "/contact", icon: Phone },
  { name: "Modules & Subscription", href: "/modules-subscription", icon: Package },
  { name: "Articles", href: "/articles", icon: Newspaper },
  { name: "About Us", href: "/about", icon: Info },
  { name: "How It Works", href: "/how-it-works", icon: Play },
  { name: "Terms & Conditions", href: "/terms", icon: FileText },
  { name: "Privacy Policy", href: "/privacy", icon: Shield },
  { name: "Cookies Policy", href: "/cookies", icon: Cookie },
  { name: "Legal Compliance", href: "/legal-compliance", icon: Gavel },
];

// All available professional modules
const allProfessionalModules = [
  { name: "My Entity", href: "/entity-management", icon: Briefcase },
  { name: "Meetings", href: "/meetings", icon: Calendar },
  { name: "E-Voting", href: "/voting", icon: Vote },
  { name: "Virtual Data Room", href: "/data-room", icon: FolderOpen },
  { name: "Claims Management", href: "/claims", icon: AlertTriangle },
  { name: "Timeline Management", href: "/timeline", icon: Clock },
  { name: "AR & Facilitators", href: "/ar-facilitators", icon: UserCheck },
  { name: "Litigation Management", href: "/litigation", icon: Scale },
  { name: "Resolution System", href: "/resolution", icon: UserCheck },
  { name: "Regulatory Compliance", href: "/compliance", icon: Building },
];

// All professional modules are now accessible to all users without restrictions

export function DashboardLayout({
  children,
  userType,
  userRole,
  userName,
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Get user data from auth context if not provided as props
  // Priority: explicit userType prop > userRole prop > user.role > user.userType > default
  const actualUserType = userType || 
    (userRole ? getUserTypeFromRole(userRole) : 
      (user?.role ? getUserTypeFromRole(user.role) : 
        (user?.userType ? getUserTypeFromUserType(user.userType) : "service_seeker")));
  const actualUserName = userName || (user ? `${user.firstName || 'User'} ${user.lastName || ''}`.trim() : "User") || "User";

  // Show PRN for all Service Seekers
  const isServiceSeeker = actualUserType === 'service_seeker';

  const currentNavItems =
    navigationItems[actualUserType] || navigationItems.service_seeker;

  const isActiveLink = (href: string) => {
    return (
      location.pathname === href || location.pathname.startsWith(href + "/")
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-sidebar-accent rounded flex items-center justify-center">
            <span className="text-sidebar-accent-foreground font-bold text-sm">
              998p
            </span>
          </div>
          <span className="text-sidebar-foreground font-semibold">Design</span>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
            Main Menu
          </h3>
          <nav className="space-y-1">
            {currentNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-primary/10 hover:text-sidebar-foreground"
                  }`}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Professional Modules */}
        {userType !== "admin" && (
          <div className="p-4 border-t border-sidebar-border">
            <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
              Professional Modules
            </h3>
            <nav className="space-y-1">
              {allProfessionalModules.map((item) => {
                const Icon = item.icon;
                const isActive = isActiveLink(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground/80 hover:bg-sidebar-primary/10 hover:text-sidebar-foreground"
                    }`}>
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Static Pages */}
        <div className="p-4 border-t border-sidebar-border">
          <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider mb-3">
            Static Pages
          </h3>
          <nav className="space-y-1">
            {staticPages.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-primary/10 hover:text-sidebar-foreground"
                  }`}>
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.jpg" alt={actualUserName} />
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-sm font-medium">
              {actualUserName
                ? actualUserName.split(" ").map((n) => n[0]).join("").toUpperCase()
                : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {actualUserName}
              </p>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sidebar-accent/20 text-sidebar-accent-foreground/80 font-medium">
                {actualUserType.replace("_", " ")}
              </span>
            </div>
            <div className="mt-0.5">
              <p className="text-xs text-sidebar-foreground/60 font-mono">
                ID: {" "}
                <span className="text-sidebar-foreground/80">
                  {isServiceSeeker ? 'PRN-315782' : `TRN-123456`}
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* Logout Button */}
        <button
          onClick={() => {
            logout();
            toast({ title: "Signed out", description: "You have been logged out." });
            navigate("/login");
          }}
          className="mt-3 w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground/80 hover:bg-sidebar-primary/10 hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-[300px] lg:flex-col bg-gradient-primary">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="w-64 p-0 bg-gradient-primary border-none">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
            </Sheet>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-avatar.jpg" alt={actualUserName} />
                <AvatarFallback>
                  {actualUserName
                    ? actualUserName.split(" ").map((n) => n[0]).join("").toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">
                  {actualUserName}
                </p>
                <p className="text-xs text-muted-foreground font-mono">
                  {isServiceSeeker ? 'PRN-315782' : `TRN-123456`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative max-w-md w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="pl-10 bg-background"
              />
            </div>
            
            {/* Subscription Status */}
            <SubscriptionStatusIndicator moduleId="entity-management" compact={true} />
            
            {/* Notifications */}
            <NotificationBell />

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-avatar.jpg" alt={actualUserName} />
                    <AvatarFallback>
                      {actualUserName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {actualUserName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile/edit">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/subscriptions">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscription
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    logout();
                    toast({ title: "Signed out", description: "You have been logged out." });
                    navigate("/login");
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </div>
  );
}
