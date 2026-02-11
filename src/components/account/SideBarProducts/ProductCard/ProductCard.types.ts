import { Product } from "@/types/product";

export interface ProductCardAction {
  label: string;
  onClick: () => void;
}

export interface ProductCardProps {
  product: Product;
  className?: string;
  actions?: ProductCardAction[];
}
