"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getFirestore, doc, getDoc, DocumentData } from "firebase/firestore";
import { toast } from "sonner";
import { 
  SortOption, 
  ViewOption, 
  DisplayMode, 
  TLikedProduct,
  Product,
  MessageData 
} from "@/types/message";
import MessageContent from "./Message/MessageContent";
import ViewToggle from "./Message/ViewToggle";
import SortDropdown from "./Message/SortDropDown";
import ProductComparison from "./Message/ProductComparsion";
import ProductGrid from "./Message/ProductGrid";
import TagList from "./Message/TagList";

type Props = {
  messageId?: string;
  message?: DocumentData;
};

const MessageMarkdownRenderer = ({
  messageId,
  message: initialMessage,
}: Props) => {
  const [message, setMessage] = useState<MessageData | null>(
    initialMessage || null
  );
  const [loading, setLoading] = useState(!initialMessage && !!messageId);
  const [error, setError] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(8);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [viewOption, setViewOption] = useState<ViewOption>("reranked");
  const [displayMode, setDisplayMode] = useState<DisplayMode>("tabs");
  const [sortedProducts, setSortedProducts] = useState<Product[]>([]);
  const [sortedOriginalProducts, setSortedOriginalProducts] = useState<Product[]>([]);
  const [likedProducts, setLikedProducts] = useState<string[]>([]);

  const loadMore = useCallback(() => {
    setDisplayCount((prevCount) => prevCount + 8);
  }, []);

  // Fetch message data
  useEffect(() => {
    if (messageId && !initialMessage) {
      const fetchMessage = async () => {
        try {
          setLoading(true);

          const db = getFirestore();
          const messageRef = doc(db, "messages", messageId);
          const messageSnap = await getDoc(messageRef);

          if (messageSnap.exists()) {
            setMessage(messageSnap.data() as MessageData);
          } else {
            setError("Message not found");
          }
        } catch (err) {
          console.error("Error fetching message:", err);
          setError("Failed to load message");
        } finally {
          setLoading(false);
        }
      };

      fetchMessage();
    }
  }, [messageId, initialMessage]);

  // Sort products
  useEffect(() => {
    if (message?.products) {
      const products = [...message.products];
      setSortedProducts(sortProductsByPrice(products, sortOption));
    }
    
    if (message?.originalProducts) {
      const originalProducts = [...message.originalProducts];
      setSortedOriginalProducts(sortProductsByPrice(originalProducts, sortOption));
    }
  }, [message, sortOption]);

  const sortProductsByPrice = (products: Product[], sortOption: SortOption) => {
    const parsePrice = (priceStr: string | undefined) => {
      if (!priceStr) return 0;
      const numericPrice = parseFloat(priceStr.replace(/[$,£€₹]/g, ""));
      return isNaN(numericPrice) ? 0 : numericPrice;
    };

    // First put all the initial products in a single array 
    const sortedProducts = [...products];

    // Then modify that array based on the choice of the user
    if (sortOption === "low-to-high") {
      sortedProducts.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOption === "high-to-low") {
      sortedProducts.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    }

    return sortedProducts;
  };

  // Find position change between original and reranked products
  const findPositionChange = (product: Product) => {
    if (!message?.originalProducts || !message?.products) return 0;
    
    const getProductIdentifier = (p: Product) => p.product_link || p.link || p.title;
    const productId = getProductIdentifier(product);
    
    const originalIndex = message.originalProducts.findIndex(
      (p: Product) => getProductIdentifier(p) === productId
    );
    const rerankedIndex = message.products.findIndex(
      (p: Product) => getProductIdentifier(p) === productId
    );
    
    if (originalIndex === -1 || rerankedIndex === -1) return 0;
    return originalIndex - rerankedIndex;
  };

  const handleLike = async (product: Product) => {
    try {
      const productId = product.id || `product-${Date.now()}`;

      // Prepare the data to be sent to the API
      const likedProduct: TLikedProduct = {
        product_id: productId,
        thumbnail: product.thumbnail || "",
        product_link: product.product_link || product.link || "",
        title: product.title || "",
        price: product.price || "",
      };

      // Make the API call
      const response = await fetch("/api/like", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(likedProduct),
      });

      if (response) {
        toast("Liked!", {});
        // Update local state to reflect the liked status
        setLikedProducts(prev => [...prev, productId]);
      } else {
        console.error("Failed to like product");
      }
    } catch (error) {
      console.error("Error liking product:", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading message...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!message) {
    return <div className="p-4">No message data available</div>;
  }

  const isGPT = message.user?.name === "SpaceGPT" || message.user?._id === "CortexQ";
  const hasOriginalProducts = message.originalProducts && message.originalProducts.length > 0;
  const hasRerankedProducts = message.products && message.products.length > 0;
  const hasProductComparisonAvailable = hasOriginalProducts && hasRerankedProducts;

  return (
    <div className="items-center flex justify-center mt-3 w-full">
      <div className={`py-5 ${!isGPT ? "border-b" : ""} max-w-5xl w-full p-5`}>
        <MessageContent message={message} />

        {/* Product recommendations section */}
        {isGPT && (hasRerankedProducts || hasOriginalProducts) && (
          <div className="flex flex-col gap-4 mt-4">
            {/* Controls for sorting and view options */}
            <div className="flex justify-between mb-2">
              {/* Display mode switcher - only show if we have both original and reranked */}
              {hasProductComparisonAvailable && (
                <ViewToggle
                  viewOption={viewOption}
                  setViewOption={setViewOption}
                  displayMode={displayMode}
                  setDisplayMode={setDisplayMode}
                />
              )}
              
              {/* Sort dropdown */}
              <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
            </div>

            {/* Product display based on view option */}
            {viewOption === "compare" && hasProductComparisonAvailable ? (
              <ProductComparison
                displayMode={displayMode}
                sortedProducts={sortedProducts}
                sortedOriginalProducts={sortedOriginalProducts}
                displayCount={displayCount}
                onLoadMore={loadMore}
                likedProducts={likedProducts}
                onLike={handleLike}
                findPositionChange={findPositionChange}
              />
            ) : (
              // Regular product grid (default view)
              <ProductGrid
                products={ sortedProducts }
                displayCount={displayCount}
                onLoadMore={loadMore}
                likedProducts={likedProducts}
                onLike={handleLike}
              />
            )}

            {/* Tags at the bottom */}
            {message.tags && <TagList tags={message.tags} />}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageMarkdownRenderer;