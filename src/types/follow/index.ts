import { BaseEntity } from "../common";

export interface FollowUser {
  _id: string;
  followId?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  image?: {
    urls: {
      thumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
      original?: string;
    };
  };
  userType: "creator" | "guest";
}

export interface Follow extends BaseEntity {
  follower: string;
  following: string;
}

export interface CreateFollowInput {
  followingId: string;
}
