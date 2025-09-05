import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddTextInGroupMutation } from "@/Hooks/useBackend";
import type { Group } from "@/Types/Library";
import { Loader2 } from "lucide-react";
import { FaPlus } from "react-icons/fa6";

export default function AddInGroupCard({ group, textId }: { group: Group, textId: string }) {

    const { addTextInGroup, isAddingInGroup } = useAddTextInGroupMutation({ textId, groupId: group.id })

    return (
        <div className="flex justify-between items-center gap-3 px-1 py-1">
            <div className="flex justify-center items-center gap-2">
                <p className="font-semibold text-sm">{group.name}</p>
                <Badge variant="outline"># {group.tag}</Badge>
            </div>
            <Button onClick={() => addTextInGroup()} variant="ghost" className="text-green-400">{isAddingInGroup ? <Loader2 className="animate-spin" /> : <FaPlus />}</Button>
        </div>
    )
}