import React, { useState, useRef, useEffect } from "react";
import styles from "./CategorySelectorInput.module.scss";

const fakeData = {
  Artiste: ["Peintre", "Sculpteur", "Photographe"],
  Agriculteur: ["Maraîcher", "Éleveur", "Viticulteur"],
};

const CategorySelectorInput = ({
  onChange,
}: {
  onChange: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | { target: { name: string; value: string } }
  ) => void;
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSelectedCategory(null);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setInputValue(value);
    setIsOpen(false);
    setSelectedCategory(null);
    setSearch("");
    onChange({
      target: {
        name: "category",
        value: value,
      },
    });
  };

  // Toutes les sous-catégories avec leur catégorie
  const allSubcategories = Object.entries(fakeData).flatMap(
    ([category, subs]) => subs.map((sub) => ({ category, sub }))
  );

  // Sous-catégories filtrées par recherche
  const filteredSubcategories = allSubcategories.filter(({ sub }) =>
    sub.toLowerCase().includes(search.toLowerCase())
  );

  // Sous-catégories de la catégorie sélectionnée
  const categorySubcategories =
    selectedCategory && fakeData[selectedCategory as keyof typeof fakeData]
      ? fakeData[selectedCategory as keyof typeof fakeData]
      : [];

  return (
    <div className={styles.categoryInputWrapper} ref={ref}>
      <input
        type="text"
        value={inputValue}
        onClick={() => setIsOpen(true)}
        readOnly
        placeholder="Sélectionne une activité"
      />

      {isOpen && (
        <div className={styles.dropdown}>
          <input
            type="text"
            placeholder="Rechercher une activité..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedCategory(null); // Si on tape, on sort du contexte catégorie
            }}
            className={styles.searchBar}
          />

          <div className={styles.list}>
            {search
              ? filteredSubcategories.map(({ sub, category }) => (
                  <div
                    key={`${category}-${sub}`}
                    className={styles.item}
                    onClick={() => handleSelect(sub)}
                  >
                    {sub}{" "}
                    <span className={styles.categoryHint}>({category})</span>
                  </div>
                ))
              : selectedCategory
              ? categorySubcategories.map((sub) => (
                  <div
                    key={sub}
                    className={styles.item}
                    onClick={() => handleSelect(sub)}
                  >
                    {sub}
                  </div>
                ))
              : Object.keys(fakeData).map((category) => (
                  <div
                    key={category}
                    className={styles.item}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                    <span className={styles.chevron}>➤</span>
                  </div>
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelectorInput;
