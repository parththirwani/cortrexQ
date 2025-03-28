"use client";
import React from "react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProductGrid from "./ProductGrid";
import { DisplayMode } from "@/types/message";
import ProductCard from "./ProductCard";
import { Product } from "@/types/message";


interface ProductComparisonProps {
  displayMode: DisplayMode;
  sortedProducts: Product[];
  sortedOriginalProducts: Product[];
  displayCount: number;
  onLoadMore: () => void;
  likedProducts: string[];
  onLike: (product: Product) => void;
  findPositionChange: (product: Product) => number;
}

const ProductComparison: React.FC<ProductComparisonProps> = ({
  displayMode,
  sortedProducts,
  sortedOriginalProducts,
  displayCount,
  onLoadMore,
  likedProducts,
  onLike,
  findPositionChange,
}) => {
  const hasMoreProducts = sortedProducts.length > displayCount;
  const hasMoreOriginalProducts = sortedOriginalProducts.length > displayCount;

  if (displayMode === "tabs") {
    return (
      <Tabs defaultValue="reranked" className="w-full">
        <TabsList className="w-full flex mb-4">
          <TabsTrigger value="reranked" className="flex-1">
            Optimized Rankings
          </TabsTrigger>
          <TabsTrigger value="original" className="flex-1">
            Original Rankings
          </TabsTrigger>
        </TabsList>
        
        {/* Reranked products tab */}
        <TabsContent value="reranked" className="mt-0">
          <ProductGrid
            products={sortedProducts}
            displayCount={displayCount}
            onLoadMore={onLoadMore}
            likedProducts={likedProducts}
            onLike={onLike}
            showRankChanges={true}
            findPositionChange={findPositionChange}
          />
        </TabsContent>
        
        {/* Original products tab */}
        <TabsContent value="original" className="mt-0">
          <ProductGrid
            products={sortedOriginalProducts}
            displayCount={displayCount}
            onLoadMore={onLoadMore}
            likedProducts={likedProducts}
            onLike={onLike}
          />
        </TabsContent>
      </Tabs>
    );
  } else {
    // Side by side view
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original products */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4 text-center">Original Rankings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedOriginalProducts
              .slice(0, Math.min(displayCount, 8))
              .map((product, index) => {
                const productId = product.id || `product-${index}`;
                const isLiked = likedProducts.includes(productId);
                return (
                  <ProductCard
                    key={index}
                    product={product}
                    index={index}
                    isLiked={isLiked}
                    onLike={onLike}
                  />
                );
              })}
          </div>
          {sortedOriginalProducts.length > 8 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("#", "_blank")}
                className="px-4 text-xs"
              >
                See All
              </Button>
            </div>
          )}
        </div>
        
        {/* Reranked products */}
        <div>
          <h3 className="font-medium text-gray-900 mb-4 text-center">Optimized Rankings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {sortedProducts
              .slice(0, Math.min(displayCount, 8))
              .map((product, index) => {
                const productId = product.id || `product-${index}`;
                const isLiked = likedProducts.includes(productId);
                const positionChange = findPositionChange(product);
                return (
                  <ProductCard
                    key={index}
                    product={product}
                    index={index}
                    showRankChange={true}
                    positionChange={positionChange}
                    isLiked={isLiked}
                    onLike={onLike}
                  />
                );
              })}
          </div>
          {sortedProducts.length > 8 && (
            <div className="flex justify-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open("#", "_blank")}
                className="px-4 text-xs"
              >
                See All
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default ProductComparison;