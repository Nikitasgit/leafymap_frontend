"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import PartnershipCard from "@/components/common/partnerships/PartnershipCard";
import Button from "@/components/common/buttons/Button";
import BaseModal from "@/components/common/modals/BaseModal";
import { EventBookingWithUser } from "@/types/eventBooking";
import { useUpdateEventBooking } from "@/hooks/useUpdateEventBooking";
import { useCancelEventBooking } from "@/hooks/useCancelEventBooking";
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
  const { updateEventBooking, isLoading: isUpdating } =
    useUpdateEventBooking();
  const { cancelEventBooking, isLoading: isCancelling } =
    useCancelEventBooking();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSeats, setEditSeats] = useState(1);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const startEditing = (booking: EventBookingWithUser) => {
    setEditingId(booking._id);
    setEditSeats(booking.seats);
  };

  const handleSave = async (booking: EventBookingWithUser) => {
    if (editSeats === booking.seats) {
      setEditingId(null);
      return;
    }
    await updateEventBooking(booking._id, editSeats);
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
        const isEditing = editingId === booking._id;
        return (
          <li key={booking._id} className={styles.item}>
            <PartnershipCard user={booking.user} />
            <div className={styles.bottomRow}>
              <p className={styles.seatsInfo}>
                {booking.seats} place{booking.seats > 1 ? "s" : ""} réservée
                {booking.seats > 1 ? "s" : ""}
              </p>
              {hasEventStarted ? (
                <p className={styles.lockedInfo}>
                  Cet évènement a déjà commencé ou est terminé, cette
                  réservation ne peut plus être modifiée ni annulée.
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
                      aria-label="Retirer une place"
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
                      aria-label="Ajouter une place"
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
                    Annuler
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="small"
                    onClick={() => handleSave(booking)}
                    disabled={isUpdating}
                  >
                    Enregistrer
                  </Button>
                </div>
              ) : (
                <div className={styles.actions}>
                  <Button
                    type="button"
                    variant="outline"
                    size="small"
                    onClick={() => startEditing(booking)}
                    ariaLabel="Modifier les places réservées"
                  >
                    Modifier les places
                  </Button>
                  <Button
                    type="button"
                    variant="danger"
                    size="small"
                    onClick={() => setCancellingId(booking._id)}
                    ariaLabel="Annuler la réservation"
                  >
                    Annuler
                  </Button>
                </div>
              )}
            </div>

            <BaseModal
              isOpen={cancellingId === booking._id}
              onClose={() => setCancellingId(null)}
              title="Annuler cette réservation ?"
              primaryButtonLabel="Annuler la réservation"
              secondaryButtonLabel="Retour"
              onPrimaryAction={() => handleCancel(booking._id)}
              primaryButtonType="button"
              isSubmitLoading={isCancelling}
              withLoadingState={false}
            >
              <p>
                {booking.user.username ?? "Cet utilisateur"} sera notifié de
                l&apos;annulation de sa réservation.
              </p>
            </BaseModal>
          </li>
        );
      })}
    </ul>
  );
}
