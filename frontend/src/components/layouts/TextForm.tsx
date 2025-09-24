import type React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface TextFormProps {
    title: string;
    text: string;
    tag: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    setText: React.Dispatch<React.SetStateAction<string>>;
    setTag: React.Dispatch<React.SetStateAction<string>>;
    addClass : string
};

export default function TextForm({ title, text, tag, setTitle, setText, setTag, addClass="" }: TextFormProps) {
    return (
        <div className={addClass + " grid grid-cols-[2fr_1fr] grid-rows-[auto_1fr] gap-4"}>
            <div className="input-group col-span-1">
                <label htmlFor="title" className="input-label">Title</label>
                <Input name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Neurodynamics chapter-3" />
            </div>
            <div className="input-group col-span-1">
                <label htmlFor="tag" className="input-label">Tag</label>
                <Input name="tag" value={tag} onChange={(e) => setTag(e.target.value)} placeholder="e.g. Neurodynamics" />
            </div>
            <div className="input-group col-span-2">
                <label className="input-label">Text</label>
                <Textarea
                    spellCheck={false}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Edit your text here"
                    className="resize-none mt-2 leading-relaxed overflow-y-auto scrollbar-custom max-h-[90vh] h-full bg-card [word-spacing:.2em]"
                />
            </div>
        </div>
    )
}