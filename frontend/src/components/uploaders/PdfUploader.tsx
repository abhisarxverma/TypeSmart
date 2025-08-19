import { useRef } from "react";
import { Input } from "../ui/input";
import clsx from "clsx";
import styles from "./PdfUploader.module.css";
import { FaRegFilePdf } from "react-icons/fa6";
import { Button } from "../ui/button";

export default function PdfUploader() {

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <>
            <div className={clsx(styles.uploaderBox, "rounded-md")}
                onClick={() => inputRef.current?.click()}>
                    
                <FaRegFilePdf size={"2rem"} />

                <Button variant={"outline"}>Select File</Button>

                <Input
                    type="file"
                    ref={inputRef}
                    accept=".pdf"
                    onChange={() => console.log("changed")}
                    className="w-full text-sm text-gray-600 hidden"
                    placeholder="Upload pdf"
                />
            </div>
        </>
    )
}