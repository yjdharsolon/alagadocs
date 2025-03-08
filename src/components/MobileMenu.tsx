
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();

  if (!isOpen) return null;
  
  const handleSignOut = () => {
    signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose}>
      <div 
        className="absolute right-0 top-0 h-full w-4/5 max-w-sm bg-white p-6 shadow-xl" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-medium">Menu</h2>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex flex-col space-y-4">
          {user ? (
            <>
              <Link 
                to="/profile" 
                className="py-2 border-b border-gray-100"
                onClick={onClose}
              >
                Profile
              </Link>
              <Link 
                to="/role-selection" 
                className="py-2 border-b border-gray-100"
                onClick={onClose}
              >
                Role Selection
              </Link>
              <Link 
                to="/upload" 
                className="py-2 border-b border-gray-100"
                onClick={onClose}
              >
                Upload Audio
              </Link>
              <button 
                onClick={handleSignOut}
                className="py-2 text-left text-red-500"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="py-2 border-b border-gray-100"
                onClick={onClose}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="py-2 border-b border-gray-100"
                onClick={onClose}
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileMenu;
