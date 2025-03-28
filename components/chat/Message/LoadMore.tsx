"use client";
import React from "react";
import { Button } from "@/components/ui/button";

interface LoadMoreButtonProps {
  onClick: () => void;
}

const LoadMoreButton: React.FC<LoadMoreButtonProps> = ({ onClick }) => {
  return (
    <Button variant="outline" onClick={onClick} className="px-6">
      Load More
    </Button>
  );
};

export default LoadMoreButton;