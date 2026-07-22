import type { TFunction } from "i18next";
import { MultiSelectOption } from "@/shared/ui/inputs/multiSelectFilter";

interface Category {
  id: string;
  name: string;
}

interface BuildCategoryOptionsParams<T> {
  getLabel: (category: T) => string;
  getGroupName?: (category: T) => string;
  t: TFunction;
}

/**
 * Builds MultiSelectOption entries from a list of categories, sorted by
 * group name then category name. The group label is resolved through the
 * `categoryTypes` translation namespace, falling back to `placeTypes` and
 * finally to the raw group name.
 */
export const buildCategoryOptions = <T extends Category>(
  categories: T[],
  { getLabel, getGroupName, t }: BuildCategoryOptionsParams<T>
): MultiSelectOption[] =>
  categories
    .slice()
    .sort((a, b) => {
      const groupA = getGroupName?.(a) ?? "";
      const groupB = getGroupName?.(b) ?? "";
      if (groupA !== groupB) return groupA.localeCompare(groupB);
      return (a.name ?? "").localeCompare(b.name ?? "");
    })
    .map((category) => {
      const rawGroup = getGroupName?.(category) ?? "";
      return {
        id: category.id,
        label: getLabel(category),
        group: rawGroup
          ? t(`common:categoryTypes.${rawGroup}`, t(`common:placeTypes.${rawGroup}`, rawGroup))
          : "",
      };
    });

/** Filters options to those whose id is included in `selectedIds`. */
export const selectedFrom = (
  options: MultiSelectOption[],
  selectedIds: string[]
): MultiSelectOption[] => options.filter((option) => selectedIds.includes(option.id));
