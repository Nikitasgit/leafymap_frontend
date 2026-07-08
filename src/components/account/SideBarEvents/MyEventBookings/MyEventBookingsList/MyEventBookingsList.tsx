"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import EventCard from "@/components/common/events/EventCard";
import Button from "@/components/common/buttons/Button";
import BaseModal from "@/components/common/modals/BaseModal";
import { MyEventBooking } from "@/types/eventBooking";
import { EventPopulated } from "@/types/place/event";
import { useUpdateEventBooking } from "@/hooks/useUpdateEventBooking";
import { useCancelEventBooking } from "@/hooks/useCancelEventBooking";
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
    setEditingId(booking._id);
    setEditSeats(booking.seats);
  };

  const handleSave = async (booking: MyEventBooking) => {
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
    <div className={styles.list}>
      <ul className={styles.items}>
        {eventBookings.map((booking) => {
          if (!booking.event || !booking.event._id) return null;
          const event = booking.event as unknown as EventPopulated;
          const maxSeats = event.maxSeatsPerBooking || 1;
          const remainingSeats = event.remainingSeats ?? null;
          const maxEditable =
            remainingSeats === null
              ? maxSeats
              : Math.max(
                  booking.seats,
                  Math.min(maxSeats, remainingSeats + booking.seats)
                );
          const isEditing = editingId === booking._id;
          const hasEventStarted = event.lifecycleStatus !== "upcoming";

          return (
            <li key={booking._id} className={styles.item}>
              <EventCard event={event} clickable={!!event._id} />
              <div className={styles.bottomRow}>
                <p className={styles.seatsInfo}>
                  {booking.seats} place{booking.seats > 1 ? "s" : ""}{" "}
                  réservée{booking.seats > 1 ? "s" : ""}
                </p>
                {hasEventStarted ? (
                  <p className={styles.lockedInfo}>
                    Cet évènement a déjà commencé ou est terminé, la
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
                            Math.min(maxEditable, prev + 1)
                          )
                        }
                        disabled={isUpdating || editSeats >= maxEditable}
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
                      ariaLabel="Modifier la réservation"
                    >
                      Modifier
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
                title="Annuler la réservation ?"
                primaryButtonLabel="Annuler ma réservation"
                secondaryButtonLabel="Retour"
                onPrimaryAction={() => handleCancel(booking._id)}
                primaryButtonType="button"
                isSubmitLoading={isCancelling}
                withLoadingState={false}
              >
                <p>
                  Votre réservation pour « {event.name} » sera définitivement
                  annulée.
                </p>
              </BaseModal>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
