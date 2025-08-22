
import clsx from "clsx";
import styles from "./AddNewFile.module.css";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useLibrary } from "@/Hooks/useLibrary";
import { FaRegFilePdf } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import * as pdfjsLib from "pdfjs-dist";
import { normalizeForTyping } from "@/utils/text";
import { toast } from "react-hot-toast";
import { Loader } from "lucide-react";
import { useParams } from "react-router-dom";
import type { Folder } from "@/Types/Library";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

type Mode = "idle" | "needsRange" | "ready";

export default function PdfUploader() {

    const { library, isFetchingLibrary } = useLibrary();
    const { folderName } = useParams();

    const currentFolder =
        folderName === "home"
            ? null
            : library?.folders?.find((f: Folder) => f.name === folderName) ?? null;

    // form states
    const [title, setTitle] = useState("");
    const [subject, setSubject] = useState("");
    const [text, setText] = useState<string>("");

    const [fileType, setFileType] = useState<"pdf" | "txt" | null>("pdf");

    // pdf-related state
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [mode, setMode] = useState<Mode>("idle");
    const [rangeStart, setRangeStart] = useState<number>(1);
    const [rangeEnd, setRangeEnd] = useState<number>(1);
    const [isExtracting, setIsExtracting] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

    const queryClient = useQueryClient();

    // --- react-query mutation: confirm upload ---
    const { mutate: uploadFile, isPending: isUploading } = useMutation({
        mutationFn: async () => {
            const res = await api.post("/user/upload_file", {
                title,
                text,
                subject,
                folder_id: currentFolder ? currentFolder.id : null,
            });
            const data = res.data;
            if (data?.error) throw new Error(data.error);
            return data;
        },
        onSuccess: () => {
            toast.success(`${title} uploaded successfully`);
            queryClient.invalidateQueries({ queryKey: ["library"] });
            setText("");
            setTitle("");
            setSubject("");
            setMode("idle");
            setFile(null);
            setNumPages(null);
            setFileUrl((prev) => {
                if (prev) URL.revokeObjectURL(prev);
                return null;
            });
        },
        onError: (err: any) => {
            toast.error(err?.message ?? "Upload failed");
        },
    });

    useEffect(() => {
        return () => {
            if (fileUrl) URL.revokeObjectURL(fileUrl);
        };
    }, [fileUrl]);

    const handlePdfFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (fileUrl) URL.revokeObjectURL(fileUrl);

        const nextUrl = URL.createObjectURL(f);
        setFile(f);
        setFileUrl(nextUrl);

        try {
            const data = await f.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data }).promise;
            pdfDocRef.current = pdf;
            setNumPages(pdf.numPages);

            // if more than 10 pages, ask for a range first
            if (pdf.numPages > 10) {
                setRangeStart(1);
                setRangeEnd(Math.min(10, pdf.numPages));
                setMode("needsRange");
                setText("");
            } else {
                // <=10 pages: extract immediately
                setMode("ready");
                await extractRange(1, pdf.numPages);
            }
        } catch (err: any) {
            toast.error("Failed to read PDF");
            console.error(err);
            setMode("idle");
        } finally {
            // allow re-select of same file
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const handleTextFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFile(f);
        const reader = new FileReader();
        reader.onload = (event) => {
            setText(normalizeForTyping(event.target?.result as string));
        };
        reader.readAsText(f);
    }

    const extractRange = async (start: number, end: number) => {
        const pdf = pdfDocRef.current;
        if (!pdf) return;

        // validate
        if (start < 1 || end < start || end > pdf.numPages) {
            toast.error("Invalid page range");
            return;
        }
        const maxSpan = end - start + 1;
        if (maxSpan > 10) {
            toast.error("Please select up to 10 pages");
            return;
        }

        setIsExtracting(true);
        try {
            let extracted = "";
            for (let i = start; i <= end; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                const pageText = (textContent.items as any[])
                    .map((it) => (it as any).str)
                    .join(" ");
                extracted += pageText + "\n";
            }
            const clean = normalizeForTyping(extracted);
            setText(clean);
            setMode("ready");
        } catch (err) {
            console.error(err);
            toast.error("Failed to extract text");
        } finally {
            setIsExtracting(false);
        }
    };

    const canUpload = useMemo(() => {
        return Boolean(title && subject && text && !isUploading);
    }, [title, subject, text, isUploading]);

    if (isFetchingLibrary) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader className="animate-spin" size={"2rem"} />
        </div>
    )

    return (
        <section className={styles.container}>
            <div>
                <div className="flex flex-col">
                    <span className="text-caption font-bold">Folder</span>
                    <span className="text-subheading mt-[-.3rem]">{currentFolder?.name ?? "Home"}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 md:mb-0">
                    <p className="text-heading font-bold my-3">Add new file</p>
                    <div className="flex items-center gap-1 border-1 rounded-md">
                        <Button variant={`${fileType === "pdf" ? "secondary" : "outline"}`} onClick={() => setFileType("pdf")}>Pdf</Button>
                        <Button variant={`${fileType === "txt" ? "secondary" : "outline"}`} onClick={() => setFileType("txt")}>Txt File</Button>
                        <Button variant={`${fileType === null ? "secondary" : "outline"}`} onClick={() => setFileType(null)}>Text</Button>
                    </div>
                </div>
            </div>

            <div className={clsx(styles.topSection, "mb-10")}>
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

                {fileType !== null && <div
                    className={clsx(styles.uploaderBox, "rounded-md bg-accent cursor-pointer py-5")}
                    onClick={() => inputRef.current?.click()}
                >
                    <FaRegFilePdf size="2rem" />
                    <p className="text-body-sm font-bold">Upload File</p>
                    <Button variant="outline">Select File</Button>

                    {fileType === "pdf" && <Input
                        type="file"
                        name="file"
                        ref={inputRef}
                        accept=".pdf"
                        onChange={handlePdfFileChange}
                        className="w-full text-sm text-gray-600 hidden"
                        placeholder="Upload PDF"
                    />}

                    {fileType === "txt" && <Input
                        type="file"
                        name="file"
                        ref={inputRef}
                        accept=".txt"
                        onChange={handleTextFileChange}
                        className="w-full text-sm text-gray-600 hidden"
                        placeholder="Upload Text file"
                    />}

                    {file && (
                        <div className="mt-2 text-sm text-gray-600">
                            <div>Selected: {file.name}</div>
                        </div>
                    )}
                </div>}
            </div>

            <div className={clsx(styles.cleaningSection)}>
                <p className="text-section-heading font-bold mb-3">Clean Text Here</p>

                {mode === "needsRange" && (
                    <div className="mb-4 grid grid-cols-3 gap-2 ">
                        <div>
                            <label className="block text-sm mb-1 self-start">Start page</label>
                            <Input
                                type="number"
                                min={1}
                                max={numPages ?? undefined}
                                value={rangeStart}
                                onChange={(e) => setRangeStart(parseInt(e.target.value || "1", 10))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm mb-1">End page</label>
                            <Input
                                type="number"
                                min={1}
                                max={numPages ?? undefined}
                                value={rangeEnd}
                                onChange={(e) => setRangeEnd(parseInt(e.target.value || "1", 10))}
                            />
                            <p className="mt-1 text-xs text-muted-foreground">Max 10 pages at once</p>
                        </div>
                        <div className="flex gap-2 self-center">
                            <Button
                                onClick={() => extractRange(rangeStart, rangeEnd)}
                                disabled={isExtracting}
                            >
                                {isExtracting ? "Extracting..." : "Extract text"}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                    <div className="flex-1">
                        <Textarea
                            className="min-h-[400px] scroll-auto"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder={
                                fileType === "pdf" ? mode === "idle"
                                    ? "Upload file to extract text"
                                    : mode === "needsRange"
                                        ? "Pick a page range ≤ 10, then extract"
                                        : "Edit extracted text here"
                                    : fileType === "txt" ? "Upload Text file to extract text" : "Put your text here directly..."
                            }
                        />
                    </div>
                    {fileType === "pdf" && <div className="flex-1 self-start border rounded overflow-hidden">
                        {fileUrl ? (
                            <iframe
                                src={fileUrl}
                                className="w-full h-[400px] md:h-[600px]"
                                title="PDF preview"
                            />)
                            : (
                                <div className="h-full flex items-center justify-center text-sm text-muted-foreground p-6">
                                    PDF preview will appear here after selecting a file
                                </div>
                            )}
                    </div>}
                </div>

                <div className="mt-6 flex gap-2 justify-end">
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setText("");
                            setFile(null);
                            setNumPages(null);
                            setFileUrl((prev) => {
                                if (prev) URL.revokeObjectURL(prev);
                                return null;
                            });
                            setMode("idle");
                        }}
                    >
                        Reset
                    </Button>
                    <Button onClick={() => uploadFile()} disabled={!canUpload}>
                        {isUploading ? "Uploading..." : "Confirm upload"}
                    </Button>
                </div>
            </div>
        </section>
    );
}
