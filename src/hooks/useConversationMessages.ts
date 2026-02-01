import { useState, useEffect, useCallback, useRef } from "react";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";
import { useSocket } from "./useSocket";
import axios from "axios";
import { Message } from "@/components/messages/Message/Message";

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
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/messages/conversation/${conversationId}`,
        {
          withCredentials: true,
        }
      );

      if (response.data && response.data.data) {
        if (response.data.data.messages) {
          setMessages(response.data.data.messages);
        } else {
          setMessages([]);
        }
      } else {
        setMessages([]);
        showErrorRef.current("Invalid response from server");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Erreur lors du chargement des messages";
      setMessages([]);
      if (axios.isAxiosError(err) && err.response?.status !== 401) {
        showErrorRef.current(errorMessage);
      }
    }
  }, [conversationId]);

  useEffect(() => {
    if (!socket || !conversationId) return;

    socket.emit("join_conversation", conversationId);

    const handleNewMessage = (newMessage: Message) => {
      setMessages((prev) => {
        const messageExists = prev.some((msg) => msg._id === newMessage._id);
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
