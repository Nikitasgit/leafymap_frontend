"use client";

import SearchInput from "@/components/common/inputs/searchInput/SearchInput";
import styles from "./FiltersBar.module.scss";
import { ChevronDown, Filter } from "lucide-react";
import { useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";

type SearchType = {
  label: string;
  placeholder: string;
};

const searchTypes: SearchType[] = [
  { label: "Membres", placeholder: "Rechercher un membre" },
  { label: "Lieux", placeholder: "Rechercher un lieu" },
];

const FiltersBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(searchTypes[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchTypeSelect = (type: SearchType) => {
    setSearchType(type);
    setIsDropdownOpen(false);
  };

  return (
    <div className={styles.filtersBar}>
      <div className={styles.categories}>
        <button className={`${styles.category} ${styles.active}`}>Tous</button>
        <button className={styles.category}>Producteurs</button>
        <button className={styles.category}>Art et artisanat</button>
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
          onSelect={() => {}}
          onDelete={() => {}}
          fetchSuggestions={async () => []}
          placeholder={searchType.placeholder}
        />
      </div>
      <button className={styles.filterButton}>
        <Filter size={20} />
        Filtres
      </button>
    </div>
  );
};

export default FiltersBar;
