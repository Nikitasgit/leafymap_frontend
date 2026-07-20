"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EventCard from "@/components/common/events/EventCard";
import Button from "@/components/common/buttons/Button";
import BaseModal from "@/components/common/modals/BaseModal";
import SeatsStepper from "@/components/eventProfile/SeatsStepper";
import { MyEventBooking } from "@/types/eventBooking";
import { EventPopulated } from "@/types/place/event";
import { useUpdateEventBooking } from "@/hooks/useUpdateEventBooking";
import { useCancelEventBooking } from "@/hooks/useCancelEventBooking";
import { useBookingLimits } from "@/hooks/useBookingLimits";
import styles from "./MyEventBookingsList.module.scss";

interface MyEventBookingsListProps {
  eventBookings: MyEventBooking[];
  onChange?: () => void;
}

export default function MyEventBookingsList({
  eventBookings,
  onChange,
}: MyEventBookingsListProps) {
  const { updateEventBooking, isLoading: isUpdating } =
    useUpdateEventBooking();
  const { cancelEventBooking, isLoading: isCancelling } =
    useCancelEventBooking();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSeats, setEditSeats] = useState(1);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  if (eventBookings.length === 0) {
    return null;
  }

  const startEditing = (booking: MyEventBooking) => {
    setEditingId(booking.id);
    setEditSeats(booking.seats);
  };

  const handleSave = async (booking: MyEventBooking) => {
    if (editSeats === booking.seats) {
      setEditingId(null);
      return;
    }
    await updateEventBooking(booking.id, editSeats);
    setEditingId(null);
    onChange?.();
  };

  const handleCancel = async (bookingId: string) => {
    await cancelEventBooking(bookingId);
    setCancellingId(null);
    onChange?.();
  };

  return (
    <div className={styles.list}>
      <ul className={styles.items}>
        {eventBookings.map((booking) => {
          if (!booking.event || !booking.event.id) return null;
          const event = booking.event as unknown as EventPopulated;
          const maxSeats = event.maxSeatsPerBooking || 1;
          const remainingSeats = event.remainingSeats ?? null;
          const isEditing = editingId === booking.id;

          return (
            <BookingListItem
              key={booking.id}
              booking={booking}
              event={event}
              maxSeats={maxSeats}
              remainingSeats={remainingSeats}
              isEditing={isEditing}
              editSeats={editSeats}
              isUpdating={isUpdating}
              isCancelling={isCancelling}
              cancellingId={cancellingId}
              onStartEditing={() => startEditing(booking)}
              onEditSeatsChange={setEditSeats}
              onCancelEditing={() => setEditingId(null)}
              onSave={() => handleSave(booking)}
              onOpenCancelModal={() => setCancellingId(booking.id)}
              onCloseCancelModal={() => setCancellingId(null)}
              onConfirmCancel={() => handleCancel(booking.id)}
            />
          );
        })}
      </ul>
    </div>
  );
}

interface BookingListItemProps {
  booking: MyEventBooking;
  event: EventPopulated;
  maxSeats: number;
  remainingSeats: number | null;
  isEditing: boolean;
  editSeats: number;
  isUpdating: boolean;
  isCancelling: boolean;
  cancellingId: string | null;
  onStartEditing: () => void;
  onEditSeatsChange: (value: number) => void;
  onCancelEditing: () => void;
  onSave: () => void;
  onOpenCancelModal: () => void;
  onCloseCancelModal: () => void;
  onConfirmCancel: () => void;
}

function BookingListItem({
  booking,
  event,
  maxSeats,
  remainingSeats,
  isEditing,
  editSeats,
  isUpdating,
  isCancelling,
  cancellingId,
  onStartEditing,
  onEditSeatsChange,
  onCancelEditing,
  onSave,
  onOpenCancelModal,
  onCloseCancelModal,
  onConfirmCancel,
}: BookingListItemProps) {
  const { t } = useTranslation("events");
  const { maxEditable, canEdit, lockedMessage } = useBookingLimits({
    maxSeatsPerBooking: maxSeats,
    remainingSeats,
    currentBookingSeats: booking.seats,
    lifecycleStatus: event.lifecycleStatus,
  });

  return (
    <li className={styles.item}>
      <EventCard event={event} clickable={!!event.id} />
      <div className={styles.bottomRow}>
        <p className={styles.seatsInfo}>
          {t("myEventBookingsList.seatsBooked", { count: booking.seats })}
        </p>
        {!canEdit ? (
          <p className={styles.lockedInfo}>{lockedMessage}</p>
        ) : isEditing ? (
          <div className={styles.editRow}>
            <SeatsStepper
              value={editSeats}
              min={1}
              max={maxEditable}
              onChange={onEditSeatsChange}
              disabled={isUpdating}
            />
            <Button
              type="button"
              variant="secondary"
              size="small"
              onClick={onCancelEditing}
              disabled={isUpdating}
            >
              {t("common:actions.cancel")}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="small"
              onClick={onSave}
              disabled={isUpdating}
            >
              {t("common:actions.save")}
            </Button>
          </div>
        ) : (
          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              size="small"
              onClick={onStartEditing}
              ariaLabel={t("myEventBookingsList.editBookingAriaLabel")}
            >
              {t("common:actions.edit")}
            </Button>
            <Button
              type="button"
              variant="danger"
              size="small"
              onClick={onOpenCancelModal}
              ariaLabel={t("myEventBookingsList.cancelBookingAriaLabel")}
            >
              {t("common:actions.cancel")}
            </Button>
          </div>
        )}
      </div>

      <BaseModal
        isOpen={cancellingId === booking.id}
        onClose={onCloseCancelModal}
        title={t("myEventBookingsList.cancelModalTitle")}
        primaryButtonLabel={t("myEventBookingsList.cancelModalPrimary")}
        secondaryButtonLabel={t("common:actions.back")}
        onPrimaryAction={onConfirmCancel}
        primaryButtonType="button"
        isSubmitLoading={isCancelling}
        withLoadingState={false}
      >
        <p>
          {t("myEventBookingsList.cancelModalBody", {
            eventName: event.name,
          })}
        </p>
      </BaseModal>
    </li>
  );
}
