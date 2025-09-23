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
import { useRemoveTextFromGroupMutation, useUpdateImportanceMutation } from "@/Hooks/useBackend";
import { Loader2 } from "lucide-react";
import { useMode } from "@/Hooks/useMode";
import { useLibrary } from "@/Hooks/useLibrary";

export default function TextPresentCard({ text, groupId }: { text: TextInGroup, groupId: string }) {

    const [importance, setImportance] = useState<string>("");

    const { updateImportance, isUpdatingImportance } = useUpdateImportanceMutation({ textId: text.id, groupId, importance });
    const { removeFromGroup, isRemovingFromGroup } = useRemoveTextFromGroupMutation({ textId: text.id, groupId });

    const navigate = useNavigate();

    const { mode } = useMode();
    const { library, setLibrary } = useLibrary();

    useEffect(() => {
        setImportance(text.importance ?? "medium")
    }, [setImportance, text.importance]);

    let importanceColor;

    if (importance === "medium") importanceColor = "text-yellow-300";
    else if (importance === "high") importanceColor = "text-red-400";
    else importanceColor = "text-green-300";

    const textDetailsRoute = giveTextDetailsRoute(text.id, mode);
    const editDetailsRoute = giveEditTextRoute(text.id, mode);

    function handleImportanceChange(value:string) {
        if ( mode === "main" ){
            if (isUpdatingImportance) return;
            updateImportance()
        }
        else {
            text.importance = value;
            const groupToUpdate = library.groups.find(grp => grp.id === groupId)
            if (!groupToUpdate) return;
            groupToUpdate.group_texts.map(txt => {
                if (txt.id === text.id) return text
                else return txt
            })
            const updatedGroups = library.groups.map(grp => {
                if ( grp.id === groupId ) return groupToUpdate
                else return grp
            })
            if (setLibrary) setLibrary({...library, groups: updatedGroups})
        }
        setImportance(value);
    }

    function handleRemove() {
        if (mode === "main") {
            if (isRemovingFromGroup) return;
            removeFromGroup();
        }
        else {
            const groupToUpdate = library.groups.find(grp => grp.id === groupId);
            if (!groupToUpdate) return;
            groupToUpdate.group_texts = groupToUpdate.group_texts.filter(txt => txt.id !== text.id)
            const updatedGroups = library.groups.map(grp => {
                if ( grp.id === groupId ) return groupToUpdate
                else return grp
            })
            if (setLibrary) setLibrary({...library, groups: updatedGroups })
        }
    }

    return (
        <div  className="bg-card-dark hover:bg-card transition-all duration-300 border-1 border-border rounded-md p-4 flex flex-col gap-2 cursor-pointer">
            <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col gap-1 ">
                    <p onClick={() => navigate(textDetailsRoute)} className="font-semibold">{text.title}</p>
                    <div className="flex items-center text-muted-foreground text-[.8rem] gap-1">
                        <FaHashtag />
                        <span className="">{text.tag}</span>
                    </div>
                </div>
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
                <Button onClick={handleRemove} variant="ghost" className="text-destructive hover:text-destructive">{isRemovingFromGroup ? <Loader2 className="animate-spin text-red-500" /> : <IoIosRemoveCircleOutline />}</Button>
            </div>
        </div>
    )
}