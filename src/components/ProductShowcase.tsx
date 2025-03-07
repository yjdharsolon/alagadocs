
import React from 'react';
import { cn } from '@/lib/utils';
import { useRevealAnimation } from '../utils/animate';

type Product = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
};

const ProductShowcase: React.FC = () => {
  const { ref: sectionRef, isVisible: sectionVisible } = useRevealAnimation();
  const { ref: title1Ref, isVisible: title1Visible } = useRevealAnimation();
  const { ref: title2Ref, isVisible: title2Visible } = useRevealAnimation();
  
  const products: Product[] = [
    {
      id: 1,
      title: "Minimalist Speaker",
      description: "Pure sound, no distractions. Crafted from premium materials with precision engineering.",
      imageUrl: "https://images.unsplash.com/photo-1545454675-3531b543be5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 2,
      title: "Essential Watch",
      description: "Time, simplified. Designed to complement life, not complicate it.",
      imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      id: 3,
      title: "Desk Lamp",
      description: "Lighting reimagined for focus and inspiration. Adjustable in every way that matters.",
      imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ];
  
  return (
    <section 
      id="products"
      className="py-24 bg-white"
      ref={sectionRef as React.RefObject<HTMLElement>}
    >
      <div className="container px-4 md:px-6 mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-xs tracking-wider uppercase bg-black/5 rounded-full mb-4">
            Our Products
          </span>
          <h2 
            ref={title1Ref as React.RefObject<HTMLHeadingElement>}
            className={cn(
              "text-3xl md:text-4xl font-medium mb-2 transition-all duration-700 ease-apple",
              title1Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Timeless Design
          </h2>
          <p 
            ref={title2Ref as React.RefObject<HTMLParagraphElement>}
            className={cn(
              "max-w-2xl mx-auto text-gray-600 transition-all duration-700 ease-apple delay-100",
              title2Visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
          >
            Products that elevate everyday experiences through thoughtful design and premium craftsmanship
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product, index) => {
            const { ref, isVisible } = useRevealAnimation();
            return (
              <div 
                key={product.id}
                ref={ref as React.RefObject<HTMLDivElement>}
                className={cn(
                  "rounded-2xl overflow-hidden bg-gray-50 transition-all duration-1000 ease-apple",
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16",
                  `delay-[${index * 100}ms]`
                )}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-2000 ease-smooth hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-medium mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <a 
                    href="#" 
                    className="inline-flex items-center text-sm font-medium group"
                  >
                    Explore
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
