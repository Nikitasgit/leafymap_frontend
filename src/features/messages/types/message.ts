export interface MessagePartnership {
  type?: "place";
  place?: { location?: { label?: string } };
}

export interface Message {
  id: string;
  sender: {
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
  };
  content?: string;
  createdAt: Date | string;
  readBy: string[];
  partnership?: MessagePartnership | string;
}
