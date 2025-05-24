interface User {
  _id: string;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  userType: "creator" | "organizer" | "guest";
  createdAt?: Date;
  updatedAt?: Date;
  image?: string;
}

export type { User };
