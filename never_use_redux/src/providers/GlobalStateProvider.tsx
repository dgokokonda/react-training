"use client";

import { User } from "@/types";
import { createContext, Dispatch, SetStateAction, useState } from "react";

type GlobalStateContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
};

export const GlobalStateContext = createContext<
  GlobalStateContextType | undefined
>(undefined);

function GlobalStateProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const contextValue = { user, setUser };

  return (
    <GlobalStateContext.Provider value={contextValue}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export default GlobalStateProvider;
