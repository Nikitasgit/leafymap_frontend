import React from "react";
import SearchInput, {
  Suggestion,
} from "@/components/common/inputs/searchInput/SearhInput";
import Image from "next/image";
import { FormDataChangeHandler } from "../../../CreateProfileStepper.types";
import { FormData } from "../../../CreateProfileStepper.types";
import CreatePartners from "./CreatePartner";

interface User {
  id: string;
  name: string;
  avatar: string;
}

const fakeUsers: User[] = [
  { id: "1", name: "Alice Dupont", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: "2", name: "Bob Martin", avatar: "https://i.pravatar.cc/40?img=2" },
  {
    id: "3",
    name: "Charlie Leblanc",
    avatar: "https://i.pravatar.cc/40?img=3",
  },
];

const searchUsers = async (query: string) => {
  if (!query) return [];
  const filteredUsers = fakeUsers.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase())
  );
  return filteredUsers.map((user) => ({
    id: user.id,
    label: user.name,
    icon: (
      <Image
        src={user.avatar}
        alt={user.name}
        width={30}
        height={30}
        style={{ borderRadius: "50%" }}
      />
    ),
  }));
};

const initialUserSuggestions = fakeUsers.map((user) => ({
  id: user.id,
  label: user.name,
  icon: (
    <Image
      src={user.avatar}
      alt={user.name}
      width={30}
      height={30}
      style={{ borderRadius: "50%" }}
    />
  ),
}));

const Partners = ({
  onChange,
  data,
}: {
  onChange: FormDataChangeHandler;
  data: FormData;
}) => {
  const handleSelect = (suggestion: Suggestion) => {
    onChange({
      target: {
        name: "collaborators",
        value: [...data.collaborators, suggestion.id],
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
      />
      <CreatePartners onChange={onChange} data={data} />
    </div>
  );
};

export default Partners;
