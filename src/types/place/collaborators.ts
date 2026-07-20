import { Image } from "../image";

export type Collaborator = {
  id: string;
  name?: string;
  image?: string | Image;
};
