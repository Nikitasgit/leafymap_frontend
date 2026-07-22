import { useState, useEffect, useCallback, useRef } from "react";
import { isAxiosError } from "@/shared/api/client";
import { useLoading } from "@/shared/hooks/useLoading";
import { useToast } from "@/shared/hooks/useToast";
import { useSocket } from "./useSocket";
import { fetchConversationMessages as fetchConversationMessagesRequest } from "../api/conversationsApi";
import type { Message } from "../types";

export const useConversationMessages = (
  conversationId: string | null,
  options?: { autoFetch?: boolean }
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { isLoading, withLoading, stopLoading } = useLoading(!!conversationId);
  const { showError } = useToast();
  const { socket } = useSocket();
  const showErrorRef = useRef(showError);

  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    try {
      const data = await fetchConversationMessagesRequest(conversationId);
      setMessages(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des messages";
      setMessages([]);
      if (isAxiosError(err) && err.response?.status !== 401) {
        showErrorRef.current(errorMessage);
      }
    }
  }, [conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("join_conversation", conversationId);

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => {
        const messageExists = prev.some((msg) => msg.id === newMessage.id);
        if (messageExists) {
          return prev;
        }
        return [...prev, newMessage];
      });
    };

    socket.on("new_message", handleNewMessage);

    return () => {
      socket.off("new_message", handleNewMessage);
      socket.emit("leave_conversation", conversationId);
    };
  }, [socket, conversationId]);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      stopLoading();
      return;
    }
    if (options?.autoFetch !== false) {
      withLoading(fetchMessages);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  const refetch = useCallback(() => {
    fetchMessages();
  }, [fetchMessages]);

  return { messages, isLoading, refetch };
};
