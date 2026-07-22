// Public API of the messages feature — import from "@/features/messages" only.
// Prefer deep imports from app/ (RSC) and for api helpers used by creator UI
// to avoid pulling the full client messages barrel into Server Components.
// Example: `@/features/messages/components/inboxContainer`,
// `@/features/messages/api/conversationsApi`.

// Types
export type { Conversation, Message, MessagePartnership } from "./types";

// API
export { findConversationWithUser } from "./api/conversationsApi";

// Hooks
export { useConversations } from "./hooks/useConversations";
export { useConversationMessages } from "./hooks/useConversationMessages";
export { useSendMessage } from "./hooks/useSendMessage";
export { useSocket } from "./hooks/useSocket";

// Components
export { default as InboxContainer } from "./components/inboxContainer";
export { default as ConversationContainer } from "./components/conversationContainer";
export { default as ConversationsList } from "./components/conversationsList";
export { default as ConversationCard } from "./components/conversationCard";
export { default as MessagesList } from "./components/messagesList";
export { default as MessageBubble } from "./components/message";
export { default as MessageInput } from "./components/messageInput";
export { default as PartnershipMessage } from "./components/partnershipMessage";
export {
  ConversationCardSkeleton,
  ConversationViewSkeleton,
} from "./components/skeletons";
