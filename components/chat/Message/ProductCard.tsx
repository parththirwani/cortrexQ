"use client";
import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/types/message";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index: number;
  showRankChange?: boolean;
  positionChange?: number;
  isLiked: boolean;
  onLike: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  showRankChange = false,
  positionChange = 0,
  isLiked,
  onLike,
}) => {
  const productId = product.id || `product-${index}`;
  const productLink = product.product_link || product.link || "#";

  const handleLikeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLike(product);
  };

  return (
    <div
      className="flex flex-col border border-gray-100 rounded-lg overflow-hidden relative"
    >
      {showRankChange && positionChange !== 0 && (
        <div className="absolute top-2 left-2 z-10 rounded-full text-xs font-medium px-2 py-1 flex items-center justify-center shadow-sm"
          style={{
            backgroundColor: positionChange > 0 ? 'rgba(220, 252, 231, 0.95)' : 'rgba(254, 226, 226, 0.95)',
            color: positionChange > 0 ? '#166534' : '#991b1b'
          }}
        >
          {positionChange > 0 ? `↑${positionChange}` : `↓${Math.abs(positionChange)}`}
        </div>
      )}
      
      {product.score !== undefined && (
        <div className="absolute top-2 right-2 z-10 bg-blue-50 text-blue-700 rounded-full text-xs px-2 py-1 shadow-sm">
          Score: {(product.score * 100).toFixed(0)}%
        </div>
      )}

      <div className="aspect-square relative">
        <Link
          href={productLink}
          className="cursor-pointer"
          target="_blank"
        >
          {product.thumbnail && (
            <div className="w-full h-full relative rounded-xl p-2">
              <img
                src={product.thumbnail}
                width={100}
                height={100}
                alt={product.title || "Product image"}
                className="w-full h-full object-cover rounded-xl"
              />

              {/* Like Button */}
              <button
                onClick={handleLikeClick}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md transition-all hover:scale-110"
                aria-label="Like product"
              >
                <Heart
                  size={18}
                  className={`${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-500"
                  }`}
                />
              </button>

              {product.tag && (
                <div className="absolute top-2 left-2 bg-gray-100 text-xs px-2 py-1 rounded-full">
                  {product.tag}
                </div>
              )}
            </div>
          )}
        </Link>
      </div>
      <div className="p-3 bg-transparent">
        <div className="flex justify-between items-start">
          <div className="font-medium text-gray-900">
            {product.price || ""}
          </div>
          <div className="text-xs text-gray-500">
            {product.source || product.store || ""}
          </div>
        </div>
        <div className="text-sm text-gray-900 mt-1 line-clamp-2">
          {product.title || "Product Name"}
        </div>
        <div className="mt-2">
          <button
            onClick={() => {
              window.open(productLink, "_blank");
            }}
            className="w-full text-gray-500 text-xs font-medium rounded transition-colors"
          >
            Click for details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;