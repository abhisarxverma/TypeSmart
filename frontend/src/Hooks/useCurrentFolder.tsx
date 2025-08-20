import { type Folder } from "@/Types/Library";
import React, { createContext, useContext } from "react";

interface CurrentFolderContextType {
    currentFolder: Folder | null
    setCurrentFolder: React.Dispatch<React.SetStateAction<Folder | null>>
}

export const CurrentFolderContext = createContext<CurrentFolderContextType | null>(null);

export const useCurrentFolder = () => {
    const ctx = useContext(CurrentFolderContext);
    if (!ctx) {
        throw new Error("Current folder context must be used CurrentFolderProvider.")
    }
    return ctx ;
}