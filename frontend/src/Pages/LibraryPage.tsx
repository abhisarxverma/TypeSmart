import clsx from "clsx";
import styles from "./LibraryPage.module.css";
import FileUploader from "@/components/FileUploader";

export default function LibraryPage() {
    return (
        <>
            <h1 className={clsx(styles.title, "text-foreground")}>This is library page</h1>
            <h3>Upload whatever you want to type</h3>
            <FileUploader />
        </>
    )
}