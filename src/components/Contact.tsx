
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { useRevealAnimation } from '../utils/animate';
import { useToast } from '@/hooks/use-toast';

const Contact: React.FC = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useRevealAnimation();
  const { ref: formRef, isVisible: formVisible } = useRevealAnimation();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ name: '', email: '', message: '' });
      
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
        duration: 5000,
      });
    }, 1500);
  };
  
  return (
    <section 
      id="contact"
      className="py-24 bg-white"
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <span className="inline-block px-3 py-1 text-xs tracking-wider uppercase bg-black/5 rounded-full mb-4">
              Get In Touch
            </span>
            
            <h2 className="text-3xl md:text-4xl font-medium mb-6">
              Let's Start a <br />Conversation
            </h2>
            
            <p className="text-gray-600 mb-12 max-w-md">
              Have a project in mind or just want to learn more about our design philosophy? We'd love to hear from you.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-black/5">
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
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Phone</h3>
                  <p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-black/5">
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
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Email</h3>
                  <p className="text-gray-600 mt-1">hello@minimalist.design</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-black/5">
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
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium">Location</h3>
                  <p className="text-gray-600 mt-1">San Francisco, CA</p>
                </div>
              </div>
            </div>
          </div>
          
          <div 
            ref={formRef as React.RefObject<HTMLDivElement>}
            className={cn(
              "transition-all duration-1000 ease-apple",
              formVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            )}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full px-4 py-3 rounded-xl glass-input outline-none ring-0 focus:ring-1 focus:ring-black/10"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl glass-input outline-none ring-0 focus:ring-1 focus:ring-black/10"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    className="w-full px-4 py-3 rounded-xl glass-input outline-none ring-0 focus:ring-1 focus:ring-black/10"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={cn(
                    "w-full py-3 px-8 rounded-xl font-medium transition-all duration-300 ease-apple",
                    "bg-black text-white hover:bg-black/90 relative overflow-hidden",
                    isSubmitting && "opacity-90"
                  )}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : "Send Message"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
