import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./useAuth";

export const useSocket = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const nextSocket = io(process.env.NEXT_PUBLIC_API_URL || "", {
      transports: ["websocket", "polling"],
    });

    nextSocket.on("connect", () => {
      setSocket(nextSocket);
      setIsConnected(true);
    });

    nextSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    nextSocket.on("connect_error", (error) => {
      console.error("Socket.io connection error:", error);
      setIsConnected(false);
    });

    return () => {
      nextSocket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [user]);

  return { socket, isConnected };
};
