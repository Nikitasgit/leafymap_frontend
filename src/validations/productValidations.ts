import { Product } from "@/types/product";
import { z } from "zod";
import { ValidationResult } from "./commonValidations";

export const productCategorySchema = z
  .string()
  .min(1, "La catégorie du produit est requise");

const newProductSchema = z.object({
  productCategory: productCategorySchema,
});

export const validateNewProductData = (
  data: Partial<Product>
): ValidationResult => {
  const errors: Record<string, string> = {};
  const result = newProductSchema.safeParse(data);
  if (!result.success && result.error?.issues) {
    result.error.issues.forEach((issue) => {
      const field = issue.path.map(String).join(".");
      errors[field] = issue.message;
    });
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

export const validateUpdateProductData = (
  data: Partial<Product>
): ValidationResult => {
  const errors: Record<string, string> = {};
  const updateSchema = newProductSchema.partial();
  const result = updateSchema.safeParse(data);
  if (!result.success && result.error?.issues) {
    result.error.issues.forEach((issue) => {
      const field = issue.path.map(String).join(".");
      errors[field] = issue.message;
    });
  }
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
