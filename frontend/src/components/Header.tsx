import clsx from "clsx";
import styles from "./Header.module.css";
import { BsKeyboardFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export default function Header() {

    return (
        <header className={clsx(styles.header, "text-heading")}>
            <BsKeyboardFill />
            <p className={clsx(styles.title)}>Typefreaks</p>
            <Button asChild>
                <Link to="/library">Change text</Link>
            </Button>
        </header>
    )
}