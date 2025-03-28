"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { DisplayMode } from "@/types/message";

interface DisplayModeSwitcherProps {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
}

const DisplayModeSwitcher: React.FC<DisplayModeSwitcherProps> = ({
  displayMode,
  setDisplayMode,
}) => {
  return (
    <div className="flex space-x-1">
      <Button
        variant="outline"
        size="sm"
        className={`text-xs ${displayMode === "tabs" ? "bg-gray-100" : ""}`}
        onClick={() => setDisplayMode("tabs")}
      >
        Tabs
      </Button>
      <Button
        variant="outline"
        size="sm"
        className={`text-xs ${displayMode === "sideBySide" ? "bg-gray-100" : ""}`}
        onClick={() => setDisplayMode("sideBySide")}
      >
        Side by Side
      </Button>
    </div>
  );
};

export default DisplayModeSwitcher;