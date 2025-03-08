
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { X, BookOpen, FileText, Star, CreditCard } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  const handleSignOut = () => {
    signOut();
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      <div className="flex justify-end p-6">
        <button 
          onClick={onClose}
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-black/5 transition-colors"
          aria-label="Close menu"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <nav className="flex flex-col items-center justify-center min-h-[80vh] space-y-6 text-xl">
        <Link 
          to="/" 
          onClick={onClose}
          className="font-medium hover:text-black/70 transition-colors"
        >
          Home
        </Link>
        
        <Link 
          to="/documentation" 
          onClick={onClose}
          className="font-medium hover:text-black/70 transition-colors flex items-center gap-2"
        >
          <BookOpen className="h-5 w-5" />
          Documentation
        </Link>
        
        {user ? (
          <>
            <Link 
              to="/profile" 
              onClick={onClose}
              className="font-medium hover:text-black/70 transition-colors"
            >
              Profile
            </Link>
            <Link 
              to="/role-selection" 
              onClick={onClose}
              className="font-medium hover:text-black/70 transition-colors"
            >
              Role Selection
            </Link>
            <Link 
              to="/upload" 
              onClick={onClose}
              className="font-medium hover:text-black/70 transition-colors"
            >
              Upload Audio
            </Link>
            
            {/* New links for Phase 3 completion */}
            <Link 
              to="/copy-to-emr" 
              onClick={onClose}
              className="font-medium hover:text-black/70 transition-colors flex items-center gap-2"
            >
              <FileText className="h-5 w-5" />
              Copy to EMR
            </Link>
            <Link 
              to="/ratings" 
              onClick={onClose}
              className="font-medium hover:text-black/70 transition-colors flex items-center gap-2"
            >
              <Star className="h-5 w-5" />
              Ratings
            </Link>
            <Link 
              to="/billing" 
              onClick={onClose}
              className="font-medium hover:text-black/70 transition-colors flex items-center gap-2"
            >
              <CreditCard className="h-5 w-5" />
              Billing
            </Link>
            
            <button 
              onClick={handleSignOut}
              className="font-medium hover:text-black/70 transition-colors"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link 
              to="/login" 
              onClick={onClose}
              className="font-medium hover:text-black/70 transition-colors"
            >
              Login
            </Link>
            <Link 
              to="/signup" 
              onClick={onClose}
              className="font-medium hover:text-black/70 transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileMenu;
