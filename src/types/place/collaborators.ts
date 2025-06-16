export type Collaborator = {
  _id: string;
  username: string;
  image: string;
};

export type CreatedCollaborator = {
  name: string;
  categoryId: string;
  id: string;
};

export type CreatedCollaboratorDB = {
  name: string;
  category: string;
  categoryId: string;
  _id: string;
};
