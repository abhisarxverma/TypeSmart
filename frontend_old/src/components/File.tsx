
import clsx from "clsx";
import styles from "./File.module.css";
import { CiFileOn } from "react-icons/ci";
import { useTypingText } from "@/Hooks/useTypingText";
import { useNavigate } from "react-router-dom";


interface FileProps {
    title: string;
    text: string;
    subject: string
}

export default function File({ title, text, subject }: FileProps) {

    const { setTypingText } = useTypingText();
    const navigate = useNavigate();

    function handleClick() {
        setTypingText(text);
        navigate("/");
    }

    return (
        <div onClick={handleClick} className={clsx(styles.container, "bg-accent border-1 border-accent")}>

            <CiFileOn className={clsx(styles.fileIcon, "text-zinc-500")} />
            
            <div className={styles.textGroup}>
                <h1 className={clsx(styles.fileName, "text-body-sm")}>{title}</h1>
                <p className={clsx(styles.subject, "text-caption")}>{subject}</p>
            </div>
        </div>
    )
}