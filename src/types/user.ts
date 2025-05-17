interface User {
  email: string;
  name: string;
  role?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type { User };
