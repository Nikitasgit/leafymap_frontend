"use client";

import React, { useMemo } from "react";
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
import LoadingBar from "@/components/common/loading/LoadingBar/LoadingBar";
import { Product, ProductCategory } from "@/types/product";
import styles from "./MyProductsTab.module.scss";

const MAX_PRODUCTS_PER_USER = 10;

export default function MyProductsTab() {
  const { t } = useTranslation("common");
  const { user, isLoading: isLoadingUser } = useCurrentUser();
  const { productCategories, loading: isLoadingCategories } = useApp();
  const {
    products,
    isLoading: isLoadingProducts,
    refetch,
  } = useUserProducts(user?._id);
  const { createProduct, deleteProduct, isLoading: isSubmitting } =
    useSubmitProduct();
  const { showError } = useToast();
  const atLimit = products.length >= MAX_PRODUCTS_PER_USER;

  const getCategoryGroupName = (option: ProductCategory): string => {
    const cat = option.category;
    if (!cat || typeof cat !== "object") return "";
    const name = (cat as { name?: string }).name ?? "";
    return name ? t(`placeTypes.${name}`, name) : "";
  };

  const options = useMemo(
    () =>
      productCategories.slice().sort((a, b) => {
        const ga = getCategoryGroupName(a);
        const gb = getCategoryGroupName(b);
        if (ga !== gb) return ga.localeCompare(gb);
        return (a.name ?? "").localeCompare(b.name ?? "");
      }),
    [productCategories, t]
  );

  const value = useMemo(() => {
    return products
      .map((p) => {
        const id =
          typeof p.productCategory === "object" && p.productCategory
            ? (p.productCategory as ProductCategory)._id
            : (p.productCategory as string);
        return productCategories.find((c) => c._id === id);
      })
      .filter((c): c is ProductCategory => c != null);
  }, [products, productCategories]);

  const handleChange = async (
    _: React.SyntheticEvent,
    newValue: ProductCategory[]
  ) => {
    if (!user) return;
    const prevIds = new Set(value.map((c) => c._id));
    const nextIds = new Set(newValue.map((c) => c._id));

    for (const cat of newValue) {
      if (!prevIds.has(cat._id)) {
        if (atLimit) {
          showError(
            `Vous ne pouvez pas ajouter plus de ${MAX_PRODUCTS_PER_USER} produits.`
          );
          return;
        }
        const ok = await createProduct({ productCategory: cat._id });
        if (ok) await refetch();
        return;
      }
    }
    for (const cat of value) {
      if (!nextIds.has(cat._id)) {
        const product = products.find((p) => {
          const id =
            typeof p.productCategory === "object" && p.productCategory
              ? (p.productCategory as ProductCategory)._id
              : (p.productCategory as string);
          return id === cat._id;
        });
        if (product) {
          const ok = await deleteProduct(product._id);
          if (ok) await refetch();
        }
        return;
      }
    }
  };

  if (isLoadingUser || isLoadingProducts || isLoadingCategories) {
    return <LoadingBar />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.myProductsTab}>
      <div className={styles.headerSection}>
        <div className={styles.header}>
          <p className={styles.label}>
            <Package size={20} className={styles.icon} />
            Mes produits
          </p>
          <p className={styles.info}>
            Les catégories de produits que vous proposez, affichées sur votre
            profil.
          </p>
        </div>
      </div>

      <div className={styles.autocompleteWrap}>
        <Autocomplete
          multiple
          value={value}
          onChange={handleChange}
          options={options}
          getOptionLabel={(option) =>
            option.name
              ? t(`productCategories.${option.name}`, option.name)
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
              label="Catégories de produits"
              placeholder={
                atLimit
                  ? "Limite atteinte (10/10)"
                  : "Ajouter une catégorie..."
              }
              helperText={
                atLimit
                  ? "Vous avez atteint la limite de 10 produits. Supprimez-en un pour en ajouter un autre."
                  : `Maximum ${MAX_PRODUCTS_PER_USER} produits`
              }
            />
          )}
          isOptionEqualToValue={(option, val) => option._id === val._id}
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
    </div>
  );
}
