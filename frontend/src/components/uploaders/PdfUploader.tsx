import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";
import * as pdfjsLib from "pdfjs-dist";
import { normalizeForTyping } from "@/utils/text";
import { toast } from "react-hot-toast";
import { MdOutlineFileUpload, MdClose } from "react-icons/md";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

type Mode = "idle" | "ready";

export default function PdfUploader({
    text,
  textSettingFn,
}: {
    text: string,
  textSettingFn: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [mode, setMode] = useState<Mode>("idle");

  const inputRef = useRef<HTMLInputElement>(null);
  const pdfDocRef = useRef<pdfjsLib.PDFDocumentProxy | null>(null);

  useEffect(() => {
    return () => {
      if (fileUrl) URL.revokeObjectURL(fileUrl);
    };
  }, [fileUrl]);

  const handlePdfFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
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
      setRangeStart(1);
      setRangeEnd(Math.min(20, pdf.numPages));
      setMode("ready");
    } catch (err) {
      toast.error("Failed to read PDF");
      console.error(err);
      setMode("idle");
    } finally {
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const extractRange = async (start: number, end: number) => {
    const pdf = pdfDocRef.current;
    if (!pdf) return;

    if (start < 1 || end < start || end > pdf.numPages) {
      toast.error("Invalid page range");
      return;
    }
    if (end - start + 1 > 20) {
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
      textSettingFn((prev) => prev + clean);
    } catch (err) {
      console.error(err);
      toast.error("Failed to extract text");
    } finally {
      setIsExtracting(false);
    }
  };

  const resetUpload = () => {
    setFile(null);
    setFileUrl(null);
    setNumPages(null);
    setMode("idle");
    pdfDocRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <section className="space-y-4">
      {!fileUrl && (
        <div
          className="w-full h-full flex flex-col gap-2 items-center justify-center border-2 border-secondary bg-card-secondary border-dashed rounded-md p-6 py-10"
          onClick={() => inputRef.current?.click()}
        >
          <MdOutlineFileUpload className="text-[3rem] text-muted-foreground w-15 h-auto p-2 aspect-square bg-secondary rounded-full" />
          <p className="font-semibold">Upload a PDF</p>
          <p className="text-muted-foreground text-sm">Upload a PDF to extract text</p>
          <Button variant="secondary" className="mt-4">
            Select file
          </Button>
          <Input
            type="file"
            name="file"
            ref={inputRef}
            accept=".pdf"
            onChange={handlePdfFileChange}
            className="hidden"
          />
        </div>
      )}

      {fileUrl && (
        <div className="space-y-4">
          <div className="relative">
            <iframe
              src={fileUrl}
              className="w-full h-[400px] md:h-[90vh] border rounded"
              title="PDF preview"
            />
            <button
              onClick={resetUpload}
              className="absolute top-2 right-2 bg-secondary p-1 rounded-full hover:bg-muted"
            >
              <MdClose className="text-lg" />
            </button>
          </div>

          {mode === "ready" && (
            <div className="grid grid-cols-3 gap-2 items-end">
              <div className="self-start col-start-1 col-end-2">
                <label className="block text-sm mb-1">Start page</label>
                <Input
                  type="number"
                  min={1}
                  max={numPages ?? undefined}
                  value={rangeStart}
                  onChange={(e) =>
                    setRangeStart(parseInt(e.target.value || "1", 10))
                  }
                />
              </div>
              <div className="col-start-2 col-end-3">
                <label className="block text-sm mb-1">End page</label>
                <Input
                  type="number"
                  min={1}
                  max={numPages ?? undefined}
                  value={rangeEnd}
                  onChange={(e) =>
                    setRangeEnd(parseInt(e.target.value || "1", 10))
                  }
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Max 20 pages at once
                </p>
              </div>
              <div className="self-center col-start-3 col-end-4">
                <Button
                  onClick={() => extractRange(rangeStart, rangeEnd)}
                  disabled={isExtracting}
                  className="w-full"
                  variant="secondary"
                >
                  {text==="" ? (isExtracting ? "Extracting..." : "Extract text") : (isExtracting ? "Adding..." : "Add text")}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
