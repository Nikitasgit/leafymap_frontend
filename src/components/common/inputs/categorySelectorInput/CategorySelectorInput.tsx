import React, { useState, useRef, useEffect } from "react";
import styles from "./CategorySelectorInput.module.scss";
import { useSelector } from "react-redux";
import { selectCategories, selectSubCategories } from "@/store/appSlice";
import { FormDataChangeHandler } from "@/components/account/createProfileStepper/CreateProfileStepper.types";
import { SubCategory } from "@/types/categories";

const CategorySelectorInput = ({
  onChange,
  value,
}: {
  onChange: FormDataChangeHandler;
  value: string;
}) => {
  const categories = useSelector(selectCategories);
  const subCategories = useSelector(selectSubCategories);

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

  const handleSelect = (value: SubCategory) => {
    setInputValue(value.name);
    setIsOpen(false);
    setSelectedCategory(null);
    setSearch("");
    onChange({
      target: {
        name: "category",
        value: value._id,
      },
    });
  };

  const filteredSubcategories = subCategories.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  const categorySubcategories = subCategories.filter(
    (sub) => sub.categoryId === selectedCategory
  );
  useEffect(() => {
    console.log(value);
    if (value) {
      const sub = subCategories.find((s) => s._id === value);
      if (sub) {
        setInputValue(sub.name);
      }
    }
  }, [value, subCategories]);

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
              setSelectedCategory(null); // Always reset category when searching
            }}
            className={styles.searchBar}
          />

          <div className={styles.list}>
            {/* Case 1: Searching → show matching subcategories only */}
            {search
              ? filteredSubcategories.map((sub) => (
                  <div
                    key={sub._id}
                    className={styles.item}
                    onClick={() => handleSelect(sub)}
                  >
                    {sub.name}
                    <span className={styles.categoryHint}>
                      (
                      {
                        categories.find((cat) => cat._id === sub.categoryId)
                          ?.name
                      }
                      )
                    </span>
                  </div>
                ))
              : selectedCategory
              ? // Case 2: Category selected → show subcategories of that category
                categorySubcategories.map((sub) => (
                  <div
                    key={sub._id}
                    className={styles.item}
                    onClick={() => handleSelect(sub)}
                  >
                    {sub.name}
                  </div>
                ))
              : // Case 3: No search, no category → show all categories
                categories.map((cat) => (
                  <div
                    key={cat._id}
                    className={styles.item}
                    onClick={() => setSelectedCategory(cat._id)}
                  >
                    {cat.name}
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
