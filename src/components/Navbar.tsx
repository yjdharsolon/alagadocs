
import React, { useEffect, useState } from 'react';
import { useScrollProgress } from '../utils/animate';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import MobileMenu from './MobileMenu';
import { FileText, Star, CreditCard } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollProgress = useScrollProgress();
  const { user, signOut } = useAuth();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-apple px-6 md:px-10 py-5",
        isScrolled ? "bg-white/80 backdrop-blur-xl shadow-sm" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-xl font-medium tracking-tight hover:opacity-80 transition-opacity"
        >
          <span className="sr-only">AlagaDocs</span>
          AlagaDocs
        </Link>
        
        <nav className="hidden md:flex items-center space-x-8">
          {user ? (
            <>
              <Link 
                to="/profile" 
                className="text-sm font-medium tracking-wide hover:text-black/70 transition-colors relative group"
              >
                Profile
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300 ease-apple" />
              </Link>
              <Link 
                to="/role-selection" 
                className="text-sm font-medium tracking-wide hover:text-black/70 transition-colors relative group"
              >
                Role Selection
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300 ease-apple" />
              </Link>
              <Link 
                to="/upload" 
                className="text-sm font-medium tracking-wide hover:text-black/70 transition-colors relative group"
              >
                Upload Audio
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300 ease-apple" />
              </Link>
              
              {/* New links for Phase 3 completion */}
              <Link 
                to="/copy-to-emr" 
                className="text-sm font-medium tracking-wide hover:text-black/70 transition-colors relative group flex items-center gap-1"
              >
                <FileText className="h-4 w-4" />
                Copy to EMR
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300 ease-apple" />
              </Link>
              <Link 
                to="/ratings" 
                className="text-sm font-medium tracking-wide hover:text-black/70 transition-colors relative group flex items-center gap-1"
              >
                <Star className="h-4 w-4" />
                Ratings
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300 ease-apple" />
              </Link>
              <Link 
                to="/billing" 
                className="text-sm font-medium tracking-wide hover:text-black/70 transition-colors relative group flex items-center gap-1"
              >
                <CreditCard className="h-4 w-4" />
                Billing
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300 ease-apple" />
              </Link>
              
              <button 
                onClick={() => signOut()}
                className="text-sm font-medium tracking-wide hover:text-black/70 transition-colors relative group"
              >
                Sign Out
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300 ease-apple" />
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-sm font-medium tracking-wide hover:text-black/70 transition-colors relative group"
              >
                Login
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300 ease-apple" />
              </Link>
              <Link 
                to="/signup" 
                className="text-sm font-medium tracking-wide hover:text-black/70 transition-colors relative group"
              >
                Sign Up
                <span className="absolute left-0 bottom-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300 ease-apple" />
              </Link>
            </>
          )}
        </nav>
        
        <button 
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Menu"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>
      
      {/* Progress bar */}
      <div 
        className="absolute bottom-0 left-0 h-[1px] bg-black/20" 
        style={{ width: `${scrollProgress * 100}%`, opacity: isScrolled ? 1 : 0 }}
      />
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Navbar;
