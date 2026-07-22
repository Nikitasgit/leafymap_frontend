"use client";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser, selectAuth } from "../model/authSlice";
import { AppDispatch } from "@/store";
import { UserPopulated } from "@/features/users/types";

export const useCurrentUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector(selectAuth);

  const refetch = useCallback(async () => {
    await dispatch(fetchCurrentUser()).unwrap();
  }, [dispatch]);

  return {
    user: user as UserPopulated | null,
    isLoading: loading,
    refetch,
  };
};
