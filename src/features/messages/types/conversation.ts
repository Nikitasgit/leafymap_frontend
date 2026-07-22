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
    partnership?:
      | string
      | {
          type?: "place" | "event";
        };
    createdAt: Date | string;
  };
  unreadCount: number;
  updatedAt: Date | string;
}
