"use client";

import { Provider } from "react-redux";
import { store } from "@/store";
import UserInitializer from "./initializers/UserInitializer";
import AppInitializer from "./initializers/AppInitializer";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <UserInitializer />
      <AppInitializer />
      {children}
    </Provider>
  );
}
