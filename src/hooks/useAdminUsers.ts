"use client";

import { useCallback, useEffect, useState } from "react";
import { User } from "@/types/user";
import {
  AdminUserContent,
  banAdminUser,
  getAdminUser,
  getAdminUserContent,
  restoreAdminResource,
  restoreAdminUser,
  searchAdminUsers,
  softDeleteAdminResource,
  softDeleteAdminUser,
  unbanAdminUser,
  AdminResource,
} from "@/lib/api/admin";

export const useAdminUserSearch = (email: string) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const search = email.trim();
    if (!search) {
      setUsers([]);
      return;
    }

    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        setUsers(await searchAdminUsers(search));
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [email]);

  return { users, isLoading };
};

export const useAdminUserDetail = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [content, setContent] = useState<AdminUserContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const [userResult, contentResult] = await Promise.all([
        getAdminUser(userId),
        getAdminUserContent(userId),
      ]);
      setUser(userResult);
      setContent(contentResult);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { user, content, isLoading, refetch };
};

export const useAdminUserActions = (userId: string, onDone: () => void) => {
  const ban = async (reason: string, duration?: number) => {
    await banAdminUser(userId, { reason, duration });
    onDone();
  };

  const unban = async () => {
    await unbanAdminUser(userId);
    onDone();
  };

  const softDeleteUser = async () => {
    await softDeleteAdminUser(userId);
    onDone();
  };

  const restoreUser = async () => {
    await restoreAdminUser(userId);
    onDone();
  };

  return { ban, unban, softDeleteUser, restoreUser };
};

export const useAdminResourceActions = (onDone: () => void) => {
  const softDelete = async (
    resource: AdminResource,
    resourceId: string,
    reason?: string
  ) => {
    await softDeleteAdminResource(resource, resourceId, reason);
    onDone();
  };

  const restore = async (resource: AdminResource, resourceId: string) => {
    await restoreAdminResource(resource, resourceId);
    onDone();
  };

  return { softDelete, restore };
};
