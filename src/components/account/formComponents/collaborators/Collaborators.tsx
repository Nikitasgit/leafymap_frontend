import React from "react";
import SearchInput from "@/components/common/inputs/searchInput/SearchInput";
import {
  FormDataChangeHandler,
  NewProfileFormData,
  PlaceFormData,
} from "../../createProfileStepper/CreateProfileStepper.types";
import { Collaborator } from "@/types/place/collaborators";
import CreateCollaborators from "../createCollaborators/CreateCollaborators";
import { EventFormData } from "@/components/events/form/EventForm/EventForm";
import { useFindCreators } from "@/hooks/useFindCreators";
import styles from "./Collaborators.module.scss";
import InfoIcon from "@/components/common/info/InfoIcon";
import Text from "@/components/common/typography/Text";
import { Users } from "lucide-react";

const Collaborators = ({
  onChange,
  data,
}: {
  onChange: FormDataChangeHandler;
  data: EventFormData | PlaceFormData | NewProfileFormData;
}) => {
  const { searchCreators } = useFindCreators();
  const collaborators = data.collaborators;

  const handleSelect = (suggestion: Collaborator) => {
    const newCollaborator: Collaborator = {
      _id: suggestion._id,
      name: suggestion.name || "",
      image: suggestion.image || "",
      status: "pending",
    };
    onChange({
      target: {
        name: "collaborators",
        value: [...collaborators, newCollaborator],
      },
    });
  };

  const handleDelete = (id: string) => {
    onChange({
      target: {
        name: "collaborators",
        value: collaborators.filter((collaborator) => collaborator._id !== id),
      },
    });
  };

  return (
    <div className={styles.collaborators}>
      <div className={styles.titleContainer}>
        <h3 className={styles.title}>Collaborateurs</h3>
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
                Ajouter un collaborateur
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
            label="Ajouter un collaborateur"
            onSelect={handleSelect}
            fetchSuggestions={searchCreators}
            initialSuggestions={[]}
            placeholder="Ajouter un utilisateur..."
            withIcons
            list={collaborators}
            onDelete={handleDelete}
            displayList
          />
        </div>
      </div>
      <CreateCollaborators onChange={onChange} data={data} />
    </div>
  );
};

export default Collaborators;
