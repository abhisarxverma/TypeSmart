import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Text } from "@/lib/Types/Library";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AiOutlineDelete } from "react-icons/ai";


export default function TextDialog({ open, setOpen, text }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, text: Text }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] h-[700px] min-w-[900px] max-w-[90vw] flex flex-col">
                <DialogHeader className="">
                    <DialogTitle className="text-2xl">{text.title}</DialogTitle>
                    <DialogDescription>
                        <Badge>{text?.subject}</Badge>
                    </DialogDescription>
                </DialogHeader>
                <p className="flex-1 overflow-y-auto p-2 rounded border-1 border-black">
                    {text.text}
                </p>
                <div className="mt-auto ms-auto flex items-center gap-2">
                    <Button>Start Typing</Button>
                    <Button className="text-red-400 bg-background text-xl hover:bg-red-600 hover:text-white"><AiOutlineDelete /></Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}