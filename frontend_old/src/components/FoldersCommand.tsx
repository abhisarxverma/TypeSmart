import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import type { Folder } from "@/Types/Library";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MdOutlineFolder } from "react-icons/md";
import CreateFolderEl from "./CreateFolder";
import { IoHomeOutline } from "react-icons/io5";
import { useNavigate} from "react-router-dom";

export default function FoldersCommand({
    folders,
}: {
    folders: Folder[];}) {
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    const handleSelect = (folder: Folder | null) => {
        setOpen(false);
        navigate("/library/"+(folder ? folder.name : "Home"))
    };

    return (
        <>
            <Button
                className="flex items-center gap-1"
                variant="outline"
                onClick={() => setOpen(true)}
            >
                <MdOutlineFolder />
                <span>Change Folder</span>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search folders..." />

                <CommandList>
                    <CommandEmpty className="flex flex-col gap-1 justify-center items-center py-5">
                        No folders found.
                    </CommandEmpty>

                    <CommandGroup heading="Folders">
                        <CommandItem className="flex items-center gap-2" onSelect={() => handleSelect(null)}>
                            <IoHomeOutline />
                            <span>Home</span>
                        </CommandItem>
                        {folders.map((folder) => (
                            <CommandItem
                                className="flex items-center gap-2"
                                key={folder.id}
                                onSelect={() => handleSelect(folder)}
                            >
                                <MdOutlineFolder />
                                <span>{folder.name}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>

                {/* Custom Footer */}
                <div className="border-t px-4 py-3 flex justify-end">
                    <CreateFolderEl>
                        <Button variant="secondary">Create Folder</Button>
                    </CreateFolderEl>
                </div>
            </CommandDialog>
        </>
    );
}
