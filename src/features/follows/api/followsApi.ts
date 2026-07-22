import { request } from "@/shared/api/client";
import type { FollowUser } from "../types";

export type FollowRecord = {
  id: string;
};

export type FollowCheckResult = FollowRecord | null;

export const createFollow = async (
  followingId: string,
): Promise<FollowRecord> => {
  return request<FollowRecord>({
    method: "POST",
    url: `/api/follows`,
    data: { followingId },
  });
};

export const deleteFollow = async (followId: string): Promise<void> => {
  await request<void>({ method: "DELETE", url: `/api/follows/${followId}` });
};

export const checkFollowStatus = async (
  follower: string,
  following: string,
): Promise<FollowCheckResult> => {
  const data = await request<{ follow?: FollowCheckResult }>({
    method: "GET",
    url: `/api/follows/check`,
    params: { follower, following },
  });
  return data?.follow ?? null;
};

export const fetchFollowers = async (
  userId: string,
): Promise<FollowUser[]> => {
  const data = await request<{ followers?: FollowUser[] }>({
    method: "GET",
    url: `/api/follows/followers/${userId}`,
  });
  return data?.followers || [];
};

export const fetchFollowing = async (
  userId: string,
): Promise<FollowUser[]> => {
  const data = await request<{ following?: FollowUser[] }>({
    method: "GET",
    url: `/api/follows/following/${userId}`,
  });
  return data?.following || [];
};
