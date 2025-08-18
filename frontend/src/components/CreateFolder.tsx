import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React, { useState } from "react"
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

export default function CreateFolderEl({ children }: { children : React.ReactNode}) {

    const [ open, setOpen ] = useState<boolean>(false);
    const [ name, setName ] = useState<string>("");

    const queryClient = useQueryClient();

    const { mutate: createFolder, isPending: creatingFolder } = useMutation({
        mutationFn: async() => {
            const res = await api.post("/user/create_folder", {
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
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["library"] })
        }
    })

    function handleCreateFolder() {
        if (creatingFolder) return;
        if (!name) {
            toast.error("Please enter folder name");
            return;
        }
        createFolder();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                    <DialogDescription>
                    </DialogDescription>
                    <div className="flex flex-col gap-5 mt-2">
                        <Input type="text" placeholder="Enter folder name" value={name} onChange={(e) => setName(e.target.value) } />
                        <Button onClick={handleCreateFolder}>{creatingFolder ? <Loader className="animate-spin" /> : "Create Folder"}</Button>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}