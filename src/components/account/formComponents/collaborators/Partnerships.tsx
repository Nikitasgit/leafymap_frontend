import React from "react";
import SearchInput from "@/components/common/inputs/searchInput/SearchInput";
import { Collaborator } from "@/types/place/collaborators";
import { useFindCreators } from "@/hooks/useFindCreators";
import styles from "./Partnerships.module.scss";
import InfoIcon from "@/components/common/info/InfoIcon";
import Text from "@/components/common/typography/Text";
import { Delete, Users } from "lucide-react";
import { generateTempId, isTempId } from "@/utils/tempId";
import { Partnership } from "@/types/partnerships";
import Image from "next/image";
import Button from "@/components/common/buttons/button/Button";
import { useTranslation } from "next-i18next";
import { useToast } from "@/hooks/useToast";

const Partnerships = ({
  onChange,
  partnerships,
}: {
  onChange: (partnerships: Partnership[]) => void;
  partnerships: Partnership[];
}) => {
  const { searchCreators } = useFindCreators();

  const fetchSuggestions = async (query: string) => {
    const users = await searchCreators(query);
    return users.map((user) => ({
      _id: user._id,
      image: typeof user.image === "string" ? user.image : user.image?.url,
      name: user.creatorName,
      categories: user.creatorCategories?.map((category) => ({
        name: category,
      })),
    }));
  };
  const { showError } = useToast();

  const filteredPartnerships = partnerships.filter(
    (partnership) => !partnership.deleted
  );
  const { t } = useTranslation();

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
    <div className={styles.partnerships}>
      <div className={styles.titleContainer}>
        <h3 className={styles.title}>Partenaires</h3>
        <InfoIcon
          tooltip="Ajoutez des artistes ou créez un profil provisoire pour des créateurs ou producteurs qui apparaîtront sur votre profil comme des collaborateurs de votre lieu."
          place="right"
        />
      </div>
      <div className={styles.searchContainer}>
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <div className={styles.headerContent}>
              <Text className={styles.label}>
                <Users
                  size={20}
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Ajouter un partenaire
              </Text>
              <Text className={styles.info}>
                Vous pouvez rechercher des profils de collaborateurs enregistrés
                sur notre plateforme.
              </Text>
            </div>
          </div>
        </div>
        <div className={styles.searchInputContainer}>
          <SearchInput
            label="Ajouter un partenaire"
            onSelect={handleSelect}
            fetchSuggestions={fetchSuggestions}
            initialSuggestions={[]}
            placeholder="Ajouter un partenaire..."
            withIcons
          />
        </div>
      </div>
      <div className={styles.list}>
        {filteredPartnerships.length > 0 ? (
          filteredPartnerships.map((partnership) => {
            const id = partnership._id;
            return (
              <div key={id} className={styles.item}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemInfoLeft}>
                    <Image
                      src={
                        partnership.collaborator.image ||
                        "https://i.pravatar.cc/40?img=3"
                      }
                      alt={partnership.collaborator.name || ""}
                      width={32}
                      height={32}
                      className={styles.itemImage}
                    />

                    <span className={styles.itemName}>
                      {partnership.collaborator.name}
                    </span>
                  </div>
                  <span
                    className={`${styles.itemStatus} ${
                      styles[partnership.status]
                    }`}
                  >
                    {t(`partnershipStatus.${partnership.status}`)}
                  </span>
                </div>

                <Button
                  onClick={() => handleDelete(partnership)}
                  variant="simple"
                  size="small"
                >
                  <Delete size={16} />
                </Button>
              </div>
            );
          })
        ) : (
          <div className={styles.emptyState}>Aucun partenaire ajouté</div>
        )}
      </div>
    </div>
  );
};

export default Partnerships;
