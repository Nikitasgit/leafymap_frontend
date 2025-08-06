export type Collaborator = {
  _id: string;
  name?: string;
  image?: string;
  status?: "pending" | "accepted" | "refused";
};

export type CreatedCollaborator = {
  name: string;
  category: string;
  _id?: string;
};
