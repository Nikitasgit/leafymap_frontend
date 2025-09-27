"use client";
import { Collaborator } from "@/types/place/collaborators";
import styles from "./PartnershipsForm.module.scss";
import Tooltip from "@/components/common/Tooltip/Tooltip";
import { Users } from "lucide-react";
import { generateTempId, isTempId } from "@/utils/tempId";
import { Partnership } from "@/types/partnerships";
import { useToast } from "@/hooks/useToast";
import { useFindUsers } from "@/hooks/useFindUsers";
import PartnershipsFormList from "../PartnershipsFormList";
import { SearchInput } from "@/components/common/inputs/searchInput";

const PartnershipsForm = ({
  onChange,
  partnerships,
}: {
  onChange: (partnerships: Partnership[]) => void;
  partnerships: Partnership[];
}) => {
  const { searchUsers } = useFindUsers();
  const { showError } = useToast();

  const fetchSuggestions = async (query: string) => {
    const users = await searchUsers({ creatorName: query });
    const suggestions = users.map((user) => ({
      _id: user._id,
      image: user.image?.urls.thumbnail,
      name: user.creatorName,
      categories: user.creatorCategories?.map((category) => ({
        name: category.name,
      })),
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
        showError("Ce collaborateur est déjà ajouté");
        return;
      }
    } else {
      const newPartnership: Partnership = {
        _id: generateTempId(),
        collaborator: {
          _id: suggestion._id,
          name: suggestion.name || "",
          image: suggestion.image as string,
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
        <span className={styles.title}>Partenaires</span>
        <Tooltip
          tooltip="Ajoutez des artistes ou créez un profil provisoire pour des créateurs ou producteurs qui apparaîtront sur votre profil comme des partenaires de votre lieu."
          place="right"
        />
      </legend>
      <div className={styles.searchContainer}>
        <div className={styles.header}>
          <p className={styles.label}>
            <Users
              size={20}
              style={{ marginRight: "8px", verticalAlign: "middle" }}
            />
            Ajouter un partenaire
          </p>
          <p className={styles.info}>
            Vous pouvez rechercher des profils de partenaires enregistrés sur
            notre plateforme.
          </p>
        </div>
        <div className={styles.searchInputContainer}>
          <SearchInput
            label="Ajouter un partenaire"
            onSelect={handleSelect}
            fetchSuggestions={fetchSuggestions}
            placeholder="Ajouter un partenaire..."
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
