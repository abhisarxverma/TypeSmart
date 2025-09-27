import clsx from "clsx";
import styles from "./TypingPage.module.css";
import TypingInterface from "@/components/TypingInterface/TypingInterface";

export default function TypingPage() {
    return (
        <>
            <h1 className={clsx(styles.pageTitle)}>TypeBoard</h1>
            <TypingInterface />
        </>
    )
}