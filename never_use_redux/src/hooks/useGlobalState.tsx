"use client";

import { GlobalStateContext } from "@/providers/GlobalStateProvider";
import { useContext } from "react";

const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a ContextProvider");
  }
  return context;
};

export default useGlobalState;
