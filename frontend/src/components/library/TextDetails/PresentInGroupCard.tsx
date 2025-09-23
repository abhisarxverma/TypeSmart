import { Button } from "@/components/ui/button";
import { useRemoveTextFromGroupMutation } from "@/Hooks/useBackend";
import { useLibrary } from "@/Hooks/useLibrary";
import { useMode } from "@/Hooks/useMode";
import type { Group } from "@/Types/Library";
import { giveGroupDetailsRoute } from "@/utils/routing";
import { Loader2 } from "lucide-react";
import { FaHashtag } from "react-icons/fa6";
import { IoIosRemoveCircleOutline } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function PresentInGroupCard({ textId, group }: { textId: string, group: Group }) {
    
    const navigate = useNavigate();
    const { mode } = useMode();
    const groupDetailsRoute = giveGroupDetailsRoute(group.id, mode);
    const { library, setLibrary } = useLibrary();

    const { removeFromGroup, isRemovingFromGroup } = useRemoveTextFromGroupMutation({ textId, groupId: group.id });
    
    function handleRemove() {
        if ( mode === "main" ) {
            if (isRemovingFromGroup) return;
            removeFromGroup();
        }
        else {

            const updatedGroups = library.groups.map(grp => {
                if ( grp.id === group.id ) {
                    return {
                        ...grp,
                        group_texts: group.group_texts.filter(txt => txt.id !== textId)
                    }
                }
                else return grp
            })

            if (setLibrary) setLibrary({ ...library, groups: updatedGroups });
        }
    }

    return (
        <div className="bg-card-dark hover:bg-card transition-all duration-300 border-1 border-border rounded-md p-4 flex flex-col gap-2 cursor-pointer">
            <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col gap-1 ">
                    <p onClick={() => navigate(groupDetailsRoute)} className="font-semibold">{group.name}</p>
                    <div className="flex items-center text-muted-foreground text-[.8rem] gap-1">
                        <FaHashtag />
                        <span className="">{group.tag}</span>
                    </div>
                </div>
            </div>
            <div className="flex gap-2 justify-end mt-auto">
                <Button onClick={handleRemove} title="Remove from this group" variant="ghost" className="text-destructive hover:text-destructive">{isRemovingFromGroup ? <Loader2 className="animate-spin" /> : <IoIosRemoveCircleOutline />}</Button>
            </div>
        </div>
    )

}