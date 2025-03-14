
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 py-16">
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="text-xl font-medium mb-4">AlagaDocs</h3>
            <p className="text-gray-600 max-w-md">
              Transform your voice recordings into accurate, editable text with our AI-powered medical transcription service.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-3">
              {['Documentation', 'API', 'Support', 'Pricing'].map((item) => (
                <li key={item}>
                  <a 
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-black transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex space-x-4">
              {['twitter', 'github'].map((platform) => (
                <a 
                  key={platform}
                  href="#"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                  aria-label={platform}
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    {platform === 'twitter' && (
                      <>
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                      </>
                    )}
                    {platform === 'github' && (
                      <>
                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                        <path d="M9 18c-4.51 2-5-2-7-2" />
                      </>
                    )}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
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
