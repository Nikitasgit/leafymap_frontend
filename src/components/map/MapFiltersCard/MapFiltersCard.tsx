import { useState, useEffect, useMemo } from "react";
import { Calendar, RotateCcw, Star, Users, Package, Store, X } from "lucide-react";
import Button from "@/components/common/buttons/Button";
import MultiSelectFilter, {
  MultiSelectOption,
} from "@/components/common/inputs/MultiSelectFilter";
import PlaceCategoryFilter from "../PlaceCategoryFilter";
import styles from "./MapFiltersCard.module.scss";
import { MapFilters } from "@/types/map";
import { useTranslation } from "react-i18next";
import { MapFiltersCardProps } from "./MapFiltersCard.types";
import { useApp } from "@/hooks/useApp";

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
      userCategories
        .slice()
        .sort((a, b) => {
          const typeA = a.type?.name ?? "";
          const typeB = b.type?.name ?? "";
          if (typeA !== typeB) return typeA.localeCompare(typeB);
          return a.name.localeCompare(b.name);
        })
        .map((cat) => ({
          id: cat.id,
          label: t(`common:creatorCategories.${cat.name}`, cat.name),
          group: cat.type?.name
            ? t(
                `common:categoryTypes.${cat.type.name}`,
                t(`common:placeTypes.${cat.type.name}`, cat.type.name)
              )
            : "",
        })),
    [userCategories]
  );

  const productCategoryOptions: MultiSelectOption[] = useMemo(
    () =>
      productCategories
        .slice()
        .sort((a, b) => {
          const nameOf = (c: typeof a) =>
            c.type && typeof c.type === "object"
              ? ((c.type as { name?: string }).name ?? "")
              : "";
          const ga = nameOf(a);
          const gb = nameOf(b);
          if (ga !== gb) return ga.localeCompare(gb);
          return (a.name ?? "").localeCompare(b.name ?? "");
        })
        .map((cat) => {
          const rawGroup =
            cat.type && typeof cat.type === "object"
              ? ((cat.type as { name?: string }).name ?? "")
              : "";
          return {
            id: cat.id,
            label: t(`common:productCategories.${cat.name}`, cat.name),
            group: rawGroup
              ? t(`common:categoryTypes.${rawGroup}`, t(`common:placeTypes.${rawGroup}`, rawGroup))
              : "",
          };
        }),
    [productCategories]
  );

  const selectedUserCategories = useMemo(
    () =>
      userCategoryOptions.filter((opt) =>
        (localFilters.userCategoryIds ?? []).includes(opt.id)
      ),
    [userCategoryOptions, localFilters.userCategoryIds]
  );

  const selectedProductCategories = useMemo(
    () =>
      productCategoryOptions.filter((opt) =>
        (localFilters.productCategoryIds ?? []).includes(opt.id)
      ),
    [productCategoryOptions, localFilters.productCategoryIds]
  );

  const eventCategoryOptions: MultiSelectOption[] = useMemo(
    () =>
      eventCategories.map((cat) => ({
        id: cat.id,
        label: t(`common:eventCategories.${cat.name}`, cat.name),
      })),
    [eventCategories]
  );

  const selectedEventCategories = useMemo(
    () =>
      eventCategoryOptions.filter((opt) =>
        (localFilters.eventCategories ?? []).includes(opt.id)
      ),
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
