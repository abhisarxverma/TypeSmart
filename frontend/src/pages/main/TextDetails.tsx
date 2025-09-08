import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/Hooks/useLibrary";
import { Loader2 } from "lucide-react";
import { FaPencil } from "react-icons/fa6";
import { Link, useNavigate, useParams } from "react-router-dom"
import { giveEditTextRoute, giveTypingPageRoute } from "@/utils/routing";
import { FaRegKeyboard } from "react-icons/fa";
import { getPresentInGroups } from "@/utils/files";
import PresentInGroups from "@/components/library/TextDetails/PresentInGroups";
import { useDeleteTextMutation } from "@/Hooks/useBackend";
import DeleteButton from "@/components/library/DeleteButton";
import { useTyping } from "@/Hooks/useTyping";

export default function TextDetails() {

    const { id: textId } = useParams();
    const { library, isFetchingLibrary } = useLibrary();

    const { startText } = useTyping();
    
    const { deleteText, isDeletingText } = useDeleteTextMutation(textId ?? "");

    const navigate = useNavigate();
    
    const text = library.texts.find((txt) => txt.id === textId);
    
    if ( isFetchingLibrary ) {
        return (
            <div className="min-h-lg">
                <Loader2 className="animate-spin" size="3rem" />
            </div>
        )
    }
    
    if ( !text || !textId ) {
        return (
            <h1 className="text-heading">Text not found in your library</h1>
        )
    }

    function handleType() {
        if (!text) return;
        startText(text);
        navigate(giveTypingPageRoute());
    }

    const editDetailsRoute = giveEditTextRoute(textId);

    const presentInGroups = getPresentInGroups(text.id, library.groups);

    return (
        <>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-7 md:gap-3">
                <div className="flex flex-col">
                    <h1 className="text-heading-lg font-bold mb-2">{text.title}</h1>
                    <Badge className="text-[.9rem]" variant="secondary"># {text.tag}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleType} title="Type this text only" variant="secondary"><FaRegKeyboard /> Type</Button>
                    <Button variant="ghost" className="hover:text-primary" asChild>
                        <Link to={editDetailsRoute}>
                            <FaPencil />
                        </Link>
                    </Button>
                    <DeleteButton deleteFn={deleteText} isDeleting={isDeletingText} />
                </div>
            </div>

            <div className="max-h-[80vh] scrollbar-custom overflow-y-auto mt-10">
                <p className="leading-relaxed text-base [word-spacing:.2em]">
                    {text.text}
                </p>
            </div>

            <PresentInGroups text={text} groups={presentInGroups} />

        </>
    )
}