import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react"
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CreateFolderDialogWrapper({ children }: { children: React.ReactNode }) {

    const [open, setOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [subject, setSubject] = useState<string>("");

    const navigate = useNavigate();

    const queryClient = useQueryClient();

    const { mutate: createGroup, isPending: creatingGroup, error } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/user/create_group", {
                name: name
            });
            const data = res.data;
            console.log("Create folder mutation result : ", data);
            if (data.error) throw new Error(data.error);
            return data
        },
        onError: (error) => {
            console.log("Error in create folder mutation", error);
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["library"] });
            navigate(`/library/group/${data.id}`)
        }
    })

    function handleCreateFolder() {
        if (creatingGroup) return;
        if (!name) {
            toast.error("Please enter group name");
            return;
        }
        console.log({ name, subject })
        createGroup();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                    <DialogDescription>
                        {error && <span className="text-[.8rem] text-red-500">{error.message}</span>}
                    </DialogDescription>
                    <div className="flex flex-col gap-5 mt-2">
                        <Input className="shadow" type="text" placeholder="Enter folder name" value={name} onChange={(e) => setName(e.target.value)} />
                        <Input className="shadow" type="text" placeholder="Enter subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                        <Button onClick={handleCreateFolder}>{creatingGroup ? <Loader className="animate-spin" /> : "Create Group"}</Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}