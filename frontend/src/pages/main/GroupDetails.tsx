import { useLibrary } from "@/Hooks/useLibrary";
import { useNavigate, useParams } from "react-router-dom"
import LoaderPage from "../utils/LoaderPage";
import NotFound from "../utils/NotFound";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaKeyboard, FaLayerGroup, FaPlus } from "react-icons/fa6";
import NoTexts from "@/components/library/GroupDetails/NoTexts";
import TextPresentCard from "@/components/library/GroupDetails/TextPresentCard";
import ListLayout from "@/components/layouts/ListLayout";
import AddTextDialog from "@/components/library/GroupDetails/AddTextDialog/AddTextDialog";
import { useDeleteGroupMutation } from "@/Hooks/useBackend";
import DeleteButton from "@/components/library/DeleteButton";
import { useTyping } from "@/Hooks/useTyping";
import { giveTypingPageRoute } from "@/utils/routing";
import toast from "react-hot-toast";
import { useMode } from "@/Hooks/useMode";
import { useProtectFeature } from "@/utils/protection";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function GroupDetails() {

    const { mode } = useMode();

    const [ isCreatingText, setIsCreatingText ] = useState<boolean>(false);

    const { id: groupId } = useParams();

    const { library, isFetchingLibrary } = useLibrary();

    const { startGroup } = useTyping();

    const { deleteGroup, isDeletingGroup } = useDeleteGroupMutation(groupId ?? "");

    const handleDeleteClick = useProtectFeature(deleteGroup, mode);

    const navigate = useNavigate();

    if (isFetchingLibrary) return <LoaderPage />

    const group = library.groups.find(grp => grp.id === groupId);

    if (!groupId || !group) return <NotFound text="Group not found" />

    function handleType() {
        if (!group) return;
        if (!group.group_texts || group.group_texts.length <= 0) {
            toast.error("Group is empty, please add text to type.");
            return;
        }
        setIsCreatingText(true);
        startGroup(group)
        navigate(giveTypingPageRoute(mode));
    }

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-3">
                <div className="flex flex-col">
                    <h1 className="text-heading font-bold mb-2 flex items-center gap-2 break-words"><FaLayerGroup />{group.name}</h1>
                    <Badge className="text-[.9rem] w-fit" variant="secondary"># {group.tag}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={handleType} variant="secondary"><FaKeyboard />{isCreatingText && <Loader2 className="animate-spin"/>} Type</Button>
                    <AddTextDialog group={group}>
                        <Button variant="ghost"><FaPlus /> Add Text</Button>
                    </AddTextDialog>
                    <DeleteButton deleteFn={handleDeleteClick} isDeleting={isDeletingGroup} />
                </div>
            </div>
            <p className="text-section-title text-muted-foreground mt-10"><span className="">{group.group_texts.length}</span> {"Text" + (group.group_texts.length <= 1 ? "" : "s")} </p>
            <div className="flex flex-col mt-10 gap-2">
                <div className="flex flex-col gap-4">
                    {group.group_texts.length <= 0 ? (
                        <NoTexts group={group} />
                    ) : (
                        <ListLayout>
                            {group.group_texts.map((text) => (<TextPresentCard text={text} groupId={group.id} key={text.id} />))}
                        </ListLayout>
                    )}
                </div>
            </div>
        </>
    )
}
