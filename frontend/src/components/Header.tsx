import clsx from "clsx";
import styles from "./Header.module.css";
import { BsKeyboardFill } from "react-icons/bs";

export default function Header() {

    return (
        <header className={clsx(styles.header, "text-heading")}>
            <BsKeyboardFill />
            <p className={clsx(styles.title)}>Typefreaks</p>
        </header>
    )
}