import clsx from "clsx";
import styles from "./TextCard.module.css";
import type { Text } from "@/lib/Types/Library";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { IoOpenOutline } from "react-icons/io5";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useNavigate } from "react-router-dom";
import TextDialog from "../TextDialog/TextDialog";
import { useState } from "react";

interface TextCardProps {
    text: Text;
    groupId: string | null
}

export default function TextCard({ text, groupId }: TextCardProps) {

    const navigate = useNavigate();

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

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
        <>
            <TextDialog open={dialogOpen} setOpen={setDialogOpen} text={text} />
            <div onClick={() => setDialogOpen(true)} className={clsx(styles.card, "shadow cursor-pointer")}>
                <div className={clsx(styles.textGroup)}>
                    <p>{text.title}</p>
                    <div className={styles.badges}>
                        <Badge variant="secondary">{text.subject}</Badge>
                        <Badge variant="outline">{text.importance}</Badge>
                    </div>
                </div>
                <Button variant="secondary"><IoOpenOutline /></Button>
            </div>
        </>
    );
}
