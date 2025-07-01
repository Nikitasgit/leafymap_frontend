"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import LoadingBar from "./LoadingBar";

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoading: <T>(asyncFunction: () => Promise<T>) => Promise<T>;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const useGlobalLoading = () => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useGlobalLoading must be used within a LoadingProvider");
  }
  return context;
};

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = useCallback(
    async <T,>(asyncFunction: () => Promise<T>): Promise<T> => {
      try {
        startLoading();
        const result = await asyncFunction();
        return result;
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  const value = {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {isLoading && <LoadingBar />}
      {children}
    </LoadingContext.Provider>
  );
};
