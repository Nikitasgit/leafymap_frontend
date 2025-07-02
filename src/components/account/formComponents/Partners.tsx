import React from "react";
import SearchInput from "@/components/common/inputs/searchInput/SearchInput";
import { FormDataChangeHandler } from "../createProfileStepper/CreateProfileStepper.types";
import { Collaborator } from "@/types/place/collaborators";
import CreatePartners from "./CreatePartner";
import { EventFormData } from "@/components/events/form/EventForm";
import { useFindCreators } from "@/hooks/useFindCreators";

const fakeUsers = [
  { id: "1", name: "Alice Dupont", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: "2", name: "Bob Martin", avatar: "https://i.pravatar.cc/40?img=2" },
  {
    id: "3",
    name: "Charlie Leblanc",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
];

const initialUserSuggestions = fakeUsers.map((user) => ({
  _id: user.id,
  name: user.name,
  image: user.avatar,
}));

const Partners = ({
  onChange,
  data,
}: {
  onChange: FormDataChangeHandler;
  data: EventFormData;
}) => {
  const { searchCreators } = useFindCreators();
  const collaborators = (data.collaborators || []) as Collaborator[];

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
    <div style={{ position: "relative", width: "300px" }}>
      <SearchInput
        onSelect={handleSelect}
        fetchSuggestions={searchCreators}
        initialSuggestions={initialUserSuggestions}
        placeholder="Ajouter un utilisateur..."
        withIcons
        list={collaborators}
        onDelete={handleDelete}
        displayList
      />
      <CreatePartners onChange={onChange} data={data} />
    </div>
  );
};

export default Partners;
