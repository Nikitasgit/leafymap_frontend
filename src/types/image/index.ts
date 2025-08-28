export interface Image {
  _id: string;
  url: string;
  user?: string; // ObjectId reference to User
  reference: string; // ObjectId reference to the entity this image belongs to
  referenceType: "Place" | "User" | "Event" | "Message" | "Review";
  type: "profile" | "cover" | "gallery" | "other";
  originalName: string;
  size: number;
  mimetype: string;
  createdAt?: string;
  updatedAt?: string;
}


