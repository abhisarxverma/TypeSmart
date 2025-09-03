import { useGetLibraryQuery } from "@/Hooks/useBackend";
import { LibraryContext } from "@/Hooks/useLibrary";
import type React from "react";

export default function LibraryProvider({ children } : {children: React.ReactNode }) {

    const { library, isFetchingLibrary } = useGetLibraryQuery();

    console.log("Library : ", library);

    return (
        <LibraryContext.Provider value={{ library, isFetchingLibrary }}>
            {children}
        </LibraryContext.Provider>
    )

}