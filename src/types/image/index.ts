export interface ImageUrls {
  original: string;
  thumbnail: string;
  medium: string;
}

export interface Image {
  _id: string;
  urls: ImageUrls;
  user?: string;
  reference: string;
  referenceType: "Place" | "User" | "Event" | "Message" | "Review";
  type: "profile" | "cover" | "gallery" | "other";
  originalName: string;
  size: number;
  mimetype: string;
  createdAt?: string;
  updatedAt?: string;
}
