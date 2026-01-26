"use client";

import React from "react";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import ConversationContainer from "@/components/messages/ConversationContainer";

interface PageProps {
  params: Promise<{
    conversationId: string;
    locale: string;
  }>;
}

const ConversationPage: React.FC<PageProps> = ({ params }) => {
  const { conversationId } = React.use(params);

  return (
    <ProtectedRoute
      allowedUserTypes={["guest", "creator", "organizer"]}
      redirectTo="/"
    >
      <ConversationContainer
        conversationId={conversationId}
      ></ConversationContainer>
    </ProtectedRoute>
  );
};

export default ConversationPage;
