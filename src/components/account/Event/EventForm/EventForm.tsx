"use client";
import { FormDataChangeHandler } from "@/components/account/CreateProfileStepper";
import TextField from "@/components/common/inputs/TextField";
import { useState, useEffect, useCallback, useRef } from "react";
import NewDatesEventForm from "../EventNewDatesSelector";
import Button from "@/components/common/buttons/Button";
import useSubmitEvent from "@/hooks/useSubmitEvent";
import { useRouter } from "next/navigation";
import {
  getAccountSidebarPath,
  SIDEBAR_VALUES,
  EVENTS_TAB_IDS,
} from "@/utils/accountTabs";
import styles from "./EventForm.module.scss";
import EventScheduleList from "../EventScheduleList";
import { format } from "date-fns";
import { useToast } from "@/hooks/useToast";
import { Partnership, PartnershipPopulated } from "@/types/partnerships";
import { useSubmitEventInvitations } from "@/hooks/useSubmitEventInvitations";
import { separateNewAndUpdatedArrayValues } from "@/utils/tempId";
import { validateEventData } from "@/validations/eventValidations";
import { useTranslation } from "react-i18next";
import { useEventSchedule } from "@/hooks/useEventSchedule";
import type { initialEventData, EventFormProps } from "./EventForm.types";
import PartnershipsForm from "../../Partnership/PartnershipsForm";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import LocationPicker from "@/components/common/inputs/LocationPicker";
import type { Event } from "@/types/place/event";
import { EventCategorySelectorInput } from "../../CategorySelectorInput";
import RadioYesOrNo from "@/components/common/inputs/RadioYesOrNo";
import { validationT } from "@/utils/i18n/validationT";

type LocationMode = "place" | "address" | "online";

const getEventPlaceId = (
  event: Event | initialEventData | null
): string | null => {
  if (!event?.place) return null;
  return typeof event.place === "string" ? event.place : event.place._id;
};

const getEventCategoryId = (event: Event | initialEventData | null): string => {
  if (!event?.eventCategory) return "";
  return typeof event.eventCategory === "string"
    ? event.eventCategory
    : event.eventCategory._id;
};

const initialEventData = (
  event: Event | initialEventData | null
): initialEventData => ({
  name: event?.name || "",
  description: event?.description || "",
  eventCategory: getEventCategoryId(event),
  place: getEventPlaceId(event),
  location: event?.location || null,
  online: event?.online || false,
  isBookable: event?.isBookable || false,
  capacity:
    event && "capacity" in event && event.capacity
      ? String(event.capacity)
      : "",
  maxSeatsPerBooking:
    event && "maxSeatsPerBooking" in event && event.maxSeatsPerBooking
      ? String(event.maxSeatsPerBooking)
      : "1",
  schedule:
    event?.schedule.map((period) => ({
      ...period,
      startDate: format(new Date(period.startDate), "dd-MM-yyyy"),
      endDate: period.endDate
        ? format(new Date(period.endDate), "dd-MM-yyyy")
        : "",
    })) || [],
});

const EventForm = ({
  eventData = null,
  isUpdate = false,
  partnershipsData = [],
}: EventFormProps) => {
  const router = useRouter();
  const { user } = useCurrentUser();
  const userPlace =
    user?.place && typeof user.place === "object" ? user.place : null;
  const { submitEvent, isLoading: submitFormLoading } = useSubmitEvent();
  const { submitEventInvitations, isLoading: submitEventInvitationsLoading } =
    useSubmitEventInvitations();
  const { showError, showSuccess } = useToast();
  const { t } = useTranslation("events");

  const [partnerships, setPartnerships] =
    useState<Partnership[]>(partnershipsData);
  const [event, setEvent] = useState<initialEventData>(
    initialEventData(eventData)
  );
  const [locationMode, setLocationMode] = useState<LocationMode>(
    eventData?.online
      ? "online"
      : eventData?.location
      ? "address"
      : eventData?.place
      ? "place"
      : "address"
  );
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const hasInitializedLocationMode = useRef(!!eventData);
  const [errors, setErrors] = useState<{
    event: Record<string, string>;
  }>({ event: {} });

  const { onUpdatePeriod, onDeletePeriod, onUpdateTimeSlot, onDeleteTimeSlot } =
    useEventSchedule({ setEvent });

  const onEventChange: FormDataChangeHandler = (e) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleIsBookableChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isBookable = e.target.value === "yes";
    setEvent((prev) => ({
      ...prev,
      isBookable,
      maxSeatsPerBooking: isBookable ? prev.maxSeatsPerBooking || "1" : "1",
      capacity: isBookable ? prev.capacity : "",
    }));
  };

  const validateFormData = useCallback((): boolean => {
    const eventValidation = validateEventData(validationT(t))(event);
    setErrors((prev) => ({
      ...prev,
      event: eventValidation.errors,
    }));
    return eventValidation.isValid;
  }, [event, t]);

  useEffect(() => {
    if (eventData) setEvent(initialEventData(eventData));
    if (eventData?.online) setLocationMode("online");
    else if (eventData?.location) setLocationMode("address");
    else if (eventData?.place) setLocationMode("place");
    if (partnershipsData && partnershipsData.length > 0)
      setPartnerships(partnershipsData);
  }, [eventData, partnershipsData]);

  useEffect(() => {
    if (!isUpdate && userPlace && locationMode === "place" && !event.place) {
      setEvent((prev) => ({ ...prev, place: userPlace._id }));
    }
  }, [event.place, isUpdate, locationMode, userPlace]);

  useEffect(() => {
    if (
      !isUpdate &&
      userPlace &&
      !event.place &&
      !event.location &&
      !event.online
    ) {
      setLocationMode("place");
      setEvent((prev) => ({ ...prev, place: userPlace._id }));
    }
  }, [event.location, event.online, event.place, isUpdate, userPlace]);

  useEffect(() => {
    if (hasAttemptedSubmit) {
      validateFormData();
    }
  }, [hasAttemptedSubmit, validateFormData]);

  const loading = submitEventInvitationsLoading || submitFormLoading;

  const handleLocationModeChange = (mode: LocationMode) => {
    setLocationMode(mode);
    setEvent((prev) => {
      if (mode === "online") {
        return { ...prev, online: true, place: null, location: null };
      }

      if (mode === "address") {
        return { ...prev, online: false, place: null };
      }

      return {
        ...prev,
        online: false,
        place: userPlace?._id || null,
        location: null,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);
    try {
      if (!validateFormData()) {
        showError(t("eventForm.validationError"));
        return;
      }
      if (event) {
        // send event data to server
        const { isBookable, capacity, maxSeatsPerBooking, ...rest } = event;
        const eventPayload = {
          ...rest,
          isBookable,
          capacity: isBookable && capacity ? Number(capacity) : null,
          maxSeatsPerBooking: isBookable
            ? Number(maxSeatsPerBooking) || 1
            : 1,
        };
        const { _id: eventId } = await submitEvent(
          eventPayload,
          isUpdate,
          eventData?._id
        );
        // send partnerships data to server if event is created
        if (eventId && partnerships.length > 0) {
          const { newValues, updatedValues } =
            separateNewAndUpdatedArrayValues(partnerships);
          if (newValues.length > 0) {
            await submitEventInvitations(newValues, false, eventId);
          }
          if (updatedValues.length > 0) {
            await submitEventInvitations(updatedValues, true, eventId);
          }
        }
      }
      showSuccess(
        isUpdate
          ? t("eventForm.updateSuccess")
          : t("eventForm.createSuccess")
      );
      router.push(
        getAccountSidebarPath(SIDEBAR_VALUES.EVENTS, EVENTS_TAB_IDS.MY_EVENTS)
      );
    } catch {
      showError(
        isUpdate
          ? t("eventForm.updateError")
          : t("eventForm.createError")
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextField
        label={t("eventForm.nameLabel")}
        fullWidth
        required
        name="name"
        placeholder={t("eventForm.namePlaceholder")}
        value={event.name}
        onChange={onEventChange}
        error={!!errors.event.name}
        errorMessage={errors.event.name}
      />
      <TextField
        multiline
        showCharCount
        fullWidth
        required
        maxLength={300}
        rows={2}
        label={t("eventForm.descriptionLabel")}
        className={styles.description}
        name="description"
        placeholder={t("eventForm.descriptionPlaceholder")}
        value={event.description}
        onChange={onEventChange}
        error={!!errors.event.description}
        errorMessage={errors.event.description}
      />
      <div className={styles.eventCategory}>
        <EventCategorySelectorInput
          value={event.eventCategory}
          onChange={onEventChange}
          error={!!errors.event.eventCategory}
          errorMessage={errors.event.eventCategory}
        />
      </div>
      <PartnershipsForm
        onChange={setPartnerships}
        partnerships={partnerships as PartnershipPopulated[]}
      />
      <fieldset className={styles.locationSection}>
        <legend className={styles.locationTitle}>
          {t("eventForm.locationTitle")}
        </legend>
        <div className={styles.locationOptions}>
          {userPlace && (
            <label className={styles.locationOption}>
              <input
                type="radio"
                name="locationMode"
                value="place"
                checked={locationMode === "place"}
                onChange={() => handleLocationModeChange("place")}
              />
              <span>
                {t("eventForm.useMyPlace")}
                {userPlace.location?.label
                  ? ` (${userPlace.location.label})`
                  : ""}
              </span>
            </label>
          )}
          <label className={styles.locationOption}>
            <input
              type="radio"
              name="locationMode"
              value="address"
              checked={locationMode === "address"}
              onChange={() => handleLocationModeChange("address")}
            />
            <span>{t("eventForm.setAddress")}</span>
          </label>
          <label className={styles.locationOption}>
            <input
              type="radio"
              name="locationMode"
              value="online"
              checked={locationMode === "online"}
              onChange={() => handleLocationModeChange("online")}
            />
            <span>{t("eventForm.onlineEvent")}</span>
          </label>
        </div>
        {locationMode === "address" && (
          <LocationPicker
            location={event.location || null}
            onChange={(location) =>
              setEvent((prev) => ({ ...prev, location, place: null }))
            }
            error={errors.event.location}
            markerName={event.name || t("eventForm.markerName")}
          />
        )}
      </fieldset>
      <fieldset className={styles.bookingSection}>
        <legend className={styles.locationTitle}>{t("eventForm.bookingTitle")}</legend>
        <RadioYesOrNo
          label={t("eventForm.isBookableLabel")}
          name="isBookable"
          value={event.isBookable ? "yes" : "no"}
          onChange={handleIsBookableChange}
        />
        {event.isBookable && (
          <div className={styles.bookingFields}>
            <TextField
              type="number"
              label={t("eventForm.capacityLabel")}
              placeholder={t("eventForm.capacityPlaceholder")}
              name="capacity"
              value={event.capacity}
              onChange={onEventChange}
              error={!!errors.event.capacity}
              errorMessage={errors.event.capacity}
            />
            <TextField
              type="number"
              label={t("eventForm.maxSeatsPerBookingLabel")}
              required
              name="maxSeatsPerBooking"
              value={event.maxSeatsPerBooking}
              onChange={onEventChange}
              error={!!errors.event.maxSeatsPerBooking}
              errorMessage={errors.event.maxSeatsPerBooking}
            />
          </div>
        )}
      </fieldset>
      <NewDatesEventForm onChange={onEventChange} data={event} />
      <EventScheduleList
        schedule={event.schedule}
        partnerships={partnerships}
        onUpdatePeriod={onUpdatePeriod}
        onUpdateTimeSlot={onUpdateTimeSlot}
        onDeletePeriod={onDeletePeriod}
        onDeleteTimeSlot={onDeleteTimeSlot}
        errors={errors.event}
      />
      <div className={styles.buttonContainer}>
        <Button
          type="button"
          fullWidth
          size="large"
          variant="secondary"
          onClick={() => router.back()}
          ariaLabel={t("common:actions.cancel")}
          disabled={loading}
        >
          {t("common:actions.cancel")}
        </Button>
        <Button
          type="submit"
          fullWidth
          size="large"
          disabled={loading}
          ariaLabel={t("common:actions.save")}
        >
          {t("common:actions.save")}
        </Button>
      </div>
    </form>
  );
};

export default EventForm;
