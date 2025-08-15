"use client";

import { useParams, useRouter } from "next/navigation";
import Button from "@/components/common/buttons/button/Button";
import { usePlaceEvents } from "@/hooks/usePlaceEvents";
import Image from "next/image";

export default function EventsListPage() {
  const params = useParams();
  const router = useRouter();
  const { events, loading } = usePlaceEvents(params.placeId as string);
  console.log(events);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h1>Événements</h1>
        <Button
          onClick={() =>
            router.push(`/account/places/${params.placeId}/events/create`)
          }
        >
          Ajouter un événement
        </Button>
      </div>

      {events?.length === 0 ? (
        <p>Aucun événement trouvé</p>
      ) : (
        <div>
          {events?.map((event) => (
            <div key={event._id}>
              <h2>{event.name}</h2>
              <p>{event.description}</p>
              <Image
                src={event.image || "/images/default-event.png"}
                alt={event.name}
                width={100}
                height={100}
              />
              <div className="collaborators">
                {event.collaborators.map((collaborator) => (
                  <div key={collaborator._id}>
                    <p>{collaborator.name}</p>
                    <Image
                      key={collaborator._id}
                      src={collaborator.image || "/images/default-avatar.png"}
                      alt={collaborator.name || ""}
                      width={30}
                      height={30}
                    />
                  </div>
                ))}
              </div>
              <Button
                onClick={() =>
                  router.push(
                    `/account/places/${params.placeId}/events/${event._id}`
                  )
                }
              >
                Modifier
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
