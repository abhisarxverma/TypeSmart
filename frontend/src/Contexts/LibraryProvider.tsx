import { LibraryContext } from "@/Hooks/useLibrary";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type React from "react";

export default function LibraryProvider({ children } : {children: React.ReactNode }) {

    const { data: library, isLoading: isFetchingLibrary } = useQuery({
        queryKey: ["library"],
        queryFn: async () => {
            try {
                const res = await api.get("/user/library");
                const data = res.data;
                console.log("Library fetch result : ", data);
                if (data.error) throw new Error(data.error);
                return data;
            } catch (error) {
                console.log("Error in library fetch query : ", error)
                throw new Error(error?.response?.data?.error ?? "Failed to fetch library");
            }
        },
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60 * 24,

    })

    return (
        <LibraryContext.Provider value={{ library, isFetchingLibrary }}>
            {children}
        </LibraryContext.Provider>
    )

}