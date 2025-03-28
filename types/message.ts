import { DocumentData } from "firebase/firestore";

export type SortOption = "default" | "low-to-high" | "high-to-low";
export type ViewOption = "reranked" | "original" | "compare";
export type DisplayMode = "tabs" | "sideBySide";

export type TLikedProduct = {
  product_id: string;
  thumbnail: string;
  product_link: string;
  title: string;
  price: string;
};

export type Product = {
  id?: string;
  product_link?: string;
  link?: string;
  thumbnail?: string;
  title?: string;
  price?: string;
  source?: string;
  store?: string;
  tag?: string;
  score?: number;
};

export interface MessageData extends DocumentData {
  text?: string;
  products?: Product[];
  originalProducts?: Product[];
  user?: {
    name?: string;
    _id?: string;
    avatar?: string;
  };
  tags?: string[];
}