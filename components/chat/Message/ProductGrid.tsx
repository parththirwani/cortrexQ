"use client";
import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@/types/message";
import LoadMoreButton from "./LoadMore";

interface ProductGridProps {
  products: Product[];
  displayCount: number;
  onLoadMore: () => void;
  likedProducts: string[];
  onLike: (product: Product) => void;
  showRankChanges?: boolean;
  findPositionChange?: (product: Product) => number;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  displayCount,
  onLoadMore,
  likedProducts,
  onLike,
  showRankChanges = false,
  findPositionChange = () => 0,
}) => {
  const hasMoreProducts = products && displayCount < products.length;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.slice(0, displayCount).map((product, index) => {
          const productId = product.id || `product-${index}`;
          const isLiked = likedProducts.includes(productId);
          const positionChange = showRankChanges ? findPositionChange(product) : 0;

          return (
            <ProductCard
              key={index}
              product={product}
              index={index}
              showRankChange={showRankChanges}
              positionChange={positionChange}
              isLiked={isLiked}
              onLike={onLike}
            />
          );
        })}
      </div>

      {hasMoreProducts && (
        <div className="flex justify-center mt-6">
          <LoadMoreButton onClick={onLoadMore} />
        </div>
      )}
    </>
  );
};

export default ProductGrid;