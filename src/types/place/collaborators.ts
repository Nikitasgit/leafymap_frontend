import { Image } from "../image";

export type Collaborator = {
  _id: string;
  name?: string;
  image?: string | Image;
};
