"use client";
import Button from "@/components/common/buttons/Button";
import { Place } from "@/types/place";
import { useRouter } from "next/navigation";
import { Edit3, Trash2, Calendar, Plus } from "lucide-react";
import { getAccountEventsPath, EVENTS_TAB_IDS } from "@/utils/accountTabs";
import styles from "./AccountPlaceActions.module.scss";
import useDeletePlace from "@/hooks/useDeletePlace";

interface AccountPlaceActionsProps {
  place: Place;
}

export default function AccountPlaceActions({
  place,
}: AccountPlaceActionsProps) {
  const router = useRouter();
  const { deletePlace, isLoading: isDeletingPlace } = useDeletePlace();

  return (
    <section className={styles.actions}>
      <Button
        variant="secondary"
        onClick={() => router.push(`/account/places/${place._id}`)}
        fullWidth
        endIcon={<Edit3 size={16} />}
        ariaLabel="Modifier le lieu"
      >
        Modifier
      </Button>
      <Button
        variant="danger"
        onClick={() => deletePlace(place._id)}
        fullWidth
        disabled={isDeletingPlace}
        endIcon={<Trash2 size={16} />}
        ariaLabel="Supprimer le lieu"
      >
        Supprimer
      </Button>
      <Button
        variant="secondary"
        onClick={() => router.push(`/account/places/${place._id}/events/create`)}
        fullWidth
        endIcon={<Plus size={16} />}
        ariaLabel="Ajouter un événement"
      >
        Ajouter un événement
      </Button>
      <Button
        variant="secondary"
        onClick={() => router.push(getAccountEventsPath(EVENTS_TAB_IDS.MY_EVENTS))}
        fullWidth
        endIcon={<Calendar size={16} />}
        ariaLabel="Voir les événements"
      >
        Voir les événements
      </Button>
    </section>
  );
}

