
import clsx from "clsx";
import styles from "./AddNewTextFileUploader.module.css";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import * as pdfjsLib from "pdfjs-dist";
import { normalizeForTyping } from "@/Utils/text";
import { toast } from "react-hot-toast";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

type Mode = "idle" | "needsRange" | "ready";

export default function AddNewTextForm({ fileType, text, textSettingFn } : {fileType: "pdf" | "txt" | null, text: string, textSettingFn : React.Dispatch<React.SetStateAction<string>>}) {

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
                textSettingFn("");
            } else {
                // <=10 pages: extract immediately
                await extractRange(1, pdf.numPages);
                setMode("ready");
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
            textSettingFn(normalizeForTyping(event.target?.result as string));
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
            textSettingFn(clean);
            setMode("ready");
        } catch (err) {
            console.error(err);
            toast.error("Failed to extract text");
        } finally {
            setIsExtracting(false);
        }
    };


    return (
        <section className={styles.container}>

            <div className={clsx(styles.topSection)}>

                {fileType !== null && <div
                    className={clsx(styles.uploaderBox, "rounded-md cursor-pointer py-5")}
                    
                >
                    <Button onClick={() => inputRef.current?.click()} className={styles.uploaderButton} variant="outline">Select {fileType === "pdf" ? "PDF" : "Text"} File</Button>

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
                <div className="flex items-center justify-between mb-3">
                    <p className="text-section-heading font-bold mb-3">Preview and clean text</p>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            textSettingFn("");
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
                </div>

                {mode === "needsRange" && (
                    <div className="mb-4 grid grid-cols-3 gap-2 ">
                        <div className="">
                            <label className="block text-sm mb-1 self-start">Start page</label>
                            <Input
                                type="number"
                                min={1}
                                max={numPages ?? undefined}
                                value={rangeStart}
                                onChange={(e) => setRangeStart(parseInt(e.target.value || "1", 10))}
                            />
                        </div>
                        <div className="">
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
                            className="min-h-[400px] scroll-auto border-1 border-accent"
                            value={text}
                            onChange={(e) => textSettingFn(e.target.value)}
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
            </div>
        </section>
    );
}
