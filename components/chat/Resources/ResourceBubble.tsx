"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ExternalLink, Link as LinkIcon } from "lucide-react";

type ResourceType = "link" | "image" | "video" | "document" | "audio" | "other";

type Resource = {
  title: string;
  url: string;
  description?: string;
  domain?: string;
  type?: ResourceType;
  faviconUrl?: string; // For website logos
};

interface ResourceBubbleProps {
  resources: Resource[];
  initialOpen?: boolean;
}

const ResourceBubble: React.FC<ResourceBubbleProps> = ({ 
  resources, 
  initialOpen = false
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [enrichedResources, setEnrichedResources] = useState<Resource[]>(resources);

  // Extract domain from URL
  const extractDomain = (url: string): string => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  // Get favicon URL for a domain
  const getFaviconUrl = (domain: string): string => {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  };

  // Enrich resources with favicons and domains
  useEffect(() => {
    const enrichResources = () => {
      const enriched = resources.map(resource => {
        const domain = resource.domain || extractDomain(resource.url);
        const faviconUrl = resource.faviconUrl || getFaviconUrl(domain);
        
        return {
          ...resource,
          domain,
          faviconUrl
        };
      });
      
      setEnrichedResources(enriched);
    };
    
    enrichResources();
  }, [resources]);

  return (
    <div className="my-2">
      {/* The bubble toggle button styled to look like example */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors rounded-full pl-2 pr-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        <div className="flex -space-x-1.5 mr-1">
          {enrichedResources.slice(0, 4).map((resource, index) => (
            <div 
              key={index} 
              className="w-5 h-5 rounded-full bg-white p-0.5 overflow-hidden ring-1 ring-gray-200 dark:ring-gray-700"
              style={{ zIndex: 4 - index }}
            >
              {resource.faviconUrl ? (
                <img 
                  src={resource.faviconUrl} 
                  alt={resource.domain} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${resource.domain?.charAt(0)}&background=random`;
                  }}
                />
              ) : (
                <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-xs">
                  {resource.domain?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          ))}
        </div>
        <span className="ml-1">Sources</span>
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1"
        >
          <ChevronRight size={14} />
        </motion.div>
      </button>

      {/* Animated dropdown with resource details */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
              <div className="max-h-80 overflow-y-auto">
                {enrichedResources.map((resource, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-3 ${
                      index !== enrichedResources.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                    }`}
                  >
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors p-2"
                    >
                      {/* Logo/favicon */}
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white dark:bg-gray-700 p-1 overflow-hidden ring-1 ring-gray-200 dark:ring-gray-600">
                        {resource.faviconUrl ? (
                          <img 
                            src={resource.faviconUrl} 
                            alt={resource.domain || ''} 
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://ui-avatars.com/api/?name=${resource.domain?.charAt(0)}&background=random`;
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white">
                            {resource.domain?.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Resource title and domain */}
                      <div className="flex-grow min-w-0">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-200 truncate">
                          {resource.title || resource.domain}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center">
                          {resource.domain}
                          <ExternalLink size={10} className="ml-1" />
                        </div>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourceBubble;