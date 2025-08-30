import styles from "./TextPage.module.css";
import clsx from "clsx";
import { CiTextAlignLeft } from "react-icons/ci";
import { useParams } from "react-router-dom";
import { useLibrary } from "@/Hooks/useLibrary";
import { Badge } from "@/components/ui/badge";

export default function TextPage() {

    const { id: textId } = useParams();

    const { library } = useLibrary();

    const text = library?.texts?.find(text => text.id === textId);

    return (
        <div className={clsx(styles.container)}>
            <div className={clsx(styles.left)}>
                <span className="text-[1rem]">Text</span>
                <p className={styles.pageTitle}><CiTextAlignLeft className="me-2" />{text?.title}</p>
                <div className="flex gap-3 mt-5">
                    <div className="flex flex-col">
                        <span className="text-[.8rem]">Subject</span>
                        <span>{text?.subject}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[.8rem]">Importance</span>
                        <span>{text?.importance}</span>
                    </div>
                </div>
                <div className={styles.textBox}>
                    <p>{text?.text}</p>
                </div>
            </div>
            <div className={clsx(styles.right)}>

            </div>
        </div>
    )
}