import React, { useState, useEffect } from "react";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import styles from "./FiltersCardMap.module.scss";
import { RotateCcw } from "lucide-react";
import CategoryFilter from "./categoryFilter/CategoryFilter";
import { MapFilters } from "@/types/map";
import { useTranslation } from "react-i18next";

interface FiltersCardMapProps {
  onResetFilters?: () => void;
  onFiltersChange?: (filters: MapFilters) => void;
  onApplyFilters?: (filters: MapFilters) => void;
  filters: MapFilters;
}

const FiltersCardMap = ({
  onFiltersChange,
  onApplyFilters,
  filters,
  onResetFilters,
}: FiltersCardMapProps) => {
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
        <Text as="h3" className={styles.title}>
          {t("filters")}
        </Text>
      </div>
      <div className={styles.content}>
        <CategoryFilter
          selectedCategories={localFilters.placeCategories}
          onCategoryChange={handleCategoryChange}
        />

        <Button
          variant="outline"
          startIcon={<RotateCcw size={14} />}
          onClick={handleResetFilters}
          fullWidth
        >
          <Text>Réinitialiser les filtres</Text>
        </Button>

        <Button fullWidth onClick={handleApplyFilters}>
          <Text>Appliquer les filtres</Text>
        </Button>
      </div>
    </div>
  );
};

export default FiltersCardMap;
