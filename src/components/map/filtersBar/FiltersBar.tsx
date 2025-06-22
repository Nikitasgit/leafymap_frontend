"use client";

import SearchInput from "@/components/common/inputs/searchInput/SearchInput";
import styles from "./FiltersBar.module.scss";
import { ChevronDown, Filter } from "lucide-react";
import { useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { useFindCreatorInPlaces } from "@/hooks/useFindCreatorInPlaces";
import { MapFilters } from "@/types/map";

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
}: {
  loading: boolean;
  filters: MapFilters;
  setFilters: (filters: MapFilters) => void;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(searchTypes[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { findCreatorInPlaces, isLoading: isSearching } =
    useFindCreatorInPlaces();
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

  const handleSearch = async (searchTerm: string) => {
    if (searchType.label === "Membres") {
      await findCreatorInPlaces(searchTerm);
    }
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
          loading={loading || isSearching}
          onSelect={() => {}}
          onDelete={() => {}}
          fetchSuggestions={async (query: string) => {
            await handleSearch(query);
            return [];
          }}
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
