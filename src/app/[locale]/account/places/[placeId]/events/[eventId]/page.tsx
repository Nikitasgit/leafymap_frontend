"use client";
import EventForm from "@/components/events/form/EventForm/EventForm";
import { useEvent } from "@/hooks/useEvent";
import { useParams } from "next/navigation";
import React from "react";

const UpdateEventPage = () => {
  const { eventId } = useParams();
  const { event, loading: eventLoading } = useEvent(eventId as string);
  if (eventLoading) return <div>Loading...</div>;
  if (!event) return <div>Event not found</div>;

  return <EventForm data={event} isUpdate={true} />;
};

export default UpdateEventPage;
