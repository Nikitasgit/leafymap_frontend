import React from "react";
import SearchInput from "@/components/common/inputs/searchInput/SearchInput";
import {
  FormData,
  FormDataChangeHandler,
  Collaborator,
} from "../../../CreateProfileStepper.types";
import CreatePartners from "./CreatePartner";
import axios from "axios";
import { Creator } from "@/types/user";
import { EventFormData } from "@/components/events/form/EventForm";

const fakeUsers = [
  { id: "1", name: "Alice Dupont", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: "2", name: "Bob Martin", avatar: "https://i.pravatar.cc/40?img=2" },
  {
    id: "3",
    name: "Charlie Leblanc",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
];

const searchUsers = async (query: string) => {
  if (!query || query.length < 2) return [];
  try {
    const res = await axios.get(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/users/find-users?name=${encodeURIComponent(query)}&limit=5`
    );
    const data = res.data;
    return data.users.map((user: Creator) => ({
      _id: user._id,
      username: user.creatorProfile?.name,
      image: user.image || "https://i.pravatar.cc/40?img=3",
    }));
  } catch (err) {
    console.error("Error searching users:", err);
    return [];
  }
};

const initialUserSuggestions = fakeUsers.map((user) => ({
  _id: user.id,
  username: user.name,
  image: user.avatar,
}));

const Partners = ({
  onChange,
  data,
}: {
  onChange: FormDataChangeHandler;
  data: FormData | EventFormData;
}) => {
  const collaborators = (data.collaborators || []) as Collaborator[];

  const handleSelect = (suggestion: Collaborator) => {
    const newCollaborator: Collaborator = {
      _id: suggestion._id,
      username: suggestion.username || "",
      image: suggestion.image || "",
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
        fetchSuggestions={searchUsers}
        initialSuggestions={initialUserSuggestions}
        placeholder="Ajouter un utilisateur..."
        withIcons
        list={collaborators}
        onDelete={handleDelete}
        displayList
      />
      <CreatePartners onChange={onChange} data={data as FormData} />
    </div>
  );
};

export default Partners;
