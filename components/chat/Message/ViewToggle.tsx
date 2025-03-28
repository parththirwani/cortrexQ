"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ViewOption } from "@/types/message";
import DisplayModeSwitcher from "./DisplayModeSwitcher";


interface ViewToggleProps {
  viewOption: ViewOption;
  setViewOption: (option: ViewOption) => void;
  displayMode: "tabs" | "sideBySide";
  setDisplayMode: (mode: "tabs" | "sideBySide") => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  viewOption,
  setViewOption,
  displayMode,
  setDisplayMode,
}) => {
  return (
    <div className="flex space-x-2">
      <Button
        variant="outline"
        size="sm"
        className={`text-xs ${viewOption === "compare" ? "bg-gray-100" : ""}`}
        onClick={() => setViewOption("compare")}
      >
        <ArrowUpDown className="mr-1 h-3 w-3" />
        Compare Rankings
      </Button>
      
      {viewOption === "compare" && (
        <DisplayModeSwitcher 
          displayMode={displayMode} 
          setDisplayMode={setDisplayMode} 
        />
      )}
    </div>
  );
};

export default ViewToggle;