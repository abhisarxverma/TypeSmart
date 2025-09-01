
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import PdfUploader from "@/components/uploaders/PdfUploader";
import api from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function AddText() {

    const [title, setTitle] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [text, setText] = useState<string>("");

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { mutate: addText, isPending: isAddingText } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/user/add_text", {
                title,
                text,
                tag
            });
            const data = res.data;
            if (data?.error) throw new Error(data.error);
            return data;
        },
        onSuccess: () => {
            toast.success(`Text added successfully`);
            queryClient.invalidateQueries({ queryKey: ["library"] });
            navigate("/app/library");
        },
        onError: (err: Error) => {
            toast.error(err?.message ?? "Upload failed");
        },
    });

    return (
        <>
            <h1 className="text-heading">Add New Text</h1>
            <p className="text-subheading mt-1">Add new text to your collection from various sources</p>

            <div className="flex items-center mt-10 max-w-lg gap-4">
                <div className="input-group flex-2">
                    <label htmlFor="title" className="input-label">Title</label>
                    <Input name="title" placeholder="e.g. Neurodynamics chapter-3" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="input-group flex-1">
                    <label htmlFor="tag" className="input-label">Tag</label>
                    <Input name="tag" placeholder="e.g. Neurodynamics" value={tag} onChange={(e) => setTag(e.target.value)} />
                </div>
            </div>

            <div className="grid grid-cols-[1.2fr_1fr] gap-4 mt-10">
                <div className="input-group flex-1">
                    <label className="input-label">Text</label>
                    <Textarea
                        placeholder="Edit your text here"
                        className="resize-none mt-2 leading-relaxed overflow-y-auto h-full scrollbar-custom max-h-[90vh]"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                </div>

                <Tabs defaultValue="pdf" className="flex-1">
                    <TabsList className="">
                        <TabsTrigger value="pdf">PDF</TabsTrigger>
                        <TabsTrigger value="txt">Txt File</TabsTrigger>
                        <TabsTrigger value="direct">Direct</TabsTrigger>
                    </TabsList>
                    <TabsContent className="h-full" value="pdf">
                        <PdfUploader text={text} textSettingFn={setText} />
                    </TabsContent>
                    <TabsContent value="txt">
                    </TabsContent>
                    <TabsContent value="direct">
                    </TabsContent>
                </Tabs>
            </div>

            <div className="mt-10 flex items-center justify-end">
                <Button onClick={() => addText()} disabled={title === "" || tag === "" || text === "" || isAddingText} className="w-50">{isAddingText ? <Loader2 className="animate-spin" /> :  "Submit"}</Button>
            </div>


        </>
    )
}