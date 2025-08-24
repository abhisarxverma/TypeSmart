import styles from "./TextPage.module.css";
import clsx from "clsx";
import { CiTextAlignLeft } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { useLibrary } from "@/Hooks/useLibrary";

export default function TextPage() {

    const { id: textId } = useParams();

    const { library } = useLibrary();

    const text = library?.texts?.find(text => text.id === textId);

    return (
        <div className={clsx(styles.container)}>
            <span className="text-[1rem]">Text</span>
            <p className={styles.pageTitle}><CiTextAlignLeft className="me-2" />{text?.title}</p>
            <div className={styles.textBox}>
                <p>{text?.text}</p>
            </div>
        </div>
    )
}