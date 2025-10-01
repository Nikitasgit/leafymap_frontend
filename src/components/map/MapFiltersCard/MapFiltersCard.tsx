import { useState, useEffect } from "react";
import Button from "@/components/common/buttons/Button";
import styles from "./MapFiltersCard.module.scss";
import { RotateCcw } from "lucide-react";
import PlaceCategoryFilter from "../PlaceCategoryFilter";
import { MapFilters } from "@/types/map";
import { useTranslation } from "react-i18next";
import { MapFiltersCardProps } from "./MapFiltersCard.types";

const MapFiltersCard = ({
  onFiltersChange,
  onApplyFilters,
  filters,
  onResetFilters,
  onClose,
}: MapFiltersCardProps) => {
  const [localFilters, setLocalFilters] = useState<MapFilters>(filters);
  const { t } = useTranslation("common");
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleResetFilters = () => {
    const resetFilters = {
      ...filters,
      placeCategories: [],
    };
    setLocalFilters(resetFilters);
    if (onResetFilters) {
      onResetFilters();
    }
  };

  const handleCategoryChange = (categories: string[]) => {
    setLocalFilters({
      ...localFilters,
      placeCategories: categories,
    });
  };

  const handleApplyFilters = () => {
    if (onApplyFilters) {
      onApplyFilters(localFilters);
    } else if (onFiltersChange) {
      onFiltersChange(localFilters);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <section className={styles.filtersCardMap} aria-labelledby="filters-title">
      <header className={styles.header}>
        <h2 id="filters-title" className={styles.title}>
          {t("filters")}
        </h2>
      </header>
      <div className={styles.content}>
        <PlaceCategoryFilter
          selectedCategories={localFilters.placeCategories}
          onCategoryChange={handleCategoryChange}
        />

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
