
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center max-w-lg mx-auto px-4">
          <span className="inline-block px-3 py-1 text-xs tracking-wider uppercase bg-black/5 rounded-full mb-4">
            404 Error
          </span>
          <h1 className="text-4xl md:text-5xl font-medium mb-4">Page not found</h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <a 
            href="/" 
            className="px-8 py-3 font-medium text-white bg-black rounded-xl hover:bg-black/80 transition-colors duration-300 ease-apple inline-block"
          >
            Return Home
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
