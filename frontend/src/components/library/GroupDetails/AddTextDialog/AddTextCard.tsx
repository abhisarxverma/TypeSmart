import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddTextInGroupMutation } from "@/Hooks/useBackend";
import type { TextInGroup } from "@/Types/Library";
import { Loader2 } from "lucide-react";
import { FaPlus } from "react-icons/fa6";

export default function AddTextCard( { groupId, text }: { groupId: string, text: TextInGroup }) {

    const { addTextInGroup, isAddingInGroup } = useAddTextInGroupMutation({ groupId, textId: text.id })

    return (
        <div className="flex justify-between items-center gap-3 px-1 py-1">
            <div className="flex justify-center items-center gap-2">
                <p className="font-semibold text-sm">{text.title}</p>
                <Badge variant="outline"># {text.tag}</Badge>
            </div>
            <Button onClick={() => addTextInGroup()} variant="ghost" className="text-green-400">{isAddingInGroup ? <Loader2 className="animate-spin" /> : <FaPlus />}</Button>
        </div>
    )

}