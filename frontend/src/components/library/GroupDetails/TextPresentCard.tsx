import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TextInGroup } from "@/Types/Library";
import { FaPencil } from "react-icons/fa6";
import { RiDeleteBinLine } from "react-icons/ri";
import { useEffect, useState } from "react";
import { giveTextDetailsRoute } from "@/utils/routing";
import { useNavigate } from "react-router-dom";
import { RiArrowRightSLine } from "react-icons/ri";
import { useUpdateImportanceMutation } from "@/Hooks/useBackend";

export default function TextPresentCard({ text, groupId }: { text: TextInGroup, groupId: string }) {

    const [ importance, setImportance ] = useState<string>("");

    const { updateImportance, isUpdatingImportance } = useUpdateImportanceMutation({ textId: text.id, groupId, importance});

    const navigate = useNavigate();

    useEffect(() => {
        setImportance(text.importance)
    }, [setImportance, text.importance]);

    let importanceColor;

    if (importance === "medium") importanceColor = "text-yellow-300";
    else if (importance === "high") importanceColor = "text-red-400";
    else importanceColor = "text-green-300";

    const textDetailsRoute = giveTextDetailsRoute(text.id);

    function handleImportanceChange(value) {
        if (isUpdatingImportance) return;
        setImportance(value);
        updateImportance()
    }

    return (
        <div className="bg-card-dark hover:bg-card transition-all duration-300 border-1 border-border rounded-md p-4 flex flex-col gap-2 cursor-pointer">
            <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col gap-1 ">
                    <p className="font-bold text-[1.2rem]">{text.title}</p>
                    <Badge className="" variant="outline"># {text.tag}</Badge>
                </div>
                <RiArrowRightSLine className="text-[1.5rem]" onClick={() => navigate(textDetailsRoute)} />
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-1 items-center">
                <span className="text-muted-foreground text-[.8rem]">Importance : </span>
                <Select value={importance} onValueChange={handleImportanceChange}>
                    <SelectTrigger className={"w-full border-0 font-semibold "+importanceColor}>
                        <SelectValue placeholder="Importance" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="high" className="text-red-300">High</SelectItem>
                        <SelectItem value="medium" className="text-yellow-300">Medium</SelectItem>
                        <SelectItem value="low" className="text-green-400">Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex gap-2 justify-end">
                <Button variant="ghost" className=""><FaPencil /></Button>
                <Button variant="ghost" className="text-destructive"><RiDeleteBinLine /></Button>
            </div>
        </div>
    )
}