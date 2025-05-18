export type SubCategory = {
  _id: string;
  name: string;
  categoryId: string;
};

export type Category = {
  _id: string;
  name: string;
  subCategories: SubCategory[];
};

export type PlaceCategory = {
  _id: string;
  name: string;
  description: string;
};
