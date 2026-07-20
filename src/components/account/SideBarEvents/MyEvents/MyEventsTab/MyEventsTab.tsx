"use client";

import { useRouter } from "next/navigation";
import { Calendar, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserEvents } from "@/hooks/useUserEvents";
import EventsList from "@/components/account/AccountEventsList";
import Button from "@/components/common/buttons/Button";
import AccountTabShell from "@/components/account/AccountTabShell";
import styles from "./MyEventsTab.module.scss";

export default function MyEventsTab() {
  const { t } = useTranslation("events");
  const router = useRouter();
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const { events, isLoading: eventsLoading } = useUserEvents(user?.id ?? null);

  return (
    <AccountTabShell
      icon={<Calendar size={20} />}
      title={t("myEventsTab.title")}
      description={t("myEventsTab.description")}
      isLoading={isLoadingUser || eventsLoading}
    >
      <div className={styles.content}>
        <Button
          onClick={() => router.push("/account/events/create")}
          variant="outline"
          endIcon={<Plus size={16} />}
          className={styles.addEventButton}
          ariaLabel={t("myEventsTab.createEventAriaLabel")}
          fullWidth
        >
          {t("myEventsTab.createEvent")}
        </Button>
        <EventsList events={events || []} />
      </div>
    </AccountTabShell>
  );
}
