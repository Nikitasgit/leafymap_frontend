"use client";
import { Collaborator } from "@/features/places/types/collaborators";
import styles from "./PartnershipsForm.module.scss";
import Tooltip from "@/shared/ui/tooltip";
import { Users } from "lucide-react";
import { generateTempId, isTempId } from "@/shared/utils/tempId";
import type { Partnership } from "../../types";
import { useToast } from "@/shared/hooks/useToast";
import { useFindUsers } from "@/features/users/hooks/useFindUsers";
import CreatorCategoryBadge from "@/features/users/components/creatorCategoryBadge";
import { useAuth } from "@/features/auth";
import PartnershipsFormList from "../partnershipsFormList";
import { SearchInput } from "@/shared/ui/inputs/searchInput";
import { useTranslation } from "react-i18next";
import { resolveRefObject } from "@/shared/api/normalizers/resolveRef";

const PartnershipsForm = ({
  onChange,
  partnerships,
}: {
  onChange: (partnerships: Partnership[]) => void;
  partnerships: Partnership[];
}) => {
  const { searchUsers } = useFindUsers();
  const { showError } = useToast();
  const { user } = useAuth();
  const { t } = useTranslation("account");

  const fetchSuggestions = async (query: string) => {
    const searchParams: Record<string, string | string[]> = {
      username: query,
    };
    if (user?.id) {
      searchParams.excludeIds = [user.id];
    }

    const users = (await searchUsers(searchParams)) ?? [];
    const suggestions = users.map((user) => ({
      id: user.id,
      image:
        (resolveRefObject(user.image)?.urls?.thumbnail ??
          (typeof user.image === "string" ? user.image : undefined)) ||
        user.googlePictureUrl,
      name: user.username,
      categories: user.userCategory ? [{ name: user.userCategory.name }] : [],
    }));
    return suggestions;
  };

  const handleSelect = (suggestion: Collaborator) => {
    const existingPartnership = partnerships.find(
      (partnership) => partnership.collaborator.id === suggestion.id,
    );
    if (existingPartnership) {
      if (existingPartnership.deleted) {
        const updatedPartnership: Partnership = {
          ...existingPartnership,
          deleted: false,
        };
        onChange(
          partnerships.map((p) =>
            p.id === existingPartnership.id ? updatedPartnership : p,
          ),
        );
      } else {
        showError(t("partnershipsForm.alreadyAddedError"));
        return;
      }
    } else {
      const newPartnership: Partnership = {
        id: generateTempId(),
        collaborator: {
          id: suggestion.id,
          username: suggestion.name || "",
          image: suggestion.image,
        },
        status: "pending",
        initiator: undefined,
      };
      onChange([...partnerships, newPartnership]);
    }
  };

  const handleDelete = (partnership: Partnership) => {
    if (isTempId(partnership.id)) {
      const newPartnerships = partnerships.filter(
        (p) => p.id !== partnership.id,
      );
      onChange(newPartnerships);
      return;
    }
    const updatedPartnership = {
      ...partnership,
      deleted: true,
    };
    onChange(
      partnerships.map((p) =>
        p.id === partnership.id ? updatedPartnership : p,
      ),
    );
  };
  return (
    <fieldset className={styles.partnerships}>
      <legend className={styles.titleContainer}>
        <span className={styles.title}>{t("partnershipsForm.title")}</span>
        <Tooltip
          tooltip={t("partnershipsForm.tooltip")}
          place="top-right"
          maxWidth={300}
        />
      </legend>
      <div className={styles.searchContainer}>
        <div className={styles.header}>
          <p className={styles.label}>
            <Users
              size={20}
              style={{ marginRight: "8px", verticalAlign: "middle" }}
            />
            {t("partnershipsForm.addPartnerLabel")}
          </p>
          <p className={styles.info}>{t("partnershipsForm.addPartnerInfo")}</p>
        </div>
        <div className={styles.searchInputContainer}>
          <SearchInput
            label={t("partnershipsForm.searchLabel")}
            onSelect={handleSelect}
            fetchSuggestions={fetchSuggestions}
            placeholder={t("partnershipsForm.searchPlaceholder")}
            withIcons
            renderCategoryBadge={(name) => (
              <CreatorCategoryBadge categoryName={name} />
            )}
          />
        </div>
      </div>
      <PartnershipsFormList
        partnerships={partnerships}
        onDelete={handleDelete}
      />
    </fieldset>
  );
};

export default PartnershipsForm;
