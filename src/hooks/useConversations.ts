import { useState, useEffect, useCallback, useRef } from "react";
import { apiClient, isAxiosError } from "@/lib/api/client";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

export interface Conversation {
  id: string;
  participants: {
    id: string;
    username?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    image?: {
      urls: {
        thumbnail: string;
        medium: string;
      };
    };
  }[];
  lastMessage: {
    content?: string;
    partnership?: string | {
      type?: "place" | "event";
    };
    createdAt: Date | string;
  };
  unreadCount: number;
  updatedAt: Date | string;
}

export const useConversations = (options?: { autoFetch?: boolean }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const { isLoading, withLoading } = useLoading(true);
  const { showError } = useToast();
  const showErrorRef = useRef(showError);

  // Keep ref updated
  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  const fetchConversations = useCallback(async () => {
    try {
      const response = await apiClient.get(
        `/api/messages/conversations`,
        {
        }
      );

      if (response.data && response.data.data) {
        setConversations(response.data.data);
      } else {
        setConversations([]);
        showErrorRef.current("Invalid response from server");
      }
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
