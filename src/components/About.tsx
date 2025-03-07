
import React from 'react';
import { cn } from '@/lib/utils';
import { useRevealAnimation } from '../utils/animate';

const About: React.FC = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useRevealAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useRevealAnimation();
  const { ref: imageRef, isVisible: imageVisible } = useRevealAnimation();
  
  const principles = [
    {
      title: "Simplicity",
      description: "We believe in reducing complexity to reveal elegance."
    },
    {
      title: "Functionality",
      description: "Every element serves a purpose. Nothing is superfluous."
    },
    {
      title: "Quality",
      description: "Premium materials and meticulous craftsmanship define our approach."
    },
    {
      title: "Sustainability",
      description: "Designed to last physically and aesthetically."
    }
  ];
  
  return (
    <section 
      id="about"
      className="py-24 bg-gray-50"
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div 
            ref={contentRef as React.RefObject<HTMLDivElement>}
            className={cn(
              "transition-all duration-1000 ease-apple",
              contentVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
            )}
          >
            <span className="inline-block px-3 py-1 text-xs tracking-wider uppercase bg-black/5 rounded-full mb-4">
              Our Philosophy
            </span>
            
            <h2 className="text-3xl md:text-4xl font-medium mb-6">
              Design Principles <br />That Guide Us
            </h2>
            
            <p className="text-gray-600 mb-8">
              We create objects that enhance daily living through thoughtful design. 
              Our creations embody a commitment to minimalism, functionality, and timeless elegance.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {principles.map((principle, index) => (
                <div key={index} className="group">
                  <h3 className="text-lg font-medium mb-2 group-hover:text-black/80 transition-colors">{principle.title}</h3>
                  <p className="text-gray-600 text-sm">{principle.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div 
            ref={imageRef as React.RefObject<HTMLDivElement>}
            className={cn(
              "relative transition-all duration-1000 ease-apple delay-300",
              imageVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-12"
            )}
          >
            <div className="aspect-square rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1616627547584-bf28cee262db?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                alt="Minimalist workspace"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="absolute -bottom-6 -left-6 w-1/2 aspect-square p-6 glass-card">
              <div className="flex h-full flex-col justify-between">
                <div className="text-3xl font-light">20+</div>
                <div className="text-sm">Years of design excellence</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
