import { createContext, useState } from "react";

const initialValue = {
  walletAddress: 0,
};

export const appContext = createContext(initialValue);

export function AppContextProvider({ children }) {
  const [value, setValue] = useState(initialValue);

  const ContextProvider = appContext.Provider;

  return (
    <ContextProvider
      value={{
        appContext: value,
        setValue,
      }}
    >
      {children}
    </ContextProvider>
  );
}
