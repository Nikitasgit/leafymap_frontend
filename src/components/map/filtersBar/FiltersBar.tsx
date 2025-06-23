"use client";

import SearchInput from "@/components/common/inputs/searchInput/SearchInput";
import styles from "./FiltersBar.module.scss";
import { ChevronDown, Filter } from "lucide-react";
import { useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { MapFilters } from "@/types/map";
import { useFindCreators } from "@/hooks/useFindCreators";
import { Collaborator } from "@/types/place/collaborators";

type SearchType = {
  label: string;
  placeholder: string;
};
const types = [
  { key: "all", label: "Tous", value: ["all"] },
  { key: "food", label: "Producteurs", value: ["food"] },
  { key: "art", label: "Art et artisanat", value: ["art", "craft"] },
];

const searchTypes: SearchType[] = [
  { label: "Membres", placeholder: "Rechercher un membre" },
  { label: "Lieux", placeholder: "Rechercher un lieu" },
];

const FiltersBar = ({
  loading,
  filters,
  setFilters,
  handleUserSelect,
}: {
  loading: boolean;
  filters: MapFilters;
  setFilters: (filters: MapFilters) => void;
  handleUserSelect: (user: Collaborator) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(searchTypes[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { searchCreators } = useFindCreators();
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchTypeSelect = (type: SearchType) => {
    setSearchType(type);
    setIsDropdownOpen(false);
  };

  const handleTypeSelect = (type: {
    key: string;
    label: string;
    value: string[];
  }) => {
    setFilters({
      ...filters,
      placeType: type.value,
    });
  };

  return (
    <div className={styles.filtersBar}>
      <div className={styles.categories}>
        {types.map((type) => (
          <button
            key={type.key}
            className={`${styles.category} ${
              filters.placeType.includes(type.key) ? styles.active : ""
            }`}
            onClick={() => handleTypeSelect(type)}
          >
            {type.label}
          </button>
        ))}
      </div>
      <div className={styles.search}>
        <div className={styles.searchDropdownWrapper} ref={dropdownRef}>
          <div className={styles.searchDropdown} onClick={handleDropdownToggle}>
            <span>{searchType.label}</span>
            <ChevronDown size={20} />
          </div>
          {isDropdownOpen && (
            <div className={styles.dropdownMenu}>
              {searchTypes.map((type) => (
                <div
                  key={type.label}
                  className={styles.dropdownItem}
                  onClick={() => handleSearchTypeSelect(type)}
                >
                  {type.label}
                </div>
              ))}
            </div>
          )}
        </div>
        <SearchInput
          withIcons={true}
          debounce={500}
          loading={loading}
          limit={10}
          onSelect={handleUserSelect}
          onDelete={() => {}}
          fetchSuggestions={searchCreators}
          placeholder={searchType.placeholder}
        />
      </div>
      <button className={styles.filterButton} disabled={loading}>
        <Filter size={20} />
        Filtres
      </button>
    </div>
  );
};

export default FiltersBar;
