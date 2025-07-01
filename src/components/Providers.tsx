"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import UserInitializer from "./initializers/UserInitializer";
import AppInitializer from "./initializers/AppInitializer";
import { Toaster } from "sonner";
import { LoadingProvider } from "./common/loading/LoadingProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LoadingProvider>
        <UserInitializer />
        <AppInitializer />
        {children}
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          duration={3000}
          theme="light"
          expand={false}
          className="custom-toaster"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#3a3a3a",
              border: "1px solid #e1e1e1",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              fontSize: "14px",
              fontWeight: "500",
              padding: "12px 16px",
              maxWidth: "320px",
            },
          }}
        />
      </LoadingProvider>
    </Provider>
  );
}
