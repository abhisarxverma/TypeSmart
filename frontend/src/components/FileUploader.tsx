"use client";
import { useTypingText } from "@/Hooks/useTypingText";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import { normalizeForTyping } from "@/utils/text";

// 👇 tell pdfjs where its worker lives
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;


export default function FileUploader() {
    const { setTypingText } = useTypingText();
    const inputRef = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type === "text/plain") {
            // TXT extraction
            const reader = new FileReader();
            reader.onload = () => {
                const content = reader.result as string;
                console.log("Uploaded text : ", content)
                const cleanText = normalizeForTyping(content)
                setTypingText(cleanText);
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
            setTypingText(cleanText);
        } else {
            toast.error("Only PDF and TXT files are supported");
        }

        // reset input so same file can be uploaded again
        if (inputRef.current) inputRef.current.value = "";
        navigate("/")
    };

    return (
        <div className="p-4 border rounded-xl shadow-sm bg-white">
            <input
                type="file"
                ref={inputRef}
                accept=".pdf,.txt"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-600"
            />
        </div>
    );
}
