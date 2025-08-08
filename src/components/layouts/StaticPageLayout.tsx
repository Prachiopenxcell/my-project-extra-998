import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ImageWithPlaceholder } from '@/components/ui/image-placeholder';
import { 
  Shield,
  LogIn,
  UserPlus,
  Menu,
  X
} from 'lucide-react';

interface StaticPageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  showHero?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  heroIcon?: React.ComponentType<{ className?: string }>;
  heroGradient?: string;
}

export default function StaticPageLayout({ 
  children, 
  title, 
  description, 
  showHero = false, 
  heroTitle, 
  heroSubtitle, 
  heroDescription, 
  heroIcon: HeroIcon, 
  heroGradient = "from-blue-600 to-slate-700" 
}: StaticPageLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Link to="/" className="flex items-center space-x-2">
                <Shield className="h-8 w-8 text-slate-600" />
                <span className="text-2xl font-bold text-gray-900">998-P Platform</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-slate-700 font-medium">Home</Link>
              <Link to="/about" className="text-gray-700 hover:text-slate-700 font-medium">About Us</Link>
              <Link to="/how-it-works" className="text-gray-700 hover:text-slate-700 font-medium">Services</Link>
              <Link to="/modules-subscription" className="text-gray-700 hover:text-slate-700 font-medium">Purchase Subscriptions</Link>
              <Link to="/contact" className="text-gray-700 hover:text-slate-700 font-medium">Contact Us</Link>
              <Link to="/articles" className="text-gray-700 hover:text-slate-700 font-medium">Articles</Link>
              <Link to="/faq" className="text-gray-700 hover:text-slate-700 font-medium">FAQ</Link>
              
              {/* Direct Login Button */}
              <Button variant="outline" asChild className="flex items-center space-x-2">
                <Link to="/login">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </Link>
              </Button>
              
              {/* Register Button */}
              <Button asChild className="bg-slate-700 hover:bg-slate-800">
                <Link to="/register" className="flex items-center space-x-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Register</span>
                </Link>
              </Button>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <Link to="/" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">Home</Link>
                <Link to="/about" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">About Us</Link>
                <Link to="/how-it-works" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">Services</Link>
                <Link to="/modules-subscription" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">Purchase Subscriptions</Link>
                <Link to="/contact" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">Contact Us</Link>
                <Link to="/articles" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">Articles</Link>
                <Link to="/faq" className="text-gray-700 hover:text-slate-700 font-medium px-4 py-2">FAQ</Link>
                
                <div className="border-t border-gray-200 pt-4">
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-slate-700 hover:bg-gray-50 font-medium"
                  >
                    <LogIn className="inline h-4 w-4 mr-2" />
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block px-4 py-2 text-sm text-slate-600 hover:text-slate-700 font-medium"
                  >
                    <UserPlus className="inline h-4 w-4 mr-2" />
                    Register
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      {showHero ? (
        <div className={`relative bg-gradient-to-br ${heroGradient} text-white overflow-hidden`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-black/10">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }} />
            </div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center">
              {/* Hero Icon */}
              {HeroIcon && (
                <div className="flex justify-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                    <HeroIcon className="h-10 w-10 text-white" />
                  </div>
                </div>
              )}
              
              {/* Hero Subtitle */}
              {heroSubtitle && (
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-sm font-medium mb-6">
                  {heroSubtitle}
                </div>
              )}
              
              {/* Hero Title */}
              {heroTitle && (
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6  ">
                  {heroTitle}
                </h1>
              )}
              
              {/* Hero Description */}
              {heroDescription && (
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                  {heroDescription}
                </p>
              )}
            </div>
          </div>

        </div>
      ) : (
        /* Basic Page Header */
        (title || description) && (
          <div className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              )}
              {description && (
                <p className="text-lg text-gray-600">{description}</p>
              )}
            </div>
          </div>
        )
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-8 w-8 text-slate-400" />
                <span className="text-2xl font-bold">998-P Platform</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering organizations with professional services, compliance management, and 
                comprehensive collaboration solutions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/about" className="hover:text-white">About Us</Link></li>
                <li><Link to="/how-it-works" className="hover:text-white">How it works</Link></li>
                <li><Link to="/modules-subscription" className="hover:text-white">Modules & Subscription Plans</Link></li>
                <li><Link to="/articles" className="hover:text-white">Resources</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/terms" className="hover:text-white">Terms & Conditions</Link></li>
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/cookies" className="hover:text-white">Cookies Policy</Link></li>
                <li><Link to="/legal-compliance" className="hover:text-white">Legal & Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 998-P Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
