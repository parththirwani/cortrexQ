"use client";
import React, { createContext, useContext, useCallback, ReactNode } from 'react';

// Type for resources
export type ResourceType = "link" | "image" | "video" | "document" | "audio" | "other";

export type Resource = {
  id: string;
  title: string;
  url: string;
  description?: string;
  domain?: string;
  type?: ResourceType;
  imageUrl?: string;
  addedAt: Date;
};

// Context type
type ResourceContextType = {
  resources: Resource[];
  addResource: (resource: Omit<Resource, 'id' | 'addedAt'>) => void;
  clearResources: () => void;
};

// Create context with default values
const ResourceContext = createContext<ResourceContextType>({
  resources: [],
  addResource: () => {},
  clearResources: () => {},
});

// Hook to use the context
export const useResources = () => useContext(ResourceContext);

type ResourceProviderProps = {
  children: ReactNode;
};

// Provider component
export const ResourceProvider: React.FC<ResourceProviderProps> = ({ children }) => {
  const [resources, setResources] = React.useState<Resource[]>([]);

  // Add a new resource
  const addResource = useCallback((resource: Omit<Resource, 'id' | 'addedAt'>) => {
    setResources(prevResources => {
      // Check if resource with this URL already exists
      if (prevResources.some(r => r.url === resource.url)) {
        return prevResources;
      }
      
      return [
        ...prevResources,
        {
          ...resource,
          id: `resource-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          addedAt: new Date(),
        },
      ];
    });
  }, []);

  // Clear all resources
  const clearResources = useCallback(() => {
    setResources([]);
  }, []);

  return (
    <ResourceContext.Provider value={{ resources, addResource, clearResources }}>
      {children}
    </ResourceContext.Provider>
  );
};

export default ResourceProvider;