import Button from "@/components/common/buttons/button/Button";
import CategorySelectorInput from "@/components/common/inputs/categorySelectorInput/CategorySelectorInput";
import TextField from "@/components/common/inputs/textField/TextField";
import { useState } from "react";
import { FormDataChangeHandler } from "../../../CreateProfileStepper.types";
import { FormData } from "../../../CreateProfileStepper.types";

export type Collaborator = {
  name: string;
  category: string;
  id?: string;
};

const CreatePartners = ({
  onChange,
  data: formData,
}: {
  onChange: FormDataChangeHandler;
  data: FormData;
}) => {
  const [collaborator, setCollaborator] = useState<Collaborator>({
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
    });
  };
  const addCollaborator = () => {
    setIsCreating(true);
    setCollaborator({
      name: "",
      category: "",
    });
  };
  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { target: { name: string; value: string } }
  ) => {
    setCollaborator({
      ...collaborator,
      [e.target.name]: e.target.value,
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
          <CategorySelectorInput onChange={handleChange} />
          <Button onClick={handleSubmitCollaborator}>Créer</Button>
        </div>
      )}
      <ul>
        {formData.createdCollaborators.map((collaborator) => (
          <li key={collaborator.id}>
            {collaborator.name}
            {collaborator.category}
          </li>
        ))}
      </ul>
    </>
  );
};

export default CreatePartners;
