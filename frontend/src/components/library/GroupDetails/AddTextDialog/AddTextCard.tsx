import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAddTextInGroupMutation } from "@/Hooks/useBackend";
import { useLibrary } from "@/Hooks/useLibrary";
import { useMode } from "@/Hooks/useMode";
import type { TextInGroup } from "@/Types/Library";
import { Loader2 } from "lucide-react";
import { FaPlus } from "react-icons/fa6";

export default function AddTextCard({ groupId, text }: { groupId: string, text: TextInGroup }) {

    const { mode } = useMode();
    const { library, setLibrary } = useLibrary();

    const { addTextInGroup, isAddingInGroup } = useAddTextInGroupMutation({ groupId, textId: text.id })

    function handleAdd() {
        if (mode === "main") addTextInGroup();
        else {
            const updatedGroups = library.groups.map(grp => {
                if (grp.id === groupId) {
                    return {
                        ...grp,
                        group_texts: [...grp.group_texts, text]
                    }
                }
                else return grp
            })
            if (setLibrary) setLibrary({ ...library, groups: updatedGroups })
        }
    }

    return (
        <div className="flex justify-between items-center gap-3 px-1 py-1">
            <div className="flex justify-center items-center gap-2">
                <p className="font-semibold text-sm">{text.title}</p>
                <Badge variant="outline"># {text.tag}</Badge>
            </div>
            <Button onClick={handleAdd} variant="ghost" className="text-green-400">{isAddingInGroup ? <Loader2 className="animate-spin" /> : <FaPlus />}</Button>
        </div>
    )

}