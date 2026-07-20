"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Ticket } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import Button from "@/components/common/buttons/Button";
import BaseModal from "@/components/common/modals/BaseModal";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";
import SeatsStepper from "@/components/eventProfile/SeatsStepper";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMyBookingForEvent } from "@/hooks/useMyBookingForEvent";
import { useCreateEventBooking } from "@/hooks/useCreateEventBooking";
import { useUpdateEventBooking } from "@/hooks/useUpdateEventBooking";
import { useCancelEventBooking } from "@/hooks/useCancelEventBooking";
import { useBookingLimits } from "@/hooks/useBookingLimits";
import { getEventCreatorId } from "@/lib/api/normalizers/resolveRef";
import { EventPopulated } from "@/types/place/event";
import styles from "./EventBookingWidget.module.scss";

export interface EventBookingWidgetProps {
  event: EventPopulated;
}

const EventBookingWidget: React.FC<EventBookingWidgetProps> = ({ event }) => {
  const { t } = useTranslation("events");
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const isAuthenticated = !!user;
  const {
    booking,
    isLoading: isBookingLoading,
    refetch: refetchBooking,
  } = useMyBookingForEvent(event.id, isAuthenticated);
  const { createEventBooking, isLoading: isCreating } =
    useCreateEventBooking();
  const { updateEventBooking, isLoading: isUpdating } =
    useUpdateEventBooking();
  const { cancelEventBooking, isLoading: isCancelling } =
    useCancelEventBooking();

  const [remainingSeats, setRemainingSeats] = useState(
    event.remainingSeats ?? null,
  );
  const [seats, setSeats] = useState(1);
  const [editSeats, setEditSeats] = useState<number | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const eventOwnerId = getEventCreatorId(event);
  const isOrganizer = !!user && eventOwnerId === user.id;
  const maxSeatsPerBooking = event.maxSeatsPerBooking || 1;

  const {
    maxSelectable,
    maxEditable,
    canEdit,
    isFull,
    lockedMessage,
    closedMessage,
    fullMessage,
  } = useBookingLimits({
    maxSeatsPerBooking,
    remainingSeats,
    currentBookingSeats: booking?.seats,
    lifecycleStatus: event.lifecycleStatus,
  });

  const refreshRemainingSeats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event.id}`,
      );
      const updatedEvent = response.data?.data;
      if (updatedEvent && typeof updatedEvent.remainingSeats !== "undefined") {
        setRemainingSeats(updatedEvent.remainingSeats);
      }
    } catch {
      // Keep the previously displayed value if refresh fails.
    }
  };

  const handleCreateBooking = async () => {
    await createEventBooking(event.id, seats);
    await Promise.all([refetchBooking(), refreshRemainingSeats()]);
    setSeats(1);
  };

  const handleUpdateBooking = async () => {
    if (!booking || editSeats === null) return;
    await updateEventBooking(booking.id, editSeats);
    await Promise.all([refetchBooking(), refreshRemainingSeats()]);
    setEditSeats(null);
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    await cancelEventBooking(booking.id);
    setIsCancelModalOpen(false);
    await Promise.all([refetchBooking(), refreshRemainingSeats()]);
  };

  if (isOrganizer) {
    return (
      <section className={styles.bookingWidget}>
        <h3 className={styles.sectionTitle}>{t("eventBookingWidget.title")}</h3>
        <p className={styles.helperText}>
          {t("eventBookingWidget.organizerHelper")}
        </p>
        <Link
          href={`/account/events/${event.id}`}
          className={styles.manageLink}
        >
          {t("eventBookingWidget.manageBookings")}
        </Link>
      </section>
    );
  }

  if (isUserLoading) {
    return (
      <section className={styles.bookingWidget}>
        <LoadingSpinner size={24} />
      </section>
    );
  }

  if (!isAuthenticated) {
    return (
      <section className={styles.bookingWidget}>
        <h3 className={styles.sectionTitle}>{t("eventBookingWidget.title")}</h3>
        <p className={styles.helperText}>
          {t("eventBookingWidget.loginHelper")}
        </p>
        <Link href="/auth/signin" className={styles.manageLink}>
          {t("common:nav.signin")}
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.bookingWidget}>
      <h3 className={styles.sectionTitle}>{t("eventBookingWidget.title")}</h3>

      {isBookingLoading ? (
        <LoadingSpinner size={24} />
      ) : booking ? (
        <div className={styles.bookingSummary}>
          <p className={styles.helperText}>
            <Trans
              i18nKey="eventBookingWidget.bookedSeats"
              ns="events"
              count={booking.seats}
              components={{ strong: <strong /> }}
            />
          </p>
          {!canEdit ? (
            <p className={styles.helperText}>{lockedMessage}</p>
          ) : editSeats === null ? (
            <div className={styles.actionsRow}>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => setEditSeats(booking.seats)}
              >
                {t("common:actions.edit")}
              </Button>
              <Button
                type="button"
                variant="danger"
                size="small"
                onClick={() => setIsCancelModalOpen(true)}
              >
                {t("eventBookingWidget.cancelBooking")}
              </Button>
            </div>
          ) : (
            <div className={styles.editRow}>
              <SeatsStepper
                value={editSeats}
                min={1}
                max={maxEditable}
                onChange={setEditSeats}
                disabled={isUpdating}
              />
              <div className={styles.actionsRow}>
                <Button
                  type="button"
                  variant="secondary"
                  size="small"
                  onClick={() => setEditSeats(null)}
                  disabled={isUpdating}
                >
                  {t("common:actions.cancel")}
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="small"
                  onClick={handleUpdateBooking}
                  disabled={isUpdating || editSeats === booking.seats}
                >
                  {t("common:actions.save")}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : !canEdit ? (
        <p className={styles.helperText}>{closedMessage}</p>
      ) : isFull ? (
        <p className={styles.helperText}>{fullMessage}</p>
      ) : (
        <div className={styles.bookingForm}>
          <p className={styles.helperText}>
            {remainingSeats !== null
              ? t("eventBookingWidget.remainingSeats", {
                  count: remainingSeats,
                })
              : t("eventBookingWidget.unlimitedSeats")}{" "}
            {t("eventBookingWidget.maxSeats", {
              count: maxSeatsPerBooking,
            })}
          </p>
          <div className={styles.actionsRow}>
            <SeatsStepper
              value={seats}
              min={1}
              max={maxSelectable}
              onChange={setSeats}
              disabled={isCreating}
            />
            <Button
              type="button"
              variant="primary"
              startIcon={<Ticket size={16} />}
              onClick={handleCreateBooking}
              disabled={isCreating}
            >
              {t("eventBookingWidget.book")}
            </Button>
          </div>
        </div>
      )}

      <BaseModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title={t("eventBookingWidget.cancelModalTitle")}
        primaryButtonLabel={t("eventBookingWidget.cancelBooking")}
        secondaryButtonLabel={t("common:actions.back")}
        onPrimaryAction={handleCancelBooking}
        primaryButtonType="button"
        isSubmitLoading={isCancelling}
        withLoadingState={false}
      >
        <p>{t("eventBookingWidget.cancelModalBody")}</p>
      </BaseModal>
    </section>
  );
};

export default EventBookingWidget;
