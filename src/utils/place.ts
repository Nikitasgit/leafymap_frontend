import { PlaceType } from "@/types/models/place";

export const getPlaceTypeFromCreatorCategory = async (
  categoryId: string
): Promise<PlaceType[]> => {
  const subCategory = await SubCategory.findById(categoryId).populate("category");
  return [subCategory.category.name as PlaceType];
};
