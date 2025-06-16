import { BaseEntity } from "../common";
import { Collaborator, CreatedCollaborator } from "./collaborators";
import { Period } from "./schedule";

export interface Event extends BaseEntity {
  name: string;
  description: string;
  image: string;
  schedule: Period[];
  collaborators: Collaborator[];
  createdCollaborators: CreatedCollaborator[];
}
