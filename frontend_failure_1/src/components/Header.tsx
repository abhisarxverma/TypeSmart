import clsx from "clsx";
import styles from "./Header.module.css";
import { BsKeyboardFill } from "react-icons/bs";

export default function Header() {

    return (
        <header className={clsx(styles.header, "text-heading")}>
            <div className={clsx(styles.textGroup)}>
                <BsKeyboardFill size={"2.5rem"}/>
                <p className={clsx(styles.title)}>Typefreaks</p>
            </div>
        </header>
    )
}