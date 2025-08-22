import { type Library } from "@/Types/Library";
import { createContext, useContext } from "react";

interface LibraryContextType {
    library: Library,
    isFetchingLibrary: boolean
}

export const LibraryContext = createContext<LibraryContextType | null>(null);

export const useLibrary = () => {
    const ctx = useContext(LibraryContext);
    if (!ctx) {
        throw new Error("Current folder context must be used LibraryProvider.")
    }
    return ctx ;
}