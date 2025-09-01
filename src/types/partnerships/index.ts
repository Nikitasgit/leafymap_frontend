import { Image } from "../image";

export interface Partnership {
  _id: string;
  place?: string;
  collaborator: {
    _id: string;
    name?: string;
    image?: string | Image;
    categories?: string[];
  };
  status: "pending" | "accepted" | "refused";
  type?: "place" | "event";
  deleted?: boolean;
}
