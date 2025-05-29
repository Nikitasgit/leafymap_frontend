import React from "react";
import SearchInput, {
  Suggestion,
} from "@/components/common/inputs/searchInput/SearhInput";
import Image from "next/image";
import { FormDataChangeHandler } from "../../../CreateProfileStepper.types";
import { FormData } from "../../../CreateProfileStepper.types";
import CreatePartners from "./CreatePartner";
import axios from "axios";
import { Creator } from "@/types/user";

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
      id: user._id,
      label: user.creatorProfile?.name,
      icon: (
        <Image
          src={user.userImg || "https://i.pravatar.cc/40?img=3"}
          alt={user.creatorProfile?.name}
          width={30}
          height={30}
          style={{ borderRadius: "50%" }}
        />
      ),
    }));
  } catch (err) {
    console.error("Error searching users:", err);
    return [];
  }
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
