"use client";

import { SearchInput } from "@/components/common/inputs/SearchInput";
import styles from "./MapFiltersBar.module.scss";
import { ChevronDown, Filter, Bookmark } from "lucide-react";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useTranslation } from "react-i18next";
import { useFindUsers } from "@/hooks/useFindUsers";
import Button from "@/components/common/buttons/Button";
import { fetchLocationSuggestions } from "@/utils/map";
import { searchEvents } from "@/lib/api/events";
import {
  getEventCoordinates,
  getEventCreatorId,
  getEventLocationLabel,
} from "@/lib/api/normalizers/resolveRef";
import type {
  CreatorSearchResult,
  EventSearchResult,
  LocationSearchResult,
  SearchType,
  MapFiltersBarProps,
} from "./MapFiltersBar.types";

const SEARCH_TYPE_KEYS = [
  { key: "evenements", typeKey: "events" },
  { key: "membres", typeKey: "members" },
  { key: "lieux", typeKey: "places" },
] as const;

const MapFiltersBar = ({
  mapRef,
  loading: loadingProps,
  filters,
  handleSelect,
  selectedItem,
  displayMode,
  onDisplayModeChange,
  isFavoritesMode,
  onFavoritesModeToggle,
  onExitFavoritesMode,
}: MapFiltersBarProps) => {
  const { t } = useTranslation("map");
  const searchTypes = useMemo<SearchType[]>(
    () =>
      SEARCH_TYPE_KEYS.map((type) => ({
        key: type.key,
        label: t(`mapFiltersBar.searchTypes.${type.typeKey}.label`),
        placeholder: t(`mapFiltersBar.searchTypes.${type.typeKey}.placeholder`),
      })),
    [t]
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTypeKey, setSearchTypeKey] = useState(searchTypes[0].key);
  const searchType =
    searchTypes.find((type) => type.key === searchTypeKey) ?? searchTypes[0];
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { searchUsers, isLoading: isLoadingUsers } = useFindUsers();
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleDropdownToggle = useCallback(() => {
    setIsDropdownOpen((prev) => !prev);
  }, []);

  const handleSearchTypeSelect = useCallback((type: SearchType) => {
    setSearchTypeKey(type.key);
    setIsDropdownOpen(false);
  }, []);

  const handleFilterToggle = useCallback(() => {
    if (selectedItem.type === "filters") {
      handleSelect({ id: "", type: null });
    } else {
      onExitFavoritesMode();
      handleSelect({ id: "", type: "filters" });
    }
  }, [handleSelect, onExitFavoritesMode, selectedItem.type]);

  const handleSearch = useCallback(
    async (
      query: string
    ): Promise<
      (CreatorSearchResult | EventSearchResult | LocationSearchResult)[]
    > => {
      if (searchType.key === "evenements") {
        const events = await searchEvents(query, 10);
        return events.reduce<EventSearchResult[]>((results, event) => {
            const creatorId = getEventCreatorId(event);
            if (!creatorId) return results;
            const locationLabel = getEventLocationLabel(event);
            const image =
              typeof event.image === "object"
                ? event.image?.urls?.thumbnail
                : undefined;
            const eventCategoryName =
              typeof event.eventCategory === "object"
                ? event.eventCategory.name
                : undefined;
            results.push({
              id: event.id,
              eventId: event.id,
              creatorId,
              image,
              name: event.name,
              coordinates: getEventCoordinates(event),
              location: locationLabel ? { label: locationLabel } : undefined,
              categories: eventCategoryName
                ? [{ name: eventCategoryName }]
                : undefined,
            });
            return results;
          }, []);
      }

      if (searchType.key === "membres") {
        const creators = await searchUsers({ username: query }, 10);
        return creators.map((user) => ({
          id: user.id,
          image: user.image?.urls?.thumbnail || user.googlePictureUrl || "",
          name: user.username || "",
          place: user.place?.location
            ? {
                label: user.place.location.label,
                placeCategory: user.place.placeCategory,
              }
            : undefined,
          categories: user.userCategory
            ? [
                {
                  name:
                    typeof user.userCategory === "object"
                      ? user.userCategory.name
                      : "",
                  type:
                    typeof user.userCategory === "object"
                      ? user.userCategory.type
                      : undefined,
                },
              ]
            : [],
        }));
      }

      if (query.length < 2) return [];

      try {
        const locations = await fetchLocationSuggestions(query);
        return locations.map((location) => ({
          id:
            location.id ||
            `location-${location.coordinates[0]}-${location.coordinates[1]}`,
          name: location.label,
          coordinates: location.coordinates,
        }));
      } catch (error) {
        console.error("Error fetching location suggestions:", error);
        return [];
      }
    },
    [searchType.key, searchUsers]
  );

  const handleSelectSuggestion = useCallback(
    (item: CreatorSearchResult | EventSearchResult | LocationSearchResult) => {
      if (searchType.key === "evenements" && "eventId" in item) {
        handleSelect({
          id: item.creatorId,
          type: "creator",
          eventId: item.eventId,
        });
        onDisplayModeChange("events");
        if (item.coordinates && mapRef.current?.isReady) {
          const [longitude, latitude] = item.coordinates;
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 13,
            duration: 1000,
          });
          mapRef.current.fetchEventsInView(null);
        }
        return;
      }

      if (searchType.key === "membres") {
        handleSelect({ id: item.id, type: "creator" });
        return;
      }

      if (
        "coordinates" in item &&
        item.coordinates &&
        mapRef.current?.isReady
      ) {
        const [longitude, latitude] = item.coordinates;
        handleSelect({ id: "", type: null });
        mapRef.current.setSelectedPlaceId(null);
        mapRef.current.flyTo({
          center: [longitude, latitude],
          zoom: 12,
          duration: 1000,
        });
        mapRef.current.fetchPlacesInView(null);
      }
    },
    [handleSelect, mapRef, onDisplayModeChange, searchType.key]
  );

  useEffect(() => {
    if (isFavoritesMode) return;
    if (!mapRef.current?.isReady) return;
    if (displayMode === "events") {
      mapRef.current.fetchEventsInView(null);
    } else {
      mapRef.current.fetchPlacesInView(null);
    }
    if (selectedItem?.type !== "creator") {
      mapRef.current.setSelectedPlaceId(null);
    }
  }, [filters, mapRef, isFavoritesMode, displayMode]); // eslint-disable-line react-hooks/exhaustive-deps

  const loading = isLoadingUsers || loadingProps;

  const hasActiveFilters = useMemo(
    () =>
      displayMode === "events"
        ? filters.eventCategories.length > 0 ||
          Boolean(filters.startDate) ||
          Boolean(filters.endDate)
        : filters.placeTypes.length > 0 ||
          filters.placeCategories.length > 0 ||
          filters.minRating != null ||
          (filters.userCategoryIds?.length ?? 0) > 0 ||
          (filters.productCategoryIds?.length ?? 0) > 0,
    [displayMode, filters]
  );

  const handleDisplayModeChange = useCallback(
    (mode: typeof displayMode) => {
      onDisplayModeChange(mode);
      const nextType =
        searchTypes.find((type) =>
          mode === "events" ? type.key === "evenements" : type.key === "lieux",
        ) ?? searchTypes[0];
      setSearchTypeKey(nextType.key);
      handleSelect({ id: "", type: null });
      onExitFavoritesMode();
    },
    [handleSelect, onDisplayModeChange, onExitFavoritesMode, searchTypes]
  );

  return (
    <div className={styles.filtersBar}>
      <div className={styles.topRow}>
        <div className={styles.filtersBtnWrapper}>
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={handleFilterToggle}
            disabled={loading}
            startIcon={<Filter size={17} />}
            ariaLabel={t("common:filters")}
          >
            {t("common:filters")}
          </Button>
          {hasActiveFilters && (
            <span
              className={styles.filtersDot}
              aria-label={t("mapFiltersBar.activeFiltersAriaLabel")}
            />
          )}
        </div>
        <Button
          variant={displayMode === "events" ? "primary" : "outline"}
          size="small"
          type="button"
          onClick={() => handleDisplayModeChange("events")}
          ariaLabel={t("mapFiltersBar.showEventsAriaLabel")}
        >
          {t("mapFiltersBar.events")}
        </Button>
        <Button
          variant={displayMode === "places" ? "primary" : "outline"}
          size="small"
          type="button"
          onClick={() => handleDisplayModeChange("places")}
          ariaLabel={t("mapFiltersBar.showPlacesAriaLabel")}
        >
          {t("mapFiltersBar.places")}
        </Button>
        {displayMode === "places" && (
          <Button
            variant={isFavoritesMode ? "primary" : "outline"}
            size="small"
            type="button"
            onClick={onFavoritesModeToggle}
            startIcon={<Bookmark size={17} />}
            ariaLabel={
              isFavoritesMode
                ? t("mapFiltersBar.disableSavedPlacesAriaLabel")
                : t("mapFiltersBar.showSavedPlacesAriaLabel")
            }
          >
            {t("mapFiltersBar.saved")}
          </Button>
        )}
      </div>
      <div className={styles.search}>
        <div className={styles.searchDropdownWrapper} ref={dropdownRef}>
          <button
            type="button"
            className={styles.searchDropdown}
            onClick={handleDropdownToggle}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            aria-label={t("mapFiltersBar.selectSearchTypeAriaLabel")}
          >
            <span>{searchType.label}</span>
            <ChevronDown size={20} aria-hidden="true" />
          </button>
          {isDropdownOpen && (
            <ul className={styles.dropdownMenu} role="listbox">
              {searchTypes.map((type) => (
                <li key={type.key} role="presentation">
                  <button
                    type="button"
                    className={styles.dropdownItem}
                    onClick={() => handleSearchTypeSelect(type)}
                    role="option"
                    aria-selected={searchType.key === type.key}
                  >
                    {type.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className={styles.searchInputWrapper}>
          <SearchInput
            withIcons
            limit={10}
            size="small"
            onSelect={handleSelectSuggestion}
            fetchSuggestions={handleSearch}
            placeholder={searchType.placeholder}
          />
        </div>
      </div>
    </div>
  );
};

export default MapFiltersBar;
