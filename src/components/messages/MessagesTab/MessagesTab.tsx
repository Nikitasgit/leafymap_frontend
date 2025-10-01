import { Mail } from "lucide-react";
import EmptyState from "@/components/common/noResults/EmptyStatetempname";
import styles from "./MessagesTab.module.scss";

export default function MessagesTab() {
  return (
    <div className={styles.messagesTab}>
      <EmptyState
        title="Cette fonctionnalité n'est pas encore disponible"
        description="Votre messagerie directes apparaîtront ici. Cette fonctionnalité est en cours de développement!"
        icon={<Mail size={64} />}
      />
    </div>
  );
}
