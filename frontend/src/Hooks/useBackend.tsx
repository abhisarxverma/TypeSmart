import api from "@/lib/axios";
import type { Group, Library } from "@/Types/Library";
import { giveGroupDetailsRoute, giveLibraryRoute, giveTextDetailsRoute } from "@/utils/routing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useMode } from "./useMode";
import axios from "axios";

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
                if (axios.isAxiosError(error) && error.response?.data?.error) {
                    throw new Error(error.response.data.error);
                }
                throw new Error("Failed to fetch library");

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
    const libraryRoute = giveLibraryRoute("main");

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
    const { mode } = useMode()
    const textDetailsRoute = giveTextDetailsRoute(textId, mode);

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

            queryClient.setQueryData(["library"], { texts: library.texts, groups: newGroups });
        }

    })

    return { updateImportance, isUpdatingImportance };
}

export function useAddTextInGroupMutation({ textId, groupId }: { textId: string, groupId: string }) {

    const queryClient = useQueryClient();

    const { mutate: addTextInGroup, isPending: isAddingInGroup } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/library/add_in_group", {
                text_id: textId,
                group_id: groupId
            });

            const data = res.data;

            console.log("Add in group mutation result : ", data);

            if (data.error) throw new Error(data.error);

            return data;
        },
        onError: (error) => {
            toast.error(error.message);
            console.log("Error in add in group mutation: ", error);
        },
        onSuccess: (text) => {

            const library = queryClient.getQueryData<Library>(["library"]);
            if (!library) return;

            const newGroups = library.groups.map(grp =>
                grp.id === groupId
                    ? { ...grp, group_texts: [...grp.group_texts, text] }
                    : grp
            );

            queryClient.setQueryData<Library>(["library"], {
                ...library,
                groups: newGroups,
            });

        }
    });

    return { addTextInGroup, isAddingInGroup };

}

export function useRemoveTextFromGroupMutation({ textId, groupId }: { textId: string, groupId: string }) {

    const queryClient = useQueryClient();

    const { mutate: removeFromGroup, isPending: isRemovingFromGroup } = useMutation({
        mutationFn: async () => {
            const res = await api.delete("/library/remove_from_group", {
                data: { text_id: textId, group_id: groupId }
            });

            const data = res.data;

            console.log("Remove from group mutation result : ", data);

            if (data.error) throw new Error(data.error);

            return data;

        },
        onError: (error) => {
            toast.error(error.message);
            console.log("Error in remove from group mutation : ", error);
        },
        onSuccess: (text) => {
            const library = queryClient.getQueryData<Library>(["library"]);
            if (!library) return;

            const newGroups = library.groups.map(grp =>
                grp.id === groupId
                    ? { ...grp, group_texts: grp.group_texts.filter(txt => txt.id !== text.id) }
                    : grp
            );

            queryClient.setQueryData<Library>(["library"], {
                ...library,
                groups: newGroups,
            });
        }
    });

    return { removeFromGroup, isRemovingFromGroup };

}

export function useCreateGroupMutation({ name, tag }: { name: string, tag: string }) {

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: createGroup, isPending: isCreatingGroup } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/library/create_group", {
                name,
                tag
            });
            const data = res.data;
            console.log("Create group mutation result : ", data);
            if (data.error) throw new Error(data.error);
            return data;
        },
        onSuccess: (data: Group) => {
            const group = data;
            group.group_texts = [];

            queryClient.setQueryData(["library"], (old: Library) => ({
                ...old,
                groups: [group, ...(old?.groups || [])]
            }));
            navigate(giveGroupDetailsRoute(data.id, "main"));
        }
    });

    return { createGroup, isCreatingGroup };

}

export function useDeleteTextMutation(textId: string) {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const libraryRoute = giveLibraryRoute("main");

    const { mutate: deleteText, isPending: isDeletingText } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/library/delete_text", {
                textId
            });
            const data = res.data;
            console.log("Delete text result : ", data);
            if (data.error) throw new Error(data.error);
            return data;
        },
        onError: (error) => {
            console.log("Error in delete text mutation : ", error);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["library"] });
            navigate(libraryRoute);
        }
    });

    return { deleteText, isDeletingText };

}

export function useDeleteGroupMutation(groupId: string) {

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mode } = useMode();
    const libraryRoute = giveLibraryRoute(mode);

    const { mutate: deleteGroup, isPending: isDeletingGroup } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/library/delete_group", {
                groupId
            });
            const data = res.data;
            console.log("Delete group result : ", data);
            if (data.error) throw new Error(data.error);
            return data;
        },
        onError: (error) => {
            console.log("Error in delete group mutation : ", { groupId, error });
            toast.error(error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["library"] });
            navigate(libraryRoute);
        }
    });

    return { deleteGroup, isDeletingGroup };

}

export function useSendFeedbackMutation(text: string) {

    const { mutate: sendFeedback, isPending: isSendingFeedback } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/misc/send_feedback", {
                text
            });
            const data = res.data;
            console.log("send feedback result : ", data);
            if (data.error) throw new Error(data.error);
            return data;
        },
        onError: (error) => {
            console.log("Error in send feedback mutation: ", error);
            toast.error(error.message);
        }
    });

    return { sendFeedback, isSendingFeedback };
}