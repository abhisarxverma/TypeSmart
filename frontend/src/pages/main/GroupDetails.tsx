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

export default function GroupDetails() {

    const { id: groupId } = useParams();

    const { library, isFetchingLibrary } = useLibrary();

    const group = library.groups.find(grp => grp.id === groupId);

    if (isFetchingLibrary) return <LoaderPage />

    if (!groupId || !group) return <NotFound text="Group not found" />

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-heading-lg font-bold mb-2">{group.name}</h1>
                    <Badge className="text-[.9rem]" variant="secondary"># {group.tag}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button><FaKeyboard /> Start Typing</Button>
                    <Button variant="ghost"><FaPlus /> Add text</Button>
                </div>
            </div>
            <div className="flex flex-col mt-10 gap-2">
                <p className="text-section-title text-muted-foreground"><span className="">{group.group_texts.length}</span> Texts </p>
                <div className="flex flex-col gap-4">
                    {group.group_texts.length < 0 ? (
                        <NoTexts />
                    ) : (
                        <ListLayout>
                            {group.group_texts.map((text) => (<TextPresentCard text={text} groupId={group.id} />))}
                        </ListLayout>
                    )}
                </div>
            </div>
        </>
    )
}