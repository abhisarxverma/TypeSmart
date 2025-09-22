import { useGetLibraryQuery } from "@/Hooks/useBackend";
import { LibraryContext } from "@/Hooks/useLibrary";
import { useMode } from "@/Hooks/useMode";
import type React from "react";
import { DEMO_LIBRARY } from "@/Data/DemoLibraryData";

export default function LibraryProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useMode();

  const { library: mainLibrary, isFetchingLibrary } = useGetLibraryQuery();

  const value =
    mode === "demo"
      ? { library: DEMO_LIBRARY, isFetchingLibrary: false }
      : { library: mainLibrary, isFetchingLibrary };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}
