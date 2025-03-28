"use client";

import { Button } from "@/components/ui/button";
import { 
  Search, 
  Sparkles, 
  ShoppingBag, 
  Tag,
  Heart
} from "lucide-react";

interface QuickLinksProps {
  onLinkClick: (text: string) => void;
}

export function QuickLinks({ onLinkClick }: QuickLinksProps) {
  const quickLinks = [
    { 
      text: "Outfit inspo for", 
      icon: <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-500" />
    },
    { 
      text: "Find me some", 
      icon: <Search className="h-3.5 w-3.5 mr-1.5 text-blue-500" />
    },
    { 
      text: "Shop from the show", 
      icon: <ShoppingBag className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
    },
    { 
      text: "Affordable", 
      icon: <Tag className="h-3.5 w-3.5 mr-1.5 text-green-500" />
    },
    { 
      text: "Top rated", 
      icon: <Heart className="h-3.5 w-3.5 mr-1.5 text-red-500" />
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-5 justify-center max-w-2xl mx-auto">
      {quickLinks.map((link, index) => (
        <Button
          key={index}
          variant="outline"
          className="rounded-full text-sm py-1.5 px-3 border-none shadow-sm 
            bg-gray-50 hover:bg-gray-100 text-gray-700
            transition-all duration-150 flex items-center
            transform hover:scale-105 hover:shadow focus:ring-2 focus:ring-offset-1 focus:ring-opacity-50"
          onClick={() => onLinkClick(link.text)}
        >
          {link.icon}
          <span>{link.text}</span>
        </Button>
      ))}
    </div>
  );
}