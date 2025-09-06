import { useLibrary } from "@/Hooks/useLibrary";
import { useParams } from "react-router-dom"
import LoaderPage from "../utils/LoaderPage";
import NotFound from "../utils/NotFound";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaKeyboard, FaPlus } from "react-icons/fa6";
import NoTexts from "@/components/library/GroupDetails/NoTexts";
import TextPresentCard from "@/components/library/GroupDetails/TextPresentCard";
import ListLayout from "@/components/layouts/ListLayout";
import AddTextDialog from "@/components/library/GroupDetails/AddTextDialog/AddTextDialog";
import { useDeleteGroupMutation } from "@/Hooks/useBackend";
import DeleteButton from "@/components/DeleteButton";

export default function GroupDetails() {

    const { id: groupId } = useParams();

    const { library, isFetchingLibrary } = useLibrary();

    const { deleteGroup, isDeletingGroup } = useDeleteGroupMutation(groupId ?? "");

    if (isFetchingLibrary) return <LoaderPage />

    const group = library.groups.find(grp => grp.id === groupId);

    if (!groupId || !group) return <NotFound text="Group not found" />

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-3">
                <div className="flex flex-col">
                    <h1 className="text-heading font-bold mb-2">{group.name}</h1>
                    <Badge className="text-[.9rem]" variant="secondary"># {group.tag}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="secondary"><FaKeyboard /> Type</Button>
                    <AddTextDialog group={group}>
                        <Button variant="ghost"><FaPlus /> Add Text</Button>
                    </AddTextDialog>
                    <DeleteButton deleteFn={deleteGroup} isDeleting={isDeletingGroup} />
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