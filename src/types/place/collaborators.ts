export type Collaborator = {
  _id: string;
  name: string;
  image: string;
  status?: "pending" | "accepted" | "refused";
};

export type CreatedCollaborator = {
  name: string;
  categoryId: string;
  id?: string;
};

export type CreatedCollaboratorDB = {
  name: string;
  category: string;
  categoryId: string;
  _id: string;
};
