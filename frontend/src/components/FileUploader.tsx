"use client";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import { normalizeForTyping } from "@/utils/text";
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
import styles from "./FileUploader.module.css";
import { Input } from "@/components/ui/input"
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { PiFilePlusLight } from "react-icons/pi";

// 👇 tell pdfjs where its worker lives
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


export default function FileUploader() {
    const [text, setText] = useState<string | null>(null);
    const [title, setTitle] = useState<string>("");
    const [subject, setSubject] = useState<string>("");
    const [file, setFile] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFile(file.name)

        if (file.type === "text/plain") {
            // TXT extraction
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result as string;
                console.log("Uploaded text : ", content)
                const cleanText = normalizeForTyping(content)
                setText(cleanText);
            };
            reader.readAsText(file);
        } else if (file.type === "application/pdf") {
            // PDF extraction
            const pdfData = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

            let extractedText = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map((item: any) => item.str).join(" ");
                extractedText += pageText + "\n";
            }
            const cleanText = normalizeForTyping(extractedText)
            setText(cleanText);
        } else {
            toast.error("Only PDF and TXT files are supported");
        }

        // reset input so same file can be uploaded again
        if (inputRef.current) inputRef.current.value = "";
    };

    const { mutate: uploadFile, isPending: isUploading, error, isError } = useMutation({
        mutationFn: async () => {
            try {
                const res = await api.post("/user/upload_file", {
                    title: title,
                    text: text,
                    subject: subject
                });
                const data = res.data;
                // console.log("UPLOAD FILE RESULT : ", data);
                if (data.error) {
                    console.log("Error in upload file : ",error);
                    throw new Error(data.error);
                }
                return data;
            } catch (error : any) {
                throw new Error(error.response.data.error)
            }
        },
        onError : (error ) => {
            console.log("Error in upload file : ",error);
        }
    })

    function handleUpload() {
        if (!text || !title || !subject) return;
        else if (isUploading) return;
        uploadFile();
    }

    return (
        <>

            <Dialog>
                <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                        <PiFilePlusLight />
                        <span>Add File</span>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add new text for typing</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    {isError && <span className="text-red-500">{error.message}</span>}
                    <div className="p-4 rounded-xl bg-background cursor-pointer border-1 border-blue-300 inset-shadow-blue-300 shadow-md text-foreground"
                        onClick={() => inputRef.current?.click()}>
                        <Input
                            type="file"
                            ref={inputRef}
                            accept=".pdf,.txt"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-600 hidden"
                            placeholder="Upload either text file or pdf"
                        />
                        { file ? file : "No file selected"}
                    </div>
                    <Input
                        type="text"
                        onChange={(e) => setTitle(e.target.value)}
                        className={clsx(styles.input)}
                        placeholder="Enter title"
                        value={title}
                    />
                    <Input
                        type="text"
                        onChange={(e) => setSubject(e.target.value)}
                        className={clsx(styles.input)}
                        placeholder="Enter subject"
                        value={subject}
                    />
                    <Button onClick={handleUpload}>{ isUploading ? "Uploading...": "Upload" }</Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
