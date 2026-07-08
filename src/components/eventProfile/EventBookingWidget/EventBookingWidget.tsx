"use client";

import React, { useMemo, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Minus, Plus, Ticket } from "lucide-react";
import Button from "@/components/common/buttons/Button";
import BaseModal from "@/components/common/modals/BaseModal";
import LoadingSpinner from "@/components/common/loading/LoadingSpinner";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useMyBookingForEvent } from "@/hooks/useMyBookingForEvent";
import { useCreateEventBooking } from "@/hooks/useCreateEventBooking";
import { useUpdateEventBooking } from "@/hooks/useUpdateEventBooking";
import { useCancelEventBooking } from "@/hooks/useCancelEventBooking";
import { EventPopulated } from "@/types/place/event";
import styles from "./EventBookingWidget.module.scss";

export interface EventBookingWidgetProps {
  event: EventPopulated;
}

const SeatsStepper: React.FC<{
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}> = ({ value, min, max, onChange, disabled = false }) => {
  return (
    <div className={styles.seatsStepper}>
      <button
        type="button"
        className={styles.stepperButton}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        aria-label="Retirer une place"
      >
        <Minus size={16} />
      </button>
      <span className={styles.seatsValue}>{value}</span>
      <button
        type="button"
        className={styles.stepperButton}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        aria-label="Ajouter une place"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

const EventBookingWidget: React.FC<EventBookingWidgetProps> = ({ event }) => {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const isAuthenticated = !!user;
  const {
    booking,
    isLoading: isBookingLoading,
    refetch: refetchBooking,
  } = useMyBookingForEvent(event._id, isAuthenticated);
  const { createEventBooking, isLoading: isCreating } =
    useCreateEventBooking();
  const { updateEventBooking, isLoading: isUpdating } =
    useUpdateEventBooking();
  const { cancelEventBooking, isLoading: isCancelling } =
    useCancelEventBooking();

  const [remainingSeats, setRemainingSeats] = useState(
    event.remainingSeats ?? null
  );
  const [seats, setSeats] = useState(1);
  const [editSeats, setEditSeats] = useState<number | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const eventOwnerId =
    typeof event.user === "object" && event.user ? event.user._id : event.user;
  const isOrganizer = !!user && eventOwnerId === user._id;
  const maxSeatsPerBooking = event.maxSeatsPerBooking || 1;
  const isFull = remainingSeats !== null && remainingSeats <= 0;
  const hasEventStarted = event.lifecycleStatus !== "upcoming";

  const maxSelectable = useMemo(() => {
    if (remainingSeats === null) return maxSeatsPerBooking;
    return Math.max(1, Math.min(maxSeatsPerBooking, remainingSeats));
  }, [remainingSeats, maxSeatsPerBooking]);

  const maxEditable = useMemo(() => {
    if (remainingSeats === null || !booking) return maxSeatsPerBooking;
    return Math.max(
      booking.seats,
      Math.min(maxSeatsPerBooking, remainingSeats + booking.seats)
    );
  }, [remainingSeats, maxSeatsPerBooking, booking]);

  const refreshRemainingSeats = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/events/${event._id}`
      );
      const updatedEvent = response.data?.data;
      if (updatedEvent && typeof updatedEvent.remainingSeats !== "undefined") {
        setRemainingSeats(updatedEvent.remainingSeats);
      }
    } catch {
      // Garder la valeur affichée précédemment en cas d'échec du rafraîchissement.
    }
  };

  const handleCreateBooking = async () => {
    await createEventBooking(event._id, seats);
    await Promise.all([refetchBooking(), refreshRemainingSeats()]);
    setSeats(1);
  };

  const handleUpdateBooking = async () => {
    if (!booking || editSeats === null) return;
    await updateEventBooking(booking._id, editSeats);
    await Promise.all([refetchBooking(), refreshRemainingSeats()]);
    setEditSeats(null);
  };

  const handleCancelBooking = async () => {
    if (!booking) return;
    await cancelEventBooking(booking._id);
    setIsCancelModalOpen(false);
    await Promise.all([refetchBooking(), refreshRemainingSeats()]);
  };

  if (isOrganizer) {
    return (
      <section className={styles.bookingWidget}>
        <h3 className={styles.sectionTitle}>Réservations</h3>
        <p className={styles.helperText}>
          Vous êtes l&apos;organisateur de cet évènement. Retrouvez la liste
          des réservations dans la page de modification de l&apos;évènement.
        </p>
        <Link
          href={`/account/events/${event._id}`}
          className={styles.manageLink}
        >
          Gérer les réservations
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
        <h3 className={styles.sectionTitle}>Réservations</h3>
        <p className={styles.helperText}>
          Connectez-vous pour réserver votre place à cet évènement.
        </p>
        <Link href="/auth/signin" className={styles.manageLink}>
          Se connecter
        </Link>
      </section>
    );
  }

  return (
    <section className={styles.bookingWidget}>
      <h3 className={styles.sectionTitle}>Réservations</h3>

      {isBookingLoading ? (
        <LoadingSpinner size={24} />
      ) : booking ? (
        <div className={styles.bookingSummary}>
          <p className={styles.helperText}>
            Vous avez réservé{" "}
            <strong>
              {booking.seats} place{booking.seats > 1 ? "s" : ""}
            </strong>{" "}
            pour cet évènement.
          </p>
          {hasEventStarted ? (
            <p className={styles.helperText}>
              Cet évènement a déjà commencé ou est terminé, votre réservation
              ne peut plus être modifiée ni annulée.
            </p>
          ) : editSeats === null ? (
            <div className={styles.actionsRow}>
              <Button
                type="button"
                variant="outline"
                size="small"
                onClick={() => setEditSeats(booking.seats)}
              >
                Modifier
              </Button>
              <Button
                type="button"
                variant="danger"
                size="small"
                onClick={() => setIsCancelModalOpen(true)}
              >
                Annuler ma réservation
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
                  Annuler
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="small"
                  onClick={handleUpdateBooking}
                  disabled={isUpdating || editSeats === booking.seats}
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : hasEventStarted ? (
        <p className={styles.helperText}>
          Cet évènement a déjà commencé ou est terminé, les réservations sont
          fermées.
        </p>
      ) : isFull ? (
        <p className={styles.helperText}>
          Cet évènement est complet, il ne reste plus de places disponibles.
        </p>
      ) : (
        <div className={styles.bookingForm}>
          <p className={styles.helperText}>
            {remainingSeats !== null
              ? `${remainingSeats} place(s) restante(s).`
              : "Places illimitées."}{" "}
            Vous pouvez réserver jusqu&apos;à {maxSeatsPerBooking} place
            {maxSeatsPerBooking > 1 ? "s" : ""}.
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
              Réserver
            </Button>
          </div>
        </div>
      )}

      <BaseModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Annuler la réservation ?"
        primaryButtonLabel="Annuler ma réservation"
        secondaryButtonLabel="Retour"
        onPrimaryAction={handleCancelBooking}
        primaryButtonType="button"
        isSubmitLoading={isCancelling}
        withLoadingState={false}
      >
        <p>
          Votre réservation pour cet évènement sera définitivement annulée.
        </p>
      </BaseModal>
    </section>
  );
};

export default EventBookingWidget;
