import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddTextInGroupMutation } from "@/Hooks/useBackend";
import { useLibrary } from "@/Hooks/useLibrary";
import { useMode } from "@/Hooks/useMode";
import type { Group, TextInGroup } from "@/Types/Library";
import { Loader2 } from "lucide-react";
import { FaPlus } from "react-icons/fa6";

export default function AddInGroupCard({ group, textId }: { group: Group, textId: string }) {

    const { addTextInGroup, isAddingInGroup } = useAddTextInGroupMutation({ textId, groupId: group.id })
    const { library, setLibrary } = useLibrary();
    const { mode } = useMode();

    function handleAdd() {
        if ( mode === "main" ) addTextInGroup();
        else {
            const text = library.texts.find(txt => txt.id === textId) as unknown as TextInGroup;
            text.importance = "medium"
            if (!text) return;
            const updatedGroups = library.groups.map(grp => {
                if (grp.id === group.id) {
                    return {
                        ...grp,
                        group_texts: [...grp.group_texts, text as unknown as TextInGroup]
                    }
                }
                else return grp
            })
            if (setLibrary) setLibrary({...library, groups: updatedGroups})
        }   
    }

    return (
        <div className="flex justify-between items-center gap-3 px-1 py-1">
            <div className="flex justify-center items-center gap-2">
                <p className="font-semibold text-sm">{group.name}</p>
                <Badge variant="outline"># {group.tag}</Badge>
            </div>
            <Button onClick={handleAdd} variant="ghost" className="text-green-400">{isAddingInGroup ? <Loader2 className="animate-spin" /> : <FaPlus />}</Button>
        </div>
    )
}