import { type Library } from "@/Types/Library";
import { createContext, useContext } from "react";

interface LibraryContextType {
    library: Library,
    setLibrary: React.Dispatch<React.SetStateAction<Library>> | undefined
    isFetchingLibrary: boolean
}

export const LibraryContext = createContext<LibraryContextType | null>(null);

export const useLibrary = () => {
    const ctx = useContext(LibraryContext);
    if (!ctx) {
        throw new Error("Library context must be used LibraryProvider.")
    }
    return ctx ;
}