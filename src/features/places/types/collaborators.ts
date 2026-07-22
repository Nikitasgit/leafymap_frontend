import { Image } from "@/shared/types/image";

export type Collaborator = {
  id: string;
  name?: string;
  image?: string | Image;
};
