"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import PartnershipCard from "@/features/partnerships/components/partnershipCard";
import Button from "@/shared/ui/buttons/button";
import BaseModal from "@/shared/ui/modals/baseModal";
import { EventBookingWithUser } from "../../types/eventBooking";
import { useUpdateEventBooking } from "../../hooks/useUpdateEventBooking";
import { useCancelEventBooking } from "../../hooks/useCancelEventBooking";
import styles from "./EventBookingsManageTab.module.scss";

interface EventBookingsManageListProps {
  eventBookings: EventBookingWithUser[];
  maxSeatsPerBooking: number;
  hasEventStarted?: boolean;
  onChange?: () => void;
}

export default function EventBookingsManageList({
  eventBookings,
  maxSeatsPerBooking,
  hasEventStarted = false,
  onChange,
}: EventBookingsManageListProps) {
  const { t } = useTranslation("events");
  const { updateEventBooking, isLoading: isUpdating } =
    useUpdateEventBooking();
  const { cancelEventBooking, isLoading: isCancelling } =
    useCancelEventBooking();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSeats, setEditSeats] = useState(1);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const startEditing = (booking: EventBookingWithUser) => {
    setEditingId(booking.id);
    setEditSeats(booking.seats);
  };

  const handleSave = async (booking: EventBookingWithUser) => {
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
    <ul className={styles.items}>
      {eventBookings.map((booking) => {
        const isEditing = editingId === booking.id;
        return (
          <li key={booking.id} className={styles.item}>
            <PartnershipCard user={booking.user} />
            <div className={styles.bottomRow}>
              <p className={styles.seatsInfo}>
                {t("eventBookingsManageList.seatsBooked", {
                  count: booking.seats,
                })}
              </p>
              {hasEventStarted ? (
                <p className={styles.lockedInfo}>
                  {t("eventBookingsManageList.lockedMessage")}
                </p>
              ) : isEditing ? (
                <div className={styles.editRow}>
                  <div className={styles.seatsStepper}>
                    <button
                      type="button"
                      className={styles.stepperButton}
                      onClick={() =>
                        setEditSeats((prev) => Math.max(1, prev - 1))
                      }
                      disabled={isUpdating || editSeats <= 1}
                      aria-label={t("seatsStepper.removeSeat")}
                    >
                      <Minus size={16} />
                    </button>
                    <span className={styles.seatsValue}>{editSeats}</span>
                    <button
                      type="button"
                      className={styles.stepperButton}
                      onClick={() =>
                        setEditSeats((prev) =>
                          Math.min(maxSeatsPerBooking, prev + 1)
                        )
                      }
                      disabled={isUpdating || editSeats >= maxSeatsPerBooking}
                      aria-label={t("seatsStepper.addSeat")}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    onClick={() => setEditingId(null)}
                    disabled={isUpdating}
                  >
                    {t("common:actions.cancel")}
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="small"
                    onClick={() => handleSave(booking)}
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
                    onClick={() => startEditing(booking)}
                    ariaLabel={t("eventBookingsManageList.editSeatsAriaLabel")}
                  >
                    {t("eventBookingsManageList.editSeats")}
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => setCancellingId(booking.id)}
                    ariaLabel={t(
                      "eventBookingsManageList.cancelBookingAriaLabel"
                    )}
                  >
                    {t("common:actions.cancel")}
                  </Button>
                </div>
              )}
            </div>

            <BaseModal
              isOpen={cancellingId === booking.id}
              onClose={() => setCancellingId(null)}
              title={t("eventBookingsManageList.cancelModalTitle")}
              primaryButtonLabel={t("eventBookingsManageList.cancelModalPrimary")}
              secondaryButtonLabel={t("common:actions.back")}
              onPrimaryAction={() => handleCancel(booking.id)}
              primaryButtonType="button"
              isSubmitLoading={isCancelling}
              withLoadingState={false}
            >
              <p>
                {t("eventBookingsManageList.cancelModalBody", {
                  username:
                    booking.user.username ??
                    t("eventBookingsManageList.defaultUser"),
                })}
              </p>
            </BaseModal>
          </li>
        );
      })}
    </ul>
  );
}
