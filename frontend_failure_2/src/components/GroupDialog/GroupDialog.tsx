import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { Group } from "@/lib/Types/Library";
import { Badge } from "../ui/badge";
import TextCardDialog from "../TextCardDialog/TextCardDialog";
import { Button } from "../ui/button";
import { AiOutlineDelete } from "react-icons/ai";


export default function GroupDialog({ open, setOpen, group }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, group: Group }) {
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-h-[90vh] h-[700px] flex flex-col">
                <DialogHeader className="">
                    <DialogTitle className="text-2xl">{group?.name}</DialogTitle>
                    <DialogDescription>
                        <Badge>{group?.subject}</Badge>
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto">
                    <span className="text-lg font-bold mb-3">Texts</span>
                    <div className="flex flex-col gap-2 overflow-y-auto mt-3">
                        {group?.group_texts?.map(text => (
                            <TextCardDialog text={text} key={text.id} type="present_in_group" />
                        ))}
                    </div>
                </div>
                <div className="mt-auto ms-auto flex items-center gap-2">
                    <Button>Start Typing</Button>
                    <Button className="text-red-400 bg-background text-xl hover:bg-red-600 hover:text-white"><AiOutlineDelete /></Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}