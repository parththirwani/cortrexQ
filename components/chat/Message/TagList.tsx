"use client";
import React from "react";

interface TagListProps {
  tags: string[];
}

const TagList: React.FC<TagListProps> = ({ tags }) => {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <span className="text-xs bg-gray-100 px-3 py-1.5 rounded-full">
        CortexQ
      </span>
      {tags &&
        tags.map((tag: string, index: number) => (
          <span
            key={index}
            className="text-xs bg-gray-100 px-3 py-1.5 rounded-full"
          >
            {tag}
          </span>
        ))}
    </div>
  );
};

export default TagList;