import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/Hooks/useLibrary";
import { Loader2 } from "lucide-react";
import { FaPencil } from "react-icons/fa6";
import { Link, useParams } from "react-router-dom"
import { RiDeleteBinLine } from "react-icons/ri";
import { giveEditTextRoute } from "@/utils/routing";
import { FaRegKeyboard } from "react-icons/fa";


export default function TextDetails() {

    const { id: textId } = useParams();
    const { library, isFetchingLibrary } = useLibrary();

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

    const editDetailsRoute = giveEditTextRoute(textId);

    return (
        <>
            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <h1 className="text-heading-lg font-bold mb-2">{text.title}</h1>
                    <Badge className="text-[.9rem]" variant="secondary">{text.tag}</Badge>
                </div>
                <div className="flex items-center gap-2">
                    <Button title="Type this text only" className=""><FaRegKeyboard /></Button>
                    <Button variant="secondary" className="hover:text-primary" asChild>
                        <Link to={editDetailsRoute}>
                            <FaPencil />
                        </Link>
                    </Button>
                    <Button variant="secondary" className="hover:text-destructive"><RiDeleteBinLine /></Button>
                </div>
            </div>

            <div className="max-h-[80vh] scrollbar-custom overflow-y-auto mt-10">
                <p className="leading-relaxed text-base [word-spacing:.2em]">
                    {text.text}
                </p>
            </div>

        </>
    )
}