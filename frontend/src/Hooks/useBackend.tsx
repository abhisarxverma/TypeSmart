import api from "@/lib/axios";
import type { Library } from "@/Types/Library";
import { giveLibraryRoute, giveTextDetailsRoute } from "@/utils/routing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useGetRealUserQuery(token: string | null) {

    const getRealUser = async () => {
        const res = await api.get("/auth/getuser");
        const data = res.data;
        console.log("Getting user fetch result : ", data)
        if (data.error) {
            throw new Error("Error in getting real user : ", data.error);
        }
        return data;
    }

    const { data: user, isLoading: isGettingUser, refetch } = useQuery({
        queryKey: ["user"],
        queryFn: getRealUser,
        staleTime: Infinity,
        gcTime: 1000 * 60 * 60 * 24,
        enabled: !!token,
        retry: false,
    })

    return { user, isGettingUser, refetch };
}

export function useGetLibraryQuery() {

    const { data: library, isLoading: isFetchingLibrary } = useQuery({
        queryKey: ["library"],
        queryFn: async () => {
            try {
                const res = await api.get("/library/library");
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

    return { library, isFetchingLibrary };

}

export function useAddTextMutation({ text, title, tag }: { text: string, tag: string, title: string }) {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const libraryRoute = giveLibraryRoute();

    const { mutate: addText, isPending: isAddingText } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/library/add_text", {
                title,
                text,
                tag
            });
            const data = res.data;
            if (data?.error) throw new Error(data.error);
            return data;
        },
        onSuccess: () => {
            toast.success(`Text added successfully`);
            queryClient.invalidateQueries({ queryKey: ["library"] });
            navigate(libraryRoute);
        },
        onError: (err: Error) => {
            toast.error(err?.message ?? "Upload failed");
        },
    });

    return { addText, isAddingText };

}

export function useEditTextMutation({ text, title, tag, textId }: { text: string, tag: string, title: string, textId: string }) {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const textDetailsRoute = giveTextDetailsRoute(textId);

    const { mutate: editText, isPending: isEditingText } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/library/edit_text", {
                title,
                text,
                tag,
                textId
            });
            const data = res.data;
            if (data?.error) throw new Error(data.error);
            return data;
        },
        onSuccess: () => {
            toast.success(`Text edited successfully`);
            queryClient.invalidateQueries({ queryKey: ["library"] });
            navigate(textDetailsRoute);
        },
        onError: (err: Error) => {
            toast.error(err?.message ?? "Upload failed");
        },
    });

    return { editText, isEditingText };
}

export function useUpdateImportanceMutation({ textId, groupId, importance }: { textId: string, groupId: string, importance: string }) {

    const queryClient = useQueryClient();

    const { mutate: updateImportance, isPending: isUpdatingImportance } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/library/update_importance", {
                textId, groupId, importance
            });

            const data = res.data;
            console.log("Update importance result : ", data);

            if (data.error) throw new Error(data.error);

            return data;
        },
        onError: (error) => {
            toast.error(error.message);
        },
        onSuccess: (data) => {
            const library: Library | undefined = queryClient.getQueryData(["library"]);

            if (!library) return;

            const newGroups = library.groups.map(group => {
                if (group.id === groupId) return {
                    ...group,
                    group_texts: group.group_texts.map(text => {
                        if (text.id === data.id) {
                            return {
                                ...text,
                                importance: data.importance,
                            };
                        }
                        return text;
                    })
                }
                else return group;
            });

            queryClient.setQueryData(["library"], {texts: library.texts, groups: newGroups});
        }

    })

    return { updateImportance, isUpdatingImportance };
}