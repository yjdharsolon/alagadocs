
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useRevealAnimation, useParallax } from '../utils/animate';

const Hero: React.FC = () => {
  const { ref: titleRef, isVisible: titleVisible } = useRevealAnimation();
  const { ref: subtitleRef, isVisible: subtitleVisible } = useRevealAnimation();
  const { ref: buttonRef, isVisible: buttonVisible } = useRevealAnimation();
  const parallaxOffset = useParallax(0.05);
  
  // Refs for element we'll animate
  const floatingObjRef1 = useRef<HTMLDivElement>(null);
  const floatingObjRef2 = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (floatingObjRef1.current && floatingObjRef2.current) {
        const moveX1 = (e.clientX - window.innerWidth / 2) * -0.01;
        const moveY1 = (e.clientY - window.innerHeight / 2) * -0.01;
        const moveX2 = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY2 = (e.clientY - window.innerHeight / 2) * 0.01;
        
        floatingObjRef1.current.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
        floatingObjRef2.current.style.transform = `translate(${moveX2}px, ${moveY2}px)`;
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div 
          ref={floatingObjRef1}
          className="absolute top-[20%] right-[10%] w-64 h-64 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 blur-3xl opacity-70 transition-transform duration-1000 ease-apple"
        />
        <div 
          ref={floatingObjRef2}
          className="absolute bottom-[20%] left-[10%] w-72 h-72 rounded-full bg-gradient-to-tr from-gray-100 to-gray-50 blur-3xl opacity-60 transition-transform duration-1000 ease-apple"
        />
      </div>
      
      <div 
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(217,216,255,0.5),rgba(255,255,255,0))]"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      />
      
      <div className="container px-4 md:px-6 flex flex-col items-center text-center max-w-5xl mx-auto">
        <div className="relative mb-4">
          <span className="inline-block px-3 py-1 text-xs tracking-wider uppercase bg-black/5 rounded-full mb-6 animate-fade-in">
            Minimalist Design
          </span>
        </div>
        
        <h1 
          ref={titleRef as React.RefObject<HTMLHeadingElement>}
          className={cn(
            "text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-tight md:leading-none mb-6 transition-all duration-1000 ease-apple",
            titleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          Design with intention, <br className="hidden sm:inline" />
          <span className="relative inline-block">
            <span className="relative z-10">function with purpose</span>
            <span className="absolute -bottom-1 left-0 w-full h-3 bg-blue-100/50 -z-10 translate-y-2" />
          </span>
        </h1>
        
        <p 
          ref={subtitleRef as React.RefObject<HTMLParagraphElement>}
          className={cn(
            "max-w-2xl text-base md:text-lg text-gray-600 mb-8 transition-all duration-1000 ease-apple delay-200",
            subtitleVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          Creating timeless design that combines minimalism, functionality, and attention to detail. 
          Every element serves a purpose, nothing is superfluous.
        </p>
        
        <div 
          ref={buttonRef as React.RefObject<HTMLDivElement>}
          className={cn(
            "flex flex-col sm:flex-row gap-4 transition-all duration-1000 ease-apple delay-300",
            buttonVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <button className="px-8 py-3 font-medium text-white bg-black rounded-xl hover:bg-black/80 transition-colors duration-300 ease-apple">
            Explore Products
          </button>
          <button className="px-8 py-3 font-medium text-black bg-transparent border border-black/20 rounded-xl hover:bg-black/5 transition-all duration-300 ease-apple">
            Learn More
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
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
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <polyline points="19 12 12 19 5 12" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
