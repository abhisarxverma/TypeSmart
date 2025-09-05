import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import type React from "react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { FaHashtag } from "react-icons/fa6"
import { useCreateGroupMutation } from "@/Hooks/useBackend"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function NewGroupDialog({ children }:{ children: React.ReactNode }) {

    const [ name, setName ] = useState<string>("");
    const [ tag, setTag ] = useState<string>("");

    const { createGroup, isCreatingGroup } = useCreateGroupMutation({ name, tag });

    function handleCreation() {
        if (isCreatingGroup || !name || !tag) return;
        createGroup();
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                { children }
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>New Group</DialogTitle>
                    <DialogDescription className="">
                        <div className="flex items-center gap-4 my-6">
                            <div className="input-group flex-1">
                                <label className="input-label">Group name</label>
                                <Input required name="group_name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Semester Exams" />
                            </div>
                            <div className="input-group flex-1">
                                <label className="input-label">Tag</label>
                                <div className="grid grid-cols-[auto_1fr]">
                                    <div className="p-2 bg-card rounded-l-md border-1 border-border">
                                        <FaHashtag className="text-lg rounded-l-md" />
                                    </div>
                                    <Input required name="tag" className="rounded-l-none" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. economics" />
                                </div>
                            </div>
                        </div>
                        <Button onClick={handleCreation} variant="secondary">{isCreatingGroup? <Loader2 className="animate-spin" /> : "Create Group"}</Button>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}