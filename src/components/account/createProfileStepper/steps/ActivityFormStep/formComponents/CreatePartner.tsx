import Button from "@/components/common/buttons/button/Button";
import CategorySelectorInput from "@/components/common/inputs/categorySelectorInput/CategorySelectorInput";
import TextField from "@/components/common/inputs/textField/TextField";
import { useState } from "react";
import {
  CreatedCollaborator,
  FormData,
  FormDataChangeHandler,
} from "../../../CreateProfileStepper.types";
import { selectSubCategories } from "@/store/appSlice";
import { useSelector } from "react-redux";
import { DeleteIcon } from "lucide-react";

const CreatePartners = ({
  onChange,
  data: formData,
}: {
  onChange: FormDataChangeHandler;
  data: FormData;
}) => {
  const subCategories = useSelector(selectSubCategories);

  const [collaborator, setCollaborator] = useState<CreatedCollaborator>({
    name: "",
    category: "",
    id: "",
  });

  const [isCreating, setIsCreating] = useState(false);
  const handleSubmitCollaborator = () => {
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
    setCollaborator({
      name: "",
      category: "",
      id: "",
    });
  };
  const addCollaborator = () => {
    setIsCreating(true);
    setCollaborator({
      name: "",
      category: "",
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
    <>
      <Button onClick={addCollaborator}>Créer un collaborateur</Button>
      {isCreating && (
        <div>
          <TextField
            placeholder="Nom du collaborateur"
            value={collaborator.name}
            onChange={handleChange}
            name="name"
          />
          <CategorySelectorInput
            onChange={handleChange}
            value={collaborator.category}
          />
          <Button onClick={handleSubmitCollaborator}>Créer</Button>
        </div>
      )}
      <ul>
        {formData.createdCollaborators.map((collaborator) => (
          <li key={collaborator.id}>
            {collaborator.name} -
            {
              subCategories.find((sub) => sub._id === collaborator.category)
                ?.name
            }
            <DeleteIcon
              onClick={() => handleDeleteCollaborator(collaborator.id)}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default CreatePartners;
