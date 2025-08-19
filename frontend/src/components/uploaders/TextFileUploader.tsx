import { useRef } from "react";
import { Input } from "../ui/input";
import { BsFileEarmarkText } from "react-icons/bs";
import { Button } from "../ui/button";
import styles from "./TextFileUploader.module.css";
import clsx from "clsx";

export default function TextFileUploader() {

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div className={clsx(styles.uploaderBox, "bg-accent rounded-md")}
            onClick={() => inputRef.current?.click()}>

            <BsFileEarmarkText size={"2rem"} />

            <Button variant={"outline"}>Select File</Button>

            <Input
                type="file"
                ref={inputRef}
                accept=".txt"
                onChange={() => console.log("changed")}
                className="w-full text-sm text-gray-600 hidden"
                placeholder="Upload Txt file"
            />
        </div>

    )
}