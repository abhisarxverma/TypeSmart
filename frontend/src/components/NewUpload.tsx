"use client";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import clsx from "clsx";
import styles from "./NewUpload.module.css";
import { Input } from "@/components/ui/input"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { Loader } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PdfUploader from "./uploaders/PdfUploader";
import TextFileUploader from "./uploaders/TextFileUploader";
import TextAreaUploader from "./uploaders/TextAreaUploder";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


export default function FileUploader({ children, folder_id }: { children: React.ReactNode, folder_id: string | null }) {
    const [text, setText] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [open, setOpen] = useState<boolean>(false);

    const queryClient = useQueryClient();

    const { mutate: uploadFile, isPending: isUploading, error, isError } = useMutation({
        mutationFn: async () => {
            try {
                const res = await api.post("/user/upload_file", {
                    title: title,
                    text: text,
                    subject: subject,
                    folder_id: folder_id
                });
                const data = res.data;
                // console.log("UPLOAD FILE RESULT : ", data);
                if (data.error) {
                    console.log("Error in upload file : ", error);
                    throw new Error(data.error);
                }
                return data;
            } catch (error: any) {
                throw new Error(error.response.data.error)
            }
        },
        onError: (error) => {
            console.log("Error in upload file : ", error);
        },
        onSuccess: () => {
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ["library"] });
            toast.success(`${title} uploaded successfully`, { id: "new-upload-success" })
        }
    })

    function handleUpload() {
        if (!text || !title || !subject) return;
        else if (isUploading) return;
        uploadFile();
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent className={styles.dialog}>
                    <DialogHeader>
                        <DialogTitle>Add New Text</DialogTitle>
                        <DialogDescription>
                            {isError && <span className="text-red-500">{error.message}</span>}
                        </DialogDescription>
                    </DialogHeader>
                    <div className={clsx(styles.container)}>
                        <div className={clsx(styles.inputsBox)}>

                            <div className={clsx(styles.inputGroup)}>
                                <label htmlFor="title">Name</label>
                                <Input
                                    type="text"
                                    name="title"
                                    onChange={(e) => setTitle(e.target.value)}
                                    className={clsx(styles.input)}
                                    placeholder="Enter title"
                                    value={title}
                                />
                            </div>
                            <div className={clsx(styles.inputGroup)}>
                                <label htmlFor="subject">Subject</label>
                                <Input
                                    type="text"
                                    name="subject"
                                    onChange={(e) => setSubject(e.target.value)}
                                    className={clsx(styles.input)}
                                    placeholder="Enter subject"
                                    value={subject}
                                />
                            </div>
                        </div>
                            <Tabs defaultValue="pdf" className="flex flex-col">
                                <TabsList className="ms-[auto]">
                                    <TabsTrigger value="pdf">PDF</TabsTrigger>
                                    <TabsTrigger value="text_file">Text File</TabsTrigger>
                                    <TabsTrigger value="text">Text</TabsTrigger>
                                </TabsList>
                                <TabsContent value="pdf">
                                    <PdfUploader />
                                </TabsContent>
                                <TabsContent value="text_file">
                                    <TextFileUploader />
                                </TabsContent>
                                <TabsContent value="text">
                                    <TextAreaUploader />
                                </TabsContent>
                            </Tabs>
                    </div>
                    <Button onClick={handleUpload}>{isUploading ? <Loader className="animate-spin" /> : "Upload"}</Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
