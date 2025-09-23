import { useGetLibraryQuery } from "@/Hooks/useBackend";
import { LibraryContext } from "@/Hooks/useLibrary";
import { useMode } from "@/Hooks/useMode";
import type React from "react";
import { DEMO_LIBRARY } from "@/Data/DemoLibraryData";
import { useState } from "react";

export default function LibraryProvider({ children }: { children: React.ReactNode }) {
  const { mode } = useMode();

  const { library: mainLibrary, isFetchingLibrary } = useGetLibraryQuery();

  const [ demoLibrary, setDemoLibrary ] = useState(DEMO_LIBRARY);

  const value =
    mode === "demo"
      ? { library: demoLibrary, isFetchingLibrary: false, setLibrary: setDemoLibrary }
      : { library: mainLibrary, isFetchingLibrary, setLibrary: undefined };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}
