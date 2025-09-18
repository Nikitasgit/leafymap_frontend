"use client";

import React from "react";
import styles from "./TabsContainer.module.scss";

interface TabsContainerProps {
  children: React.ReactNode;
}

export default function TabsContainer({ children }: TabsContainerProps) {
  return <div className={styles.tabs}>{children}</div>;
}
