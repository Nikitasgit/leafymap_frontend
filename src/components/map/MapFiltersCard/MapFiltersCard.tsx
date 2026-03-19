import { useState, useEffect, useMemo } from "react";
import { RotateCcw, Star, Users, Package, Store, X } from "lucide-react";
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

const RATING_OPTIONS: { label: string; value: number | null }[] = [
  { label: "Tous", value: null },
  { label: "4★+", value: 4 },
  { label: "4.5★+", value: 4.5 },
];

const PLACE_TYPE_OPTIONS = [
  { value: "food", labelKey: "placeTypes.food", fallback: "Alimentaire" },
  { value: "art", labelKey: "placeTypes.art", fallback: "Art" },
  { value: "craft", labelKey: "placeTypes.craft", fallback: "Artisanat" },
];

const MapFiltersCard = ({
  onFiltersChange,
  onApplyFilters,
  filters,
  onResetFilters,
  onClose,
  isMobile = false,
}: MapFiltersCardProps) => {
  const [localFilters, setLocalFilters] = useState<MapFilters>(filters);
  const { t } = useTranslation("common");
  const { userCategories, productCategories } = useApp();

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const userCategoryOptions: MultiSelectOption[] = useMemo(
    () =>
      userCategories
        .slice()
        .sort((a, b) => {
          if (a.userCategoryType !== b.userCategoryType)
            return a.userCategoryType.localeCompare(b.userCategoryType);
          return a.name.localeCompare(b.name);
        })
        .map((cat) => ({
          _id: cat._id,
          label: t(`creatorCategories.${cat.name}`, cat.name),
          group:
            cat.userCategoryType === "creation"
              ? t("userCategoryTypes.creation", "Créateurs")
              : t("userCategoryTypes.organization", "Organisations"),
        })),
    [userCategories, t]
  );

  const productCategoryOptions: MultiSelectOption[] = useMemo(
    () =>
      productCategories
        .slice()
        .sort((a, b) => {
          const nameOf = (c: typeof a) =>
            c.category && typeof c.category === "object"
              ? ((c.category as { name?: string }).name ?? "")
              : "";
          const ga = nameOf(a);
          const gb = nameOf(b);
          if (ga !== gb) return ga.localeCompare(gb);
          return (a.name ?? "").localeCompare(b.name ?? "");
        })
        .map((cat) => {
          const rawGroup =
            cat.category && typeof cat.category === "object"
              ? ((cat.category as { name?: string }).name ?? "")
              : "";
          return {
            _id: cat._id,
            label: t(`productCategories.${cat.name}`, cat.name),
            group: rawGroup ? t(`placeTypes.${rawGroup}`, rawGroup) : "",
          };
        }),
    [productCategories, t]
  );

  const selectedUserCategories = useMemo(
    () =>
      userCategoryOptions.filter((opt) =>
        (localFilters.userCategoryIds ?? []).includes(opt._id)
      ),
    [userCategoryOptions, localFilters.userCategoryIds]
  );

  const selectedProductCategories = useMemo(
    () =>
      productCategoryOptions.filter((opt) =>
        (localFilters.productCategoryIds ?? []).includes(opt._id)
      ),
    [productCategoryOptions, localFilters.productCategoryIds]
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
      minRating: null,
      userCategoryIds: [],
      productCategoryIds: [],
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
          {t("filters")}
        </h2>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Fermer les filtres"
        >
          <X size={18} />
        </button>
      </header>

      <div className={styles.content}>
        {/* Types de lieux */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>
            <Store size={14} aria-hidden="true" />
            <span>Types de lieux</span>
          </p>
          <div className={styles.ratingButtons}>
            {PLACE_TYPE_OPTIONS.map((opt) => (
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
                {t(opt.labelKey, opt.fallback)}
              </button>
            ))}
          </div>
        </div>

        {/* Note minimale */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>
            <Star size={14} aria-hidden="true" />
            <span>Note minimale</span>
          </p>
          <div className={styles.ratingButtons}>
            {RATING_OPTIONS.map((opt) => (
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
            <span>Type de créateur</span>
          </p>
          <MultiSelectFilter
            options={userCategoryOptions}
            value={selectedUserCategories}
            onChange={(selected) =>
              setLocalFilters((prev) => ({
                ...prev,
                userCategoryIds: selected.map((s) => s._id),
              }))
            }
            label="Type de créateur"
            placeholder="Sélectionner..."
            groupBy={(opt) => opt.group ?? ""}
          />
        </div>

        {/* Produits proposés */}
        <div className={styles.section}>
          <p className={styles.sectionLabel}>
            <Package size={14} aria-hidden="true" />
            <span>Produits proposés</span>
          </p>
          <MultiSelectFilter
            options={productCategoryOptions}
            value={selectedProductCategories}
            onChange={(selected) =>
              setLocalFilters((prev) => ({
                ...prev,
                productCategoryIds: selected.map((s) => s._id),
              }))
            }
            label="Produits proposés"
            placeholder="Sélectionner..."
            groupBy={(opt) => opt.group ?? ""}
          />
        </div>

        <Button
          variant="outline"
          startIcon={<RotateCcw size={14} />}
          onClick={handleResetFilters}
          fullWidth
          type="button"
          ariaLabel="Réinitialiser les filtres"
        >
          Réinitialiser les filtres
        </Button>

        <Button
          fullWidth
          onClick={handleApplyFilters}
          type="button"
          ariaLabel="Appliquer les filtres"
        >
          Appliquer les filtres
        </Button>
      </div>
    </section>
  );
};

export default MapFiltersCard;
