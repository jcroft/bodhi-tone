import React, { createContext, useContext, useState, ReactNode } from "react";

export type ModuleContextType = {
  name: string;
  color: string;
  classNames?: string;
};

export const defaultModuleContext: ModuleContextType = {
  name: "Init Module",
  color: "#ff5500",
};

const ModuleContext = createContext<ModuleContextType | undefined>(
  defaultModuleContext
);

export const ModuleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [module, setModule] = useState<ModuleContextType>(defaultModuleContext);

  return (
    <ModuleContext.Provider value={module}>{children}</ModuleContext.Provider>
  );
};

export const useModule = (): ModuleContextType => {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error("useModule must be used within a ModuleProvider");
  }
  return context;
};
