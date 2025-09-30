import React, { useState, useEffect } from "react";
import Button from "@/components/common/buttons/button/Button";
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
  };

  return (
    <div className={styles.filtersCardMap}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          {t("filters")}
        </h3>
      </div>
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
        >
          <p>Réinitialiser les filtres</p>
        </Button>

        <Button fullWidth onClick={handleApplyFilters}>
          <p>Appliquer les filtres</p>
        </Button>
      </div>
    </div>
  );
};

export default MapFiltersCard;
