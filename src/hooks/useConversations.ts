import { useState, useEffect, useCallback, useRef } from "react";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import axios from "axios";

export interface Conversation {
  _id: string;
  participants: {
    _id: string;
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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversations`,
        {
          withCredentials: true,
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
      if (axios.isAxiosError(err) && err.response?.status !== 401) {
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
