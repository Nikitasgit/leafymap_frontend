import { useState, useEffect, useCallback, useRef } from "react";
import { isAxiosError } from "@/shared/api/client";
import { useLoading } from "@/shared/hooks/useLoading";
import { useToast } from "@/shared/hooks/useToast";
import { fetchConversations as fetchConversationsRequest } from "../api/conversationsApi";
import type { Conversation } from "../types";

export const useConversations = (options?: { autoFetch?: boolean }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const showErrorRef = useRef(showError);

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  const fetchConversations = useCallback(async () => {
    try {
      const data = await fetchConversationsRequest();
      setConversations(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des conversations";
      setConversations([]);
      if (isAxiosError(err) && err.response?.status !== 401) {
        showErrorRef.current(errorMessage);
      }
    }
  }, []);

  useEffect(() => {
    if (options?.autoFetch !== false) {
      withLoading(fetchConversations);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = useCallback(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, isLoading, refetch };
};
