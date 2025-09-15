"use client";
import LoadingBar from "@/components/common/loading/LoadingBar";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import React from "react";
import Text from "@/components/common/typography/Text";

const UserPage = () => {
  const { userId } = useParams();

  const { user, isLoading } = useUser(userId as string);

  if (isLoading) return <LoadingBar />;
  return (
    <div>
      <Text as="h1">
        {user?.username}
      </Text>
    </div>
  );
};

export default UserPage;
