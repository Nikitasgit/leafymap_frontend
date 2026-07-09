"use client";
import { Collaborator } from "@/types/place/collaborators";
import styles from "./PartnershipsForm.module.scss";
import Tooltip from "@/components/common/Tooltip";
import { Users } from "lucide-react";
import { generateTempId, isTempId } from "@/utils/tempId";
import { Partnership } from "@/types/partnerships";
import { useToast } from "@/hooks/useToast";
import { useFindUsers } from "@/hooks/useFindUsers";
import { useAuth } from "@/hooks/useAuth";
import PartnershipsFormList from "../PartnershipsFormList";
import { SearchInput } from "@/components/common/inputs/SearchInput";
import { useTranslation } from "react-i18next";

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
    if (user?._id) {
      searchParams.excludeIds = [user._id];
    }

    const users = await searchUsers(searchParams);
    const suggestions = users.map((user) => ({
      _id: user._id,
      image:
        (typeof user.image === "object"
          ? user.image?.urls?.thumbnail
          : user.image) || user.googlePictureUrl,
      name: user.username,
      categories: user.userCategory ? [{ name: user.userCategory.name }] : [],
    }));
    return suggestions;
  };

  const handleSelect = (suggestion: Collaborator) => {
    const existingPartnership = partnerships.find(
      (partnership) => partnership.collaborator._id === suggestion._id
    );
    if (existingPartnership) {
      if (existingPartnership.deleted) {
        const updatedPartnership: Partnership = {
          ...existingPartnership,
          deleted: false,
        };
        onChange(
          partnerships.map((p) =>
            p._id === existingPartnership._id ? updatedPartnership : p
          )
        );
      } else {
        showError(t("partnershipsForm.alreadyAddedError"));
        return;
      }
    } else {
      const newPartnership: Partnership = {
        _id: generateTempId(),
        collaborator: {
          _id: suggestion._id,
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
    if (isTempId(partnership._id)) {
      const newPartnerships = partnerships.filter(
        (p) => p._id !== partnership._id
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
        p._id === partnership._id ? updatedPartnership : p
      )
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
          <p className={styles.info}>
            {t("partnershipsForm.addPartnerInfo")}
          </p>
        </div>
        <div className={styles.searchInputContainer}>
          <SearchInput
            label={t("partnershipsForm.searchLabel")}
            onSelect={handleSelect}
            fetchSuggestions={fetchSuggestions}
            placeholder={t("partnershipsForm.searchPlaceholder")}
            withIcons
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
