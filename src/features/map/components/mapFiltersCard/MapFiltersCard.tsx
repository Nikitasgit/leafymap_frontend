import { useState, useEffect, useMemo } from "react";
import { Calendar, RotateCcw, Star, Users, Package, Store, X } from "lucide-react";
import Button from "@/shared/ui/buttons/button";
import MultiSelectFilter, {
  MultiSelectOption,
} from "@/shared/ui/inputs/multiSelectFilter";
import PlaceCategoryFilter from "../placeCategoryFilter";
import styles from "./MapFiltersCard.module.scss";
import { MapFilters } from "@/features/map/types";
import { useTranslation } from "react-i18next";
import { MapFiltersCardProps } from "./MapFiltersCard.types";
import { useApp } from "@/features/categories";
import { buildCategoryOptions, selectedFrom } from "@/features/map/utils/categoryOptions";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";

const MapFiltersCard = ({
  onFiltersChange,
  onApplyFilters,
  filters,
  displayMode,
  onResetFilters,
  onClose,
  isMobile = false,
}: MapFiltersCardProps) => {
  const [localFilters, setLocalFilters] = useState<MapFilters>(filters);
  const { t } = useTranslation("map");
  const { userCategories, productCategories, categoryTypes, eventCategories } = useApp();

  const ratingOptions = useMemo(
    () => [
      { label: t("mapFiltersCard.ratingAll"), value: null },
      { label: "4★+", value: 4 },
      { label: "4.5★+", value: 4.5 },
    ],
    [t]
  );

  const placeTypeOptions = useMemo(
    () =>
      categoryTypes
        .filter((type) => type.name !== "organization")
        .map((type) => ({
          value: type.id,
          labelKey: `placeTypes.${type.name}`,
          fallback: type.name,
        })),
    [categoryTypes],
  );

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const userCategoryOptions: MultiSelectOption[] = useMemo(
    () =>
      buildCategoryOptions(userCategories, {
        getLabel: (cat) => t(`common:creatorCategories.${cat.name}`, cat.name),
        getGroupName: (cat) => cat.type?.name ?? "",
        t,
      }),
    [userCategories, t]
  );

  const productCategoryOptions: MultiSelectOption[] = useMemo(
    () =>
      buildCategoryOptions(productCategories, {
        getLabel: (cat) => t(`common:productCategories.${cat.name}`, cat.name),
        getGroupName: (cat) => resolveRefObject(cat.type)?.name ?? "",
        t,
      }),
    [productCategories, t]
  );

  const selectedUserCategories = useMemo(
    () => selectedFrom(userCategoryOptions, localFilters.userCategoryIds ?? []),
    [userCategoryOptions, localFilters.userCategoryIds]
  );

  const selectedProductCategories = useMemo(
    () => selectedFrom(productCategoryOptions, localFilters.productCategoryIds ?? []),
    [productCategoryOptions, localFilters.productCategoryIds]
  );

  const eventCategoryOptions: MultiSelectOption[] = useMemo(
    () =>
      buildCategoryOptions(eventCategories, {
        getLabel: (cat) => t(`common:eventCategories.${cat.name}`, cat.name),
        t,
      }),
    [eventCategories, t]
  );

  const selectedEventCategories = useMemo(
    () => selectedFrom(eventCategoryOptions, localFilters.eventCategories ?? []),
    [eventCategoryOptions, localFilters.eventCategories]
  );

  const handlePlaceTypeToggle = (value: string) => {
    setLocalFilters((prev) => {
      const current = prev.placeTypes ?? [];
      return {
        ...prev,
        placeTypes: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const handleResetFilters = () => {
    const resetFilters: MapFilters = {
      ...filters,
      placeTypes: [],
      placeCategories: [],
      eventCategories: [],
      minRating: null,
      userCategoryIds: [],
      productCategoryIds: [],
      startDate: null,
      endDate: null,
    };
    setLocalFilters(resetFilters);
    onResetFilters?.();
  };

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    } else {
      onFiltersChange?.(localFilters);
    }
    if (isMobile) {
      onClose?.();
    }
  };

  return (
    <section className={styles.filtersCardMap} aria-labelledby="filters-title">
      <header className={styles.header}>
        <h2 id="filters-title" className={styles.title}>
          {t("common:filters")}
        </h2>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label={t("mapFiltersCard.closeFiltersAriaLabel")}
        >
          <X size={18} />
        </button>
      </header>

      <div className={styles.content}>
        {displayMode === "events" ? (
          <>
            <div className={styles.section}>
              <p className={styles.sectionLabel}>
                <Calendar size={14} aria-hidden="true" />
                <span>{t("mapFiltersCard.eventCategories")}</span>
              </p>
              <MultiSelectFilter
                options={eventCategoryOptions}
                value={selectedEventCategories}
                onChange={(selected) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    eventCategories: selected.map((s) => s.id),
                  }))
                }
                label={t("mapFiltersCard.eventCategories")}
                placeholder={t("mapFiltersCard.selectPlaceholder")}
              />
            </div>

            <div className={styles.section}>
              <p className={styles.sectionLabel}>
                <Calendar size={14} aria-hidden="true" />
                <span>{t("common:dates")}</span>
              </p>
              <div className={styles.dateInputs}>
                <label>
                  <span>{t("mapFiltersCard.startDate")}</span>
                  <input
                    type="date"
                    value={localFilters.startDate ?? ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        startDate: e.target.value || null,
                      }))
                    }
                  />
                </label>
                <label>
                  <span>{t("mapFiltersCard.endDate")}</span>
                  <input
                    type="date"
                    value={localFilters.endDate ?? ""}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        endDate: e.target.value || null,
                      }))
                    }
                  />
                </label>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Types de lieux */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>
                <Store size={14} aria-hidden="true" />
                <span>{t("mapFiltersCard.placeTypes")}</span>
              </p>
              <div className={styles.ratingButtons}>
                {placeTypeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.ratingBtn} ${
                      (localFilters.placeTypes ?? []).includes(opt.value)
                        ? styles.active
                        : ""
                    }`}
                    onClick={() => handlePlaceTypeToggle(opt.value)}
                    aria-pressed={(localFilters.placeTypes ?? []).includes(opt.value)}
                  >
                    {t(`common:${opt.labelKey}`, opt.fallback)}
                  </button>
                ))}
              </div>
            </div>

            {/* Note minimale */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>
                <Star size={14} aria-hidden="true" />
                <span>{t("mapFiltersCard.minRating")}</span>
              </p>
              <div className={styles.ratingButtons}>
                {ratingOptions.map((opt) => (
                  <button
                    key={String(opt.value)}
                    type="button"
                    className={`${styles.ratingBtn} ${
                      localFilters.minRating === opt.value ? styles.active : ""
                    }`}
                    onClick={() =>
                      setLocalFilters((prev) => ({ ...prev, minRating: opt.value }))
                    }
                    aria-pressed={localFilters.minRating === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Catégories de lieu */}
            <PlaceCategoryFilter
              selectedCategories={localFilters.placeCategories}
              onCategoryChange={(categories) =>
                setLocalFilters((prev) => ({ ...prev, placeCategories: categories }))
              }
            />

            {/* Type de créateur */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>
                <Users size={14} aria-hidden="true" />
                <span>{t("mapFiltersCard.creatorType")}</span>
              </p>
              <MultiSelectFilter
                options={userCategoryOptions}
                value={selectedUserCategories}
                onChange={(selected) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    userCategoryIds: selected.map((s) => s.id),
                  }))
                }
                label={t("mapFiltersCard.creatorType")}
                placeholder={t("mapFiltersCard.selectPlaceholder")}
                groupBy={(opt) => opt.group ?? ""}
              />
            </div>

            {/* Produits proposés */}
            <div className={styles.section}>
              <p className={styles.sectionLabel}>
                <Package size={14} aria-hidden="true" />
                <span>{t("mapFiltersCard.productsOffered")}</span>
              </p>
              <MultiSelectFilter
                options={productCategoryOptions}
                value={selectedProductCategories}
                onChange={(selected) =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    productCategoryIds: selected.map((s) => s.id),
                  }))
                }
                label={t("mapFiltersCard.productsOffered")}
                placeholder={t("mapFiltersCard.selectPlaceholder")}
                groupBy={(opt) => opt.group ?? ""}
              />
            </div>
          </>
        )}

        <Button
          variant="outline"
          startIcon={<RotateCcw size={14} />}
          onClick={handleResetFilters}
          fullWidth
          type="button"
          ariaLabel={t("mapFiltersCard.resetFiltersAriaLabel")}
        >
          {t("mapFiltersCard.resetFilters")}
        </Button>

        <Button
          fullWidth
          onClick={handleApplyFilters}
          type="button"
          ariaLabel={t("mapFiltersCard.applyFiltersAriaLabel")}
        >
          {t("mapFiltersCard.applyFilters")}
        </Button>
      </div>
    </section>
  );
};

export default MapFiltersCard;
