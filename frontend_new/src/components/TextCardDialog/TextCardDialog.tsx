import type { Text } from "@/lib/Types/Library"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { IoAddOutline } from "react-icons/io5";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { IoOpenOutline } from "react-icons/io5";
import { useState } from "react";
import TextDialog from "../TextDialog/TextDialog";

interface TextCardDialogProps {
    text: Text
    type: "present_in_group" | "add_in_group"
}

export default function TextCardDialog({ text, type }: TextCardDialogProps) {

    const [open, setOpen] = useState<boolean>(false);

    return (
        <div className="flex items-center border-1 border-black rounded p-2 transition-all duration-150 hover:mx-2">
            <TextDialog text={text} open={open} setOpen={setOpen} />
            <div className="flex-1 flex flex-col gap-1">
                <span className="text-md">{text.title}</span>
                <Badge variant="outline">{text.subject}</Badge>
            </div>
            <div className="flex-0 grow-0 basis-auto flex items-center gap-2">
                {type==="add_in_group" && <Button><IoAddOutline /></Button>}
                {type==="present_in_group" && <Button className="hover:bg-primary hover:text-white" variant="secondary" onClick={() => setOpen(true)}><IoOpenOutline /></Button>}
                {type==="present_in_group" && <Button className="text-red-400 bg-white hover:bg-red-600 hover:text-white"><IoIosRemoveCircleOutline /></Button>}
            </div>
        </div>
    )
}