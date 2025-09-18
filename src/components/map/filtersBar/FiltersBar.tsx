"use client";

import SearchInput from "@/components/common/inputs/searchInput/SearchInput";
import styles from "./FiltersBar.module.scss";
import { ChevronDown, Filter } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { MapFilters, ExtendedMapRef } from "@/types/map";
import { useFindPlaces } from "@/hooks/useFindPlaces";
import { useFindUsers } from "@/hooks/useFindUsers";
import Button from "@/components/common/buttons/button/Button";

type CreatorSearchResult = {
  _id: string;
  name: string;
  image: string;
};

type PlaceSearchResult = {
  _id: string;
  name: string;
  image?: string;
  location: {
    label: string;
  };
  placeCategory: {
    _id: string;
    name: string;
  };
};

type SearchResult = {
  id: string;
  type: "user" | "place" | "filters" | null;
};

type SearchType = {
  label: string;
  placeholder: string;
};

const searchTypes: SearchType[] = [
  { label: "Membres", placeholder: "Rechercher un membre" },
  { label: "Lieux", placeholder: "Rechercher un lieu" },
];

const FiltersBar = ({
  mapRef,
  loading: loadingProps,
  filters,
  setFilters,
  handleSelect,
  selectedItem,
}: {
  mapRef: React.RefObject<ExtendedMapRef | null>;
  loading: boolean;
  filters: MapFilters;
  setFilters: (filters: MapFilters) => void;
  handleSelect: (item: SearchResult) => void;
  selectedItem: SearchResult;
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>(searchTypes[0]);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { searchUsers, isLoading: isLoadingUsers } = useFindUsers();
  const { searchPlaces, isLoading: isLoadingPlaces } = useFindPlaces();
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const types = [
    {
      key: "all",
      label: "Tous",
      value: "all",
    },
    {
      key: "food",
      label: `Producteurs`,
      value: "food",
    },
    {
      key: "art",
      label: `Art et artisanat`,
      value: "art-craft",
    },
  ];

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSearchTypeSelect = (type: SearchType) => {
    setSearchType(type);
    setSearchValue("");
    setIsDropdownOpen(false);
  };

  const handleTypeSelect = (type: { value: string }) => {
    if (selectedItem.type !== "filters") {
      handleSelect({
        id: "",
        type: null,
      });
    }
    setFilters({
      ...filters,
      placeType: type.value,
    });
  };

  const handleSearch = async (
    query: string
  ): Promise<(CreatorSearchResult | PlaceSearchResult)[]> => {
    if (searchType.label === "Membres") {
      const creators = await searchUsers({ creatorName: query });
      const suggestions: CreatorSearchResult[] = creators.map((user) => ({
        _id: user._id,
        image:
          typeof user.image === "string"
            ? user.image
            : user.image?.urls.thumbnail || "",
        name: user.creatorName || "",
      }));
      return suggestions;
    } else {
      const places = await searchPlaces(query);
      return places as PlaceSearchResult[];
    }
  };

  const handleSelectSuggestion = (
    item: CreatorSearchResult | PlaceSearchResult
  ) => {
    if (searchType.label === "Membres") {
      handleSelect({
        id: item._id,
        type: "user",
      });
    } else {
      handleSelect({
        id: item._id,
        type: "place",
      });
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fetchPlacesInView(null);
      mapRef.current.setSelectedPlaceId(null);
    }
  }, [filters, mapRef]);

  const loading = isLoadingUsers || isLoadingPlaces || loadingProps;

  return (
    <div className={styles.filtersBar}>
      <div className={styles.categories}>
        {types.map((type) => (
          <button
            key={type.key}
            type="button"
            className={`${styles.category} ${
              type.value === filters.placeType ? styles.active : ""
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
          value={searchValue}
          withIcons={searchType.label === "Membres"}
          debounce={500}
          loading={loading}
          limit={10}
          onSelect={handleSelectSuggestion}
          fetchSuggestions={handleSearch}
          placeholder={searchType.placeholder}
        />
      </div>
      <Button
        variant="secondary"
        type="button"
        onClick={() => handleSelect({ id: "", type: "filters" })}
        disabled={loading}
        startIcon={<Filter size={17} />}
      >
        Filtres
      </Button>
    </div>
  );
};

export default FiltersBar;
