import Button from "@/components/common/buttons/button/Button";
import CategorySelectorInput from "@/components/common/inputs/categorySelectorInput/CategorySelectorInput";
import TextField from "@/components/common/inputs/textField/TextField";
import { useState } from "react";
import styles from "./CreateCollaborators.module.scss";
import {
  FormDataChangeHandler,
  NewProfileFormData,
  PlaceFormData,
} from "../../createProfileStepper/CreateProfileStepper.types";
import { selectSubCategories } from "@/store/appSlice";
import { useSelector } from "react-redux";
import { DeleteIcon, PlusCircle, Users } from "lucide-react";
import { EventFormData } from "@/components/events/form/EventForm";
import { CreatedCollaborator } from "@/types/place/collaborators";
import Text from "@/components/common/typography/Text";

const CreateCollaborators = ({
  onChange,
  data: formData,
}: {
  onChange: FormDataChangeHandler;
  data: EventFormData | NewProfileFormData | PlaceFormData;
}) => {
  const subCategories = useSelector(selectSubCategories);

  const [collaborator, setCollaborator] = useState<CreatedCollaborator>({
    name: "",
    categoryId: "",
    id: "",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = collaborator.name.trim() && collaborator.categoryId;

  const handleSubmitCollaborator = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    onChange({
      target: {
        name: "createdCollaborators",
        value: [
          ...formData.createdCollaborators,
          { ...collaborator, id: tempId },
        ],
      },
    });

    setIsCreating(false);
    setIsSubmitting(false);
    setCollaborator({
      name: "",
      categoryId: "",
      id: "",
    });
  };

  const addCollaborator = () => {
    setIsCreating(!isCreating);
    setCollaborator({
      name: "",
      categoryId: "",
      id: "",
    });
  };

  const handleChange: FormDataChangeHandler = (e) => {
    setCollaborator({
      ...collaborator,
      [e.target.name]: e.target.value,
    });
  };

  const handleDeleteCollaborator = (id: string) => {
    onChange({
      target: {
        name: "createdCollaborators",
        value: formData.createdCollaborators.filter(
          (collab) => collab.id !== id
        ),
      },
    });
  };

  return (
    <div className={styles.createCollaborators}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <Text className={styles.label}>
            <Users
              size={20}
              style={{ marginRight: "8px", verticalAlign: "middle" }}
            />
            Créer un collaborateur
          </Text>
          <Button
            variant="outline"
            endIcon={<PlusCircle size={17} />}
            onClick={addCollaborator}
          >
            {isCreating ? "Annuler" : "Créer un collaborateur"}
          </Button>
        </div>
        <Text className={styles.info}>
          Si votre collaborateur n&apos;existe pas encore sur notre plateforme
          vous pouvez créer un profil provisoire pour afficher son nom sur le
          profil de votre lieu.
        </Text>
      </div>

      {isCreating && (
        <div className={styles.formContainer}>
          <div className={styles.formFields}>
            <TextField
              label="Nom du collaborateur"
              placeholder="ex: Vincent Van Gogh"
              value={collaborator.name}
              onChange={handleChange}
              name="name"
              required
            />
            <CategorySelectorInput
              onChange={(e) => {
                handleChange({
                  target: {
                    name: "categoryId",
                    value: e.target.value,
                  },
                });
              }}
              value={collaborator.categoryId}
            />
            <Button
              onClick={handleSubmitCollaborator}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting ? "Création..." : "Créer"}
            </Button>
          </div>
        </div>
      )}

      <ul className={styles.collaboratorsList}>
        {formData.createdCollaborators.length === 0 && !isCreating && (
          <div className={styles.emptyState}>Aucun collaborateur créé</div>
        )}

        {formData.createdCollaborators.map((collaborator) => (
          <li key={collaborator.id} className={styles.collaboratorItem}>
            <div className={styles.collaboratorInfo}>
              <span>{collaborator.name}</span>
              <span className={styles.categoryName}>
                {
                  subCategories.find(
                    (sub) => sub._id === collaborator.categoryId
                  )?.name
                }
              </span>
            </div>
            <Button
              variant="simple"
              onClick={() => handleDeleteCollaborator(collaborator.id)}
            >
              <DeleteIcon size={16} />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CreateCollaborators;
