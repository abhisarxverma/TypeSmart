import clsx from "clsx";
import styles from "./AddTextPage.module.css";
import { BsFiletypePdf } from "react-icons/bs";
import { BsFileEarmarkText } from "react-icons/bs";
import { FaRegEdit } from "react-icons/fa";
import AddNewTextForm from "@/components/AddNewTextFileUploader/AddNewTextFileUploader";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AddTextPage() {

  const [title, setTitle] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [text, setText] = useState<string>("")
  const [importance, setImportance] = useState<string>("");
  const [fileType, setFileType] = useState<"pdf" | "txt" | null>("pdf");

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  // --- react-query mutation: confirm upload ---
  const { mutate: addText, isPending: isAddingText } = useMutation({
    mutationFn: async () => {
      const res = await api.post("/user/add_text", {
        title,
        text,
        subject,
        importance
      });
      const data = res.data;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      toast.success(`Text added successfully`);
      queryClient.invalidateQueries({ queryKey: ["library"] });
      navigate("/library");
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Upload failed");
    },
  });

  function handleSubmit() {
    if (isAddingText) return;
    addText();
  }

  const canUpload = useMemo(() => {
    return Boolean(title && subject && text && !isAddingText);
  }, [title, subject, text, isAddingText]);

  return (
    <div className={styles.container}>
      <h1 className={clsx(styles.pageTitle)}>Add New Text</h1>
      <div className={clsx(styles.inputsBox)}>
        <div className={clsx(styles.inputGroup)}>
          <label htmlFor="title">Title</label>
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
        <div className={clsx(styles.inputGroup)}>
          <label htmlFor="importance">Importance</label>
          <Select onValueChange={setImportance} >
            <SelectTrigger className={clsx("w-full", styles.input)}>
              <SelectValue placeholder="Select Importance" />
            </SelectTrigger>
            <SelectContent >
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <p className={clsx(styles.subtitle)}>Upload PDFs, text files or paste content direclty</p>
      <div className={clsx(styles.uploadOptionsBox)}>
        <div onClick={() => setFileType("pdf")} className={clsx(styles.pdfOption, "bg-blue-50")}>
          <BsFiletypePdf className={styles.optionIcon} />
          <span className={styles.optionTitle}>Upload PDF</span>
          <p className={styles.optionSubtitle}>Extract text from PDF documents</p>
        </div>
        <div onClick={() => setFileType("txt")} className={clsx(styles.pdfOption, "bg-green-50")}>
          <BsFileEarmarkText className={styles.optionIcon} />
          <span className={styles.optionTitle}>Upload Text Files</span>
          <p className={styles.optionSubtitle}>Import .txt files directly</p>
        </div>
        <div onClick={() => setFileType(null)} className={clsx(styles.pdfOption, "bg-yellow-50")}>
          <FaRegEdit className={styles.optionIcon} />
          <span className={styles.optionTitle}>Paste Text</span>
          <p className={styles.optionSubtitle}>Copy and paste text directly</p>
        </div>
      </div>
      <AddNewTextForm fileType={fileType} textSettingFn={setText} text={text} />
      <div className="mt-6 flex gap-2 justify-end">
        <Button onClick={handleSubmit}
          disabled={!canUpload}>
          {isAddingText ? <Loader2 className="animate-spin" /> : "Add Text"}
        </Button>
      </div>
    </div>
  )
}
