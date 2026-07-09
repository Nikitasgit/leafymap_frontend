"use client";

import React from "react";
import { Ticket } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMyEventBookings } from "@/hooks/useMyEventBookings";
import MyEventBookingsList from "../MyEventBookingsList";
import AccountTabShell from "@/components/account/AccountTabShell";

export default function MyEventBookingsTab() {
  const { t } = useTranslation("events");
  const { eventBookings, isLoading, refetch } = useMyEventBookings();

  return (
    <AccountTabShell
      icon={<Ticket size={20} />}
      title={t("myEventBookingsTab.title")}
      description={t("myEventBookingsTab.description")}
      isLoading={isLoading}
      isEmpty={eventBookings.length === 0}
      emptyTitle={t("myEventBookingsTab.emptyTitle")}
      emptyMessage={t("myEventBookingsTab.emptyMessage")}
    >
      <MyEventBookingsList eventBookings={eventBookings} onChange={refetch} />
    </AccountTabShell>
  );
}
