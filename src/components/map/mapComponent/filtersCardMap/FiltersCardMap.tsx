import React from "react";
import Button from "@/components/common/buttons/button/Button";
import Text from "@/components/common/typography/Text";
import styles from "./FiltersCardMap.module.scss";
import { RotateCcw } from "lucide-react";

interface FiltersCardMapProps {
  onResetFilters?: () => void;
}

const FiltersCardMap = ({ onResetFilters }: FiltersCardMapProps) => {
  const handleResetFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    }
  };

  return (
    <div className={styles.filtersCardMap}>
      <div className={styles.header}>
        <h2 className={styles.title}>Filtres</h2>
      </div>

      <div className={styles.content}>
        <Button
          variant="secondary"
          onClick={handleResetFilters}
          className={styles.resetButton}
        >
          <RotateCcw size={14} />
          <Text>Réinitialiser les filtres</Text>
        </Button>
      </div>
    </div>
  );
};

export default FiltersCardMap;
