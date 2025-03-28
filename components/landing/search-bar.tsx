"use client";
import { ArrowUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase";
import { GiClothes } from "react-icons/gi";
import { useDeferredValue, useEffect, useRef, useState, useCallback } from "react";
import Loader from "../loader";
import { QuickLinks } from "./quick-links";


const SkeletonSuggestion = () => (
  <div className="text-sm select-none py-3 px-4 border-b border-gray-100 last:border-b-0 flex items-center animate-pulse">
    <div className="h-4 w-4 bg-gray-200 rounded mr-2 flex-shrink-0"></div>
    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
  </div>
);

export function SearchBar() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const deferredInput = useDeferredValue(input);
  const [suggestions, setSuggestions] = useState([]);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const resultsContainerRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Debounced fetch suggestions function
  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    
    try {
      setIsDebouncing(false);
      const response = await fetch(`/api/autoComplete?query=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    }
  }, []);

  // Implement debouncing on input change
  useEffect(() => {
    if (deferredInput === "") {
      setSuggestions([]);
      return;
    }
    
    setIsDebouncing(true);
    
    // Clear any existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    // Set a new timeout
    debounceTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(deferredInput);
    }, 300); // 300ms debounce delay
    
    // Cleanup function
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [deferredInput, fetchSuggestions]);
  
  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        resultsContainerRef.current &&
        !resultsContainerRef.current.contains(e.target as Node)
      ) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle search submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setLoading(true);
    try {
      const doc = await addDoc(
        collection(db, "users", session?.user?.email!, "chats"),
        {
          id: session?.user?.email,
          createdAt: serverTimestamp(),
        }
      );

      await fetch("/api/askQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          chatId: doc.id,
          session,
        }),
      });
      
      router.push(`/chat/${doc.id}`);
    } catch (error) {
      console.error("Error submitting search:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    setSuggestions([]);
  };

  // Handle quick link click
  const handleQuickLinkClick = (text: string) => {
    setInput(text + " ");
    
    // Focus the input field after clicking a quick link
    if (inputRef.current) {
      inputRef.current.focus();
      
      // Place cursor at the end of the input
      const length = text.length + 1; // +1 for the space
      setTimeout(() => {
        inputRef.current?.setSelectionRange(length, length);
      }, 0);
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl">
      {loading ? (
        <div className="py-3 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        <>
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
              <GiClothes className="h-6 w-6 text-muted-foreground" />
            </div>
            <form onSubmit={handleSubmit}>
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-10 pr-10 py-6 rounded-full border-2 text-base 
                  focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
                placeholder="Try 'good hiking shoes?'"
                aria-label="Search"
                autoComplete="off"
              />
              <Button
                size="icon"
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-gray-200 hover:bg-gray-300 text-gray-700"
                disabled={!input.trim()}
                aria-label="Search"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </form>
            
            {suggestions.length > 0 && (
              <div 
                className="absolute top-14 left-0 z-20 w-full rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-200 ease-in-out"
                ref={resultsContainerRef}
              >
                {isDebouncing && (
                  <SkeletonSuggestion/>
                )}
                <div className="max-h-64 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={`${suggestion}-${index}`}
                      className="text-sm cursor-pointer select-none relative py-3 px-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 flex items-center"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <GiClothes className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <QuickLinks onLinkClick={handleQuickLinkClick} />
        </>
      )}
    </div>
  );
}

// "use client";
// import { ArrowUp } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// import { db } from "@/firebase";
// import { GiClothes } from "react-icons/gi";
// import { useDeferredValue, useEffect, useRef, useState, useCallback } from "react";
// import Loader from "../loader";
// import { QuickLinks } from "./quick-links";
// import Image from "next/image";

// const SkeletonSuggestion = () => (
//   <div className="text-sm select-none py-3 px-4 border-b border-gray-100 last:border-b-0 flex items-center animate-pulse">
//     <div className="h-4 w-4 bg-gray-200 rounded mr-2 flex-shrink-0"></div>
//     <div className="h-4 bg-gray-200 rounded w-4/5"></div>
//   </div>
// );

// // Hardcoded trending aesthetics
// const womenAesthetics = [
//   { id: "date-night", name: "date night" },
//   { id: "pilates-princess", name: "pilates princess" },
//   { id: "old-money", name: "old money" },
//   { id: "barbiecore", name: "barbiecore" },
//   { id: "brunch-with-the-gals", name: "brunch with the gals" },
//   { id: "summer-in-europe", name: "summer in europe" },
//   { id: "rachel-green", name: "rachel green" },
//   { id: "alia-bhatt", name: "alia bhatt" },
//   { id: "taylor-swift", name: "taylor swift" },
// ];

// const menAesthetics = [
//   { id: "streetwear", name: "streetwear" },
//   { id: "business-casual", name: "business casual" },
//   { id: "athleisure", name: "athleisure" },
//   { id: "vintage", name: "vintage" },
//   { id: "minimalist", name: "minimalist" },
//   { id: "tech-wear", name: "tech wear" },
//   { id: "skater", name: "skater" },
//   { id: "coastal-prep", name: "coastal prep" },
//   { id: "y2k", name: "y2k" },
// ];

// export function SearchBar() {
//   const { data: session } = useSession();
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const router = useRouter();
//   const deferredInput = useDeferredValue(input);
//   const [suggestions, setSuggestions] = useState([]);
//   const [isDebouncing, setIsDebouncing] = useState(false);
//   const [showAestheticsModal, setShowAestheticsModal] = useState(false);
//   const [activeGender, setActiveGender] = useState("women");
//   const resultsContainerRef = useRef<HTMLDivElement>(null);
//   const modalRef = useRef<HTMLDivElement>(null);
//   const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//   const inputRef = useRef<HTMLInputElement>(null);
  
//   // Debounced fetch suggestions function
//   const fetchSuggestions = useCallback(async (query: string) => {
//     if (!query.trim()) {
//       setSuggestions([]);
//       return;
//     }
    
//     try {
//       setIsDebouncing(false);
//       const response = await fetch(`/api/autoComplete?query=${encodeURIComponent(query)}`);
//       if (!response.ok) throw new Error('Failed to fetch suggestions');
//       const data = await response.json();
//       setSuggestions(data.suggestions || []);
//     } catch (error) {
//       console.error("Error fetching suggestions:", error);
//       setSuggestions([]);
//     }
//   }, []);

//   // Implement debouncing on input change
//   useEffect(() => {
//     if (deferredInput === "") {
//       setSuggestions([]);
//       return;
//     }
    
//     setIsDebouncing(true);
    
//     // Clear any existing timeout
//     if (debounceTimeoutRef.current) {
//       clearTimeout(debounceTimeoutRef.current);
//     }
    
//     // Set a new timeout
//     debounceTimeoutRef.current = setTimeout(() => {
//       fetchSuggestions(deferredInput);
//     }, 300); // 300ms debounce delay
    
//     // Cleanup function
//     return () => {
//       if (debounceTimeoutRef.current) {
//         clearTimeout(debounceTimeoutRef.current);
//       }
//     };
//   }, [deferredInput, fetchSuggestions]);
  
//   // Handle click outside to close dropdowns
//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       // Close suggestions dropdown
//       if (
//         resultsContainerRef.current &&
//         !resultsContainerRef.current.contains(e.target as Node) &&
//         !inputRef.current?.contains(e.target as Node)
//       ) {
//         setSuggestions([]);
//       }
      
//       // Close aesthetics modal
//       if (
//         modalRef.current &&
//         !modalRef.current.contains(e.target as Node) &&
//         !inputRef.current?.contains(e.target as Node)
//       ) {
//         setShowAestheticsModal(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Handle search submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) {
//       // If search box is empty, toggle trending aesthetics
//       setShowAestheticsModal(!showAestheticsModal);
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const doc = await addDoc(
//         collection(db, "users", session?.user?.email!, "chats"),
//         {
//           id: session?.user?.email,
//           createdAt: serverTimestamp(),
//         }
//       );

//       await fetch("/api/askQuestion", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           prompt: input,
//           chatId: doc.id,
//           session,
//         }),
//       });
      
//       router.push(`/chat/${doc.id}`);
//     } catch (error) {
//       console.error("Error submitting search:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle suggestion selection
//   const handleSuggestionClick = (suggestion: string) => {
//     setInput(suggestion);
//     setSuggestions([]);
//   };

//   // Handle aesthetic selection
//   const handleAestheticClick = (aesthetic: { id: string, name: string }) => {
//     setInput(aesthetic.name);
//     setShowAestheticsModal(false);
//     // Optional: Auto-submit the search with this aesthetic
//     // handleSubmit(new Event('submit') as React.FormEvent);
//   };

//   // Handle search box focus
//   const handleSearchFocus = () => {
//     setShowAestheticsModal(true);
//   };

//   // Switch between men's and women's aesthetics
//   const switchGender = (gender: string) => {
//     setActiveGender(gender);
//   };

//   return (
//     <div className="flex flex-col items-center w-full max-w-2xl">
//       {loading ? (
//         <div className="py-3 flex items-center justify-center">
//           <Loader />
//         </div>
//       ) : (
//         <>
//           <div className="relative w-full">
//             <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
//               <GiClothes className="h-6 w-6 text-muted-foreground" />
//             </div>
//             <form onSubmit={handleSubmit}>
//               <Input
//                 ref={inputRef}
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onFocus={handleSearchFocus}
//                 onClick={() => setShowAestheticsModal(true)}
//                 className="pl-10 pr-10 py-6 rounded-full border-2 text-base 
//                   focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
//                 placeholder="Try 'old money aesthetic' or 'tennis fashion'"
//                 aria-label="Search"
//                 autoComplete="off"
//               />
//               <Button
//                 size="icon"
//                 type="submit"
//                 className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-8 w-8 bg-gray-200 hover:bg-gray-300 text-gray-700"
//                 aria-label="Search"
//               >
//                 <ArrowUp className="h-4 w-4" />
//               </Button>
//             </form>
            
//             {suggestions.length > 0 && (
//               <div 
//                 className="absolute top-14 left-0 z-20 w-full rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-200 ease-in-out"
//                 ref={resultsContainerRef}
//               >
//                 {isDebouncing ? (
//                   <SkeletonSuggestion/>
//                 ) : (
//                   <div className="max-h-64 overflow-y-auto">
//                     {suggestions.map((suggestion, index) => (
//                       <div
//                         key={`${suggestion}-${index}`}
//                         className="text-sm cursor-pointer select-none relative py-3 px-4 hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 flex items-center"
//                         onClick={() => handleSuggestionClick(suggestion)}
//                       >
//                         <GiClothes className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
//                         <span>{suggestion}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             )}
            
//             {showAestheticsModal && (
//               <div 
//                 className="fixed inset-0 z-30 backdrop-blur-sm bg-black/30 flex items-center justify-center"
//                 ref={modalRef}
//               >
//                 <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-xl p-4 flex flex-col max-h-[90vh] overflow-y-auto">
//                   {/* Top section with search */}
//                   <div className="flex items-center justify-between mb-6">
//                     <button 
//                       onClick={() => setShowAestheticsModal(false)}
//                       className="text-gray-500 hover:text-gray-700 text-2xl"
//                     >
//                       &times;
//                     </button>
//                     <div className="flex-1 px-4">
//                       <Input
//                         value={input}
//                         onChange={(e) => setInput(e.target.value)}
//                         className="w-full rounded-full border-2 py-2 px-4"
//                         placeholder="Search..."
//                         autoComplete="off"
//                       />
//                     </div>
//                     <button 
//                       onClick={() => setShowAestheticsModal(false)}
//                       className="text-gray-700 hover:text-gray-900"
//                     >
//                       <ArrowUp className="h-4 w-4" />
//                     </button>
//                   </div>
                  
//                   {/* Gender tabs */}
//                   <div className="flex justify-center mb-6">
//                     <div className="inline-flex rounded-full bg-gray-100 p-1">
//                       <button
//                         className={`px-8 py-2 rounded-full text-sm font-medium ${
//                           activeGender === 'women' 
//                             ? 'bg-red-500 text-white' 
//                             : 'text-gray-700'
//                         }`}
//                         onClick={() => switchGender('women')}
//                       >
//                         women
//                       </button>
//                       <button
//                         className={`px-8 py-2 rounded-full text-sm font-medium ${
//                           activeGender === 'men' 
//                             ? 'bg-blue-500 text-white' 
//                             : 'text-gray-700'
//                         }`}
//                         onClick={() => switchGender('men')}
//                       >
//                         men
//                         <span className="ml-1 text-xs text-gray-500">launching soon</span>
//                       </button>
//                     </div>
//                   </div>
                  
//                   {/* Popular heading */}
//                   <div className="mb-4">
//                     <h3 className="text-sm font-medium text-gray-500">popular on shoppin'</h3>
//                   </div>
                  
//                   {/* Aesthetic grid */}
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     {(activeGender === 'women' ? womenAesthetics : menAesthetics).map((aesthetic) => (
//                       <div
//                         key={aesthetic.id}
//                         className="flex items-center rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
//                         onClick={() => handleAestheticClick(aesthetic)}
//                       >
//                         <div className="w-16 h-16 relative flex-shrink-0">
//                           {/* Use white-icon.jpg as placeholder */}
//                           <Image 
//                             src="/aesthetics/old-money.jpg" 
//                             alt={aesthetic.name}
//                             width={64}
//                             height={64}
//                             className="object-cover"
//                           />
//                         </div>
//                         <div className="p-3">
//                           <span className="text-sm font-medium">{aesthetic.name}</span>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
          
//           <QuickLinks onLinkClick={(text) => {
//             setInput(text + " ");
//             setShowAestheticsModal(false);
//           }} />
//         </>
//       )}
//     </div>
//   );
// }