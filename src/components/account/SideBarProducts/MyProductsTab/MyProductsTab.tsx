"use client";

import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Package } from "lucide-react";
import Autocomplete from "@mui/material/Autocomplete";
import ListSubheader from "@mui/material/ListSubheader";
import TextField from "@mui/material/TextField";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUserProducts } from "@/hooks/useUserProducts";
import { useApp } from "@/hooks/useApp";
import useSubmitProduct from "@/hooks/useSubmitProduct";
import { useToast } from "@/hooks/useToast";
import AccountTabShell from "@/components/account/AccountTabShell";
import { ProductCategory } from "@/types/product";
import { resolveRefId } from "@/lib/api/normalizers/resolveRef";
import styles from "./MyProductsTab.module.scss";

const MAX_PRODUCTS_PER_USER = 10;

export default function MyProductsTab() {
  const { t } = useTranslation("account");
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const { productCategories, loading: isLoadingCategories } = useApp();
  const {
    products,
    isLoading: isLoadingProducts,
    refetch,
  } = useUserProducts(user?.id);
  const { createProduct, deleteProduct, isLoading: isSubmitting } =
    useSubmitProduct();
  const { showError } = useToast();
  const atLimit = products.length >= MAX_PRODUCTS_PER_USER;

  const getCategoryGroupName = useCallback(
    (option: ProductCategory): string => {
      const type = option.type;
      if (!type || typeof type !== "object") return "";
      const name = (type as { name?: string }).name ?? "";
      return name
        ? t(`common:categoryTypes.${name}`, t(`common:placeTypes.${name}`, name))
        : "";
    },
    [t],
  );

  const options = useMemo(
    () =>
      productCategories.slice().sort((a, b) => {
        const ga = getCategoryGroupName(a);
        const gb = getCategoryGroupName(b);
        if (ga !== gb) return ga.localeCompare(gb);
        return (a.name ?? "").localeCompare(b.name ?? "");
      }),
    [productCategories, getCategoryGroupName],
  );

  const value = useMemo(() => {
    return products
      .map((p) => {
        const id = resolveRefId(p.productCategory);
        return productCategories.find((c) => c.id === id);
      })
      .filter((c): c is ProductCategory => c != null);
  }, [products, productCategories]);

  const handleChange = async (
    _: React.SyntheticEvent,
    newValue: ProductCategory[],
  ) => {
    if (!user) return;
    const prevIds = new Set(value.map((c) => c.id));
    const nextIds = new Set(newValue.map((c) => c.id));

    for (const cat of newValue) {
      if (!prevIds.has(cat.id)) {
        if (atLimit) {
          showError(
            t("myProductsTab.maxProductsError", {
              count: MAX_PRODUCTS_PER_USER,
            }),
          );
          return;
        }
        const ok = await createProduct({ productCategory: cat.id });
        if (ok) await refetch();
        return;
      }
    }
    for (const cat of value) {
      if (!nextIds.has(cat.id)) {
        const product = products.find(
          (p) => resolveRefId(p.productCategory) === cat.id,
        );
        if (product) {
          const ok = await deleteProduct(product.id);
          if (ok) await refetch();
        }
        return;
      }
    }
  };

  if (!user && !isLoadingUser) {
    return null;
  }

  return (
    <AccountTabShell
      icon={<Package size={20} />}
      title={t("myProductsTab.title")}
      description={t("myProductsTab.description")}
      isLoading={isLoadingUser || isLoadingProducts || isLoadingCategories}
    >
      <div className={styles.autocompleteWrap}>
        <Autocomplete
          multiple
          value={value}
          onChange={handleChange}
          options={options}
          getOptionLabel={(option) =>
            option.name
              ? t(`common:productCategories.${option.name}`, option.name)
              : ""
          }
          groupBy={(option) => getCategoryGroupName(option)}
          filterSelectedOptions
          renderGroup={(params) => (
            <li key={params.key}>
              <ListSubheader>{params.group}</ListSubheader>
              <ul>{params.children}</ul>
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("myProductsTab.categoriesLabel")}
              placeholder={
                atLimit
                  ? t("myProductsTab.limitReachedPlaceholder")
                  : t("myProductsTab.addCategoryPlaceholder")
              }
              helperText={
                atLimit
                  ? t("myProductsTab.limitReachedHelper")
                  : t("myProductsTab.maxProductsHelper", {
                      count: MAX_PRODUCTS_PER_USER,
                    })
              }
            />
          )}
          isOptionEqualToValue={(option, val) => option.id === val.id}
          loading={isSubmitting}
          disabled={isSubmitting}
          slotProps={{
            popper: {
              placement: "bottom-start" as const,
              modifiers: [{ name: "flip", enabled: false }],
              style: { zIndex: 100000002 },
            },
            paper: {
              style: {
                maxHeight: "min(50vh, 280px)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              },
            },
            listbox: {
              style: { overflow: "auto", flex: "1 1 auto" },
            },
          }}
        />
      </div>
    </AccountTabShell>
  );
}
