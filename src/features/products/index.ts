// Public API of the products feature — import from "@/features/products".
// Prefer deep imports for types from other features to avoid barrel cycles:
// `@/features/products/types`.

// Types
export type { CategoryTypeRef, ProductCategory, Product } from "./types";

// API
export {
  getUserProducts,
  createProduct,
  deleteProduct,
} from "./api/productsApi";

// Hooks
export { useUserProducts } from "./hooks/useUserProducts";
export { default as useSubmitProduct } from "./hooks/useSubmitProduct";

// Components
export { default as MyProductsTab } from "./components/myProductsTab";
