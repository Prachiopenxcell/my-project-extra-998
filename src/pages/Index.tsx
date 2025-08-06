import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Users, 
  FileText, 
  Calendar, 
  Vote, 
  FolderOpen, 
  Building, 
  CheckCircle,
  ArrowRight,
  Star
} from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const features = [
    {
      icon: FileText,
      title: "Service Marketplace",
      description: "Connect service seekers with professional service providers efficiently"
    },
    {
      icon: Building,
      title: "ERP Integration",
      description: "Complete business management with integrated ERP capabilities"
    },
    {
      icon: Calendar,
      title: "Meeting Management",
      description: "Schedule, conduct, and track meetings with digital attendance"
    },
    {
      icon: Vote,
      title: "E-Voting System",
      description: "Secure digital voting for organizational decisions"
    },
    {
      icon: FolderOpen,
      title: "Virtual Data Room",
      description: "Secure document sharing with access control and encryption"
    },
    {
      icon: Shield,
      title: "Compliance Tracking",
      description: "Automated compliance monitoring and regulatory management"
    }
  ];

  const stats = [
    { value: "500+", label: "Active Service Providers" },
    { value: "1,200+", label: "Completed Projects" },
    { value: "98%", label: "Client Satisfaction" },
    { value: "24/7", label: "Platform Support" }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">998-P</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="professional">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Professional Services Platform
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Professional Services
            <span className="text-primary block">Marketplace & ERP</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with professional service providers, manage projects efficiently, 
            and streamline your business operations with our integrated platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" variant="professional" className="h-12 px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="h-12 px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Comprehensive Business Solutions
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage professional services, from marketplace 
            connections to enterprise-grade business management tools.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="shadow-card hover:shadow-elegant transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* User Types Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24 bg-card/50">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Choose Your Path
          </h2>
          <p className="text-xl text-muted-foreground">
            Whether you're seeking services or providing them, we have the right tools for you.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardHeader className="text-center">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Service Seekers</CardTitle>
              <CardDescription className="text-base">
                Find qualified professionals for your business needs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Post service requirements</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Review and compare bids</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Track project progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Manage team and compliance</span>
                </div>
              </div>
              <Link to="/register" className="block">
                <Button className="w-full" variant="professional">
                  Join as Service Seeker
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-shadow">
            <CardHeader className="text-center">
              <Star className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-2xl">Service Providers</CardTitle>
              <CardDescription className="text-base">
                Grow your business by connecting with clients
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Browse service opportunities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Submit competitive proposals</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Manage multiple projects</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Professional tools & analytics</span>
                </div>
              </div>
              <Link to="/register" className="block">
                <Button className="w-full" variant="professional">
                  Join as Service Provider
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 lg:py-24">
        <Card className="bg-gradient-primary text-primary-foreground shadow-elegant">
          <CardContent className="p-8 lg:p-12 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of professionals already using our platform to
              streamline their operations and grow their business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="h-12 px-8">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="ghost"
                className="h-12 px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Schedule Demo
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-bold text-primary text-sm">998-P</span>
            </div>
            <div className="text-xs text-muted-foreground">
              © 2025 998-P. All rights reserved.
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <Link to="/terms" className="hover:text-foreground">
                Terms
              </Link>
              <Link to="/privacy" className="hover:text-foreground">
                Privacy
              </Link>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
              <Link to="/faq" className="hover:text-foreground">
                FAQ
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
