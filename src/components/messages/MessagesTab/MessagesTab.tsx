import ConversationsList from "@/components/messages/ConversationsList";
import styles from "./MessagesTab.module.scss";

export default function MessagesTab() {
  return (
    <div className={styles.messagesTab}>
      <ConversationsList />
    </div>
  );
}
