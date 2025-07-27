import React, { useState, useEffect } from "react";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import styles from "./FiltersCardMap.module.scss";
import { RotateCcw } from "lucide-react";
import DateFilter from "./dateFilter/DateFilter";
import CategoryFilter from "./categoryFilter/CategoryFilter";
import { MapFilters } from "@/types/map";

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

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleResetFilters = () => {
    const resetFilters = {
      ...filters,
      placeCategories: [],
      startDate: null,
      endDate: null,
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

  const handleDateChange = (startDate: Date | null, endDate: Date | null) => {
    setLocalFilters({
      ...localFilters,
      startDate,
      endDate,
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
        <h2 className={styles.title}>Filtres</h2>
      </div>
      <div className={styles.content}>
        <Button
          variant="primary"
          onClick={handleResetFilters}
          className={styles.resetButton}
        >
          <RotateCcw size={14} />
          <Text>Réinitialiser les filtres</Text>
        </Button>

        <Button
          variant="primary"
          onClick={handleApplyFilters}
          className={styles.applyButton}
        >
          <Text>Appliquer les filtres</Text>
        </Button>
      </div>
      <CategoryFilter
        selectedCategories={localFilters.placeCategories}
        onCategoryChange={handleCategoryChange}
      />
      <DateFilter
        startDate={localFilters.startDate || null}
        endDate={localFilters.endDate || null}
        onDateChange={handleDateChange}
      />
    </div>
  );
};

export default FiltersCardMap;
