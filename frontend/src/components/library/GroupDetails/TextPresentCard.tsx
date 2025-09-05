import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import type { TextInGroup } from "@/Types/Library";
import { FaHashtag, FaPencil } from "react-icons/fa6";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useEffect, useState } from "react";
import { giveEditTextRoute, giveTextDetailsRoute } from "@/utils/routing";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import { useRemoveTextFromGroupMutation, useUpdateImportanceMutation } from "@/Hooks/useBackend";
import { Loader2 } from "lucide-react";

export default function TextPresentCard({ text, groupId }: { text: TextInGroup, groupId: string }) {

    const [importance, setImportance] = useState<string>("");

    const { updateImportance, isUpdatingImportance } = useUpdateImportanceMutation({ textId: text.id, groupId, importance });
    const { removeFromGroup, isRemovingFromGroup } = useRemoveTextFromGroupMutation({ textId: text.id, groupId });

    const navigate = useNavigate();

    useEffect(() => {
        setImportance(text.importance ?? "medium")
    }, [setImportance, text.importance]);

    let importanceColor;

    if (importance === "medium") importanceColor = "text-yellow-300";
    else if (importance === "high") importanceColor = "text-red-400";
    else importanceColor = "text-green-300";

    const textDetailsRoute = giveTextDetailsRoute(text.id);
    const editDetailsRoute = giveEditTextRoute(text.id);

    function handleImportanceChange(value:string) {
        if (isUpdatingImportance) return;
        setImportance(value);
        updateImportance()
    }

    function handleRemove() {
        if (isRemovingFromGroup) return;
        removeFromGroup();
    }

    return (
        <div className="bg-card-dark hover:bg-card transition-all duration-300 border-1 border-border rounded-md p-4 flex flex-col gap-2 cursor-pointer">
            <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col gap-1 ">
                    <p className="font-semibold">{text.title}</p>
                    <div className="flex items-center text-muted-foreground text-[.8rem] gap-1">
                        <FaHashtag />
                        <span className="">{text.tag}</span>
                    </div>
                </div>
                <RiArrowRightSLine className="text-[1.5rem]" onClick={() => navigate(textDetailsRoute)} />
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-1 items-center mt-auto">
                <span className="text-muted-foreground text-[.8rem]">Importance : </span>
                <Select value={importance} onValueChange={handleImportanceChange}>
                    <SelectTrigger className={"w-full border-0 font-semibold " + importanceColor}>
                        <SelectValue placeholder="Importance" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="high" className="text-red-300">High</SelectItem>
                        <SelectItem value="medium" className="text-yellow-300">Medium</SelectItem>
                        <SelectItem value="low" className="text-green-400">Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-2 justify-end mt-auto">
                <Button onClick={() => navigate(editDetailsRoute)} variant="ghost" className=""><FaPencil /></Button>
                <Button onClick={handleRemove} variant="ghost" className="text-destructive">{isRemovingFromGroup ? <Loader2 className="animate-spin text-red-500" /> : <IoIosRemoveCircleOutline />}</Button>
            </div>
        </div>
    )
}