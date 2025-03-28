"use client";
import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import Image from "next/image";
import { LinkExtractorService } from "../Resources/LinkExtractor";
import { MessageData } from "@/types/message";
import ResourceBubble from "../Resources/ResourceBubble";


interface MessageContentProps {
  message: MessageData;
}

const MessageContent: React.FC<MessageContentProps> = ({ message }) => {
  // Extract and enrich links from message text
  const resources = useMemo(() => {
    if (!message.text) return [];
    
    const extractedLinks = LinkExtractorService.extractLinks(message.text);
    return LinkExtractorService.enrichLinks(extractedLinks);
  }, [message.text]);

  // Determine whether to show resource bubble
  const showResourceBubble = resources.length > 0;

  return (
    <div className="flex space-x-5 p-5 mx-auto">
      {/* User/Assistant icon */}
      <div className="flex-shrink-0 w-8 h-8 bg-black rounded-full flex items-center justify-center overflow-hidden">
        {message.user?.avatar && (
          <Image
            src={message.user.avatar}
            alt=""
            width={100}
            height={100}
            className="h-full w-full object-cover border-none"
          />
        )}
      </div>

      <div className="w-full">
        {/* Message text content */}
        <div className="text-sm leading-relaxed">
          {message.text ? (
            <ReactMarkdown rehypePlugins={[rehypeRaw]}>
              {message.text}
            </ReactMarkdown>
          ) : null}
          
          {/* Resource bubble with website logos */}
          {showResourceBubble && (
            <ResourceBubble resources={resources} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageContent;