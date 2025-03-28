"use client";

// Service to extract links from markdown or plain text
export class LinkExtractorService {
  // Extract links from markdown or plain text
  static extractLinks(text: string): Array<{title: string, url: string}> {
    if (!text) return [];
    
    const links: Array<{title: string, url: string}> = [];
    
    // Find Markdown links [text](url)
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let markdownMatch;
    
    while ((markdownMatch = markdownLinkRegex.exec(text)) !== null) {
      links.push({
        title: markdownMatch[1].trim(),
        url: markdownMatch[2].trim(),
      });
    }
    
    // Find raw URLs in text that aren't already part of markdown links
    const urlRegex = /(?<!\]\()https?:\/\/[^\s()<>]+(?:\([^\s()<>]*\)|[^\s`!()\[\]{};:'\".,<>?«»""''])/g;
    let urlMatch;
    
    while ((urlMatch = urlRegex.exec(text)) !== null) {
      const url = urlMatch[0];
      
      // Check if this URL is already included in a markdown link
      const isAlreadyIncluded = links.some(link => link.url === url);
      
      if (!isAlreadyIncluded) {
        // Try to extract a meaningful title from the URL
        let title = this.extractDomain(url);
        
        // If path has meaningful parts, add the first segment
        const pathParts = new URL(url).pathname.split('/').filter(Boolean);
        if (pathParts.length > 0) {
          const pathName = pathParts[pathParts.length - 1]
            .replace(/-/g, ' ')
            .replace(/\.(html|php|aspx|jsp)$/i, '')
            .trim();
          
          if (pathName.length > 0) {
            title = this.capitalize(pathName);
          }
        }
        
        links.push({
          title,
          url,
        });
      }
    }
    
    return links;
  }
  
  // Extract domain from URL
  static extractDomain(url: string): string {
    try {
      const domain = new URL(url).hostname;
      // Remove www. if present
      return domain.replace(/^www\./, '');
    } catch (e) {
      return url;
    }
  }
  
  // Capitalize first letter of each word
  static capitalize(text: string): string {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Get favicon for a domain
  static getFaviconUrl(domain: string): string {
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  }
  
  // Determine resource type from URL
  static determineResourceType(url: string): 'link' | 'image' | 'video' | 'document' | 'audio' {
    const lowerUrl = url.toLowerCase();
    
    if (lowerUrl.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)(\?.*)?$/)) {
      return 'image';
    } else if (lowerUrl.match(/\.(mp4|webm|mov|avi|wmv)(\?.*)?$/) || 
               lowerUrl.includes('youtube.com') || 
               lowerUrl.includes('youtu.be') || 
               lowerUrl.includes('vimeo.com')) {
      return 'video';
    } else if (lowerUrl.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx)(\?.*)?$/)) {
      return 'document';
    } else if (lowerUrl.match(/\.(mp3|wav|ogg|m4a)(\?.*)?$/)) {
      return 'audio';
    } else {
      return 'link';
    }
  }
  
  // Get fully enriched resource data
  static enrichLinks(links: Array<{title: string, url: string}>) {
    return links.map(link => {
      const domain = this.extractDomain(link.url);
      const type = this.determineResourceType(link.url);
      const faviconUrl = this.getFaviconUrl(domain);
      
      return {
        ...link,
        domain,
        type,
        faviconUrl
      };
    });
  }
}