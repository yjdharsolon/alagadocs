
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 py-8">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="border-t border-gray-200 pt-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {currentYear} AlagaDocs. All rights reserved.
          </p>
          
          <div className="flex space-x-8">
            <a href="#" className="text-gray-600 text-sm hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 text-sm hover:text-black transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 text-sm hover:text-black transition-colors">
              HIPAA Compliance
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
