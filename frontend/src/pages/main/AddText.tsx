
import TextForm from "@/components/layouts/TextForm";
import { Button } from "@/components/ui/button";
import FileReference from "@/components/uploaders/FileReference";
import { useAddTextMutation } from "@/Hooks/useBackend";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function AddText() {

    const [title, setTitle] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [text, setText] = useState<string>("");

    const { addText, isAddingText } = useAddTextMutation({ text, title, tag });

    return (
        <>
            <h1 className="text-heading">Add New Text</h1>
            <p className="text-subheading mt-1">Add new text to your collection from various sources</p>

            <div className="flex flex-col md:flex-row justify-between mt-10 min-h-[400px] gap-10">

                <TextForm
                    text={text}
                    title={title}
                    tag={tag}
                    setText={setText}
                    setTitle={setTitle}
                    setTag={setTag}
                    addClass="flex-3"
                />

                <div className="flex-2 flex flex-col gap-2">
                    <span className="text-sm">File Reference</span>
                    <FileReference addClass="flex-1" text={text} textSettingFn={setText} />
                </div>
            </div>

            <Button onClick={() => addText()} disabled={title === "" || tag === "" || text === "" || isAddingText} className="md:w-80 w-full mt-10">{isAddingText ? <Loader2 className="animate-spin" /> : "Add Text"}</Button>
        </>
    )
}