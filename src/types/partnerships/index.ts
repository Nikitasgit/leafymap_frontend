export interface Partnership {
  _id: string;
  place?: string;
  collaborator: {
    _id: string;
    name?: string;
    image?: string;
    categories?: string[];
  };
  status: "pending" | "accepted" | "refused";
  type?: "place" | "event";
  deleted?: boolean;
}
