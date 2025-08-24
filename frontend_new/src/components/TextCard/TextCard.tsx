import clsx from "clsx";
import styles from "./TextCard.module.css";
import type { Text } from "@/lib/Types/Library";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { AiOutlineDelete } from "react-icons/ai";
import { Loader } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";

interface TextCardProps {
    type: "add_in_group" | "present_in_group" | "library_all_texts";
    text: Text;
    groupId: string | null
}

export default function TextCard({ text, type, groupId }: TextCardProps) {

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    // mutation: add text in group
    const { mutate: addInGroup, isPending: isAdding } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/user/add_in_group", { text_id: text.id, group_id: groupId });
            if (res.data.error) throw new Error(res.data.error);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["library"] })
        },
    });

    // mutation: remove text from group
    const { mutate: removeFromGroup, isPending: isRemoving } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/user/remove_from_group", { text_id: text.id, group_id: groupId });
            if (res.data.error) throw new Error(res.data.error);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["library"] })
        },
    });

    // mutation: practice
    function practiceText() {
        console.log("practicing")
    };

    return (
        <div onClick={() => navigate(`/library/text/${text?.id}`)} className={clsx(styles.card, "shadow cursor-pointer")}>
            <div className={clsx(styles.textGroup)}>
                <p>{text.title}</p>
                <div className={styles.badges}>
                    <Badge variant="secondary">{text.subject}</Badge>
                    <Badge variant="outline">{text.importance}</Badge>
                </div>
            </div>
            <div className={clsx(styles.buttons)}>
                {type === "add_in_group" && <Button title="Add text in this group" variant="outline" onClick={() => addInGroup()} disabled={isAdding}>{isAdding ? <Loader className="animate-spin" /> : "Add"}</Button>}
                {(type === "present_in_group" || type === "library_all_texts") && <Button title="Start typing this text" onClick={practiceText}>Type</Button>}
                {type === "present_in_group" && <Button title="Remove text from this group" variant={"outline"} className="hover:bg-background" onClick={() => removeFromGroup()} disabled={isRemoving}>{isRemoving ? <Loader className="text-red-500 animate-spin" /> : <AiOutlineDelete className="text-red-500" />}</Button>}
            </div>
        </div>
    );
}
