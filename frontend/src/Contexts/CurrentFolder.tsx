import { CurrentFolderContext } from "@/Hooks/useCurrentFolder";
import type { Folder } from "@/Types/Library";
import type React from "react";
import { useState } from "react";

export default function CurrentFolderProvider({ children } : {children: React.ReactNode}) {
    const [ currentFolder, setCurrentFolder ] = useState<Folder | null>(null);

    return (
        <CurrentFolderContext.Provider value={{ currentFolder, setCurrentFolder }}>
            {children}
        </CurrentFolderContext.Provider>
    )

}