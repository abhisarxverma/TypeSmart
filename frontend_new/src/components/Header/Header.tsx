import { FaGithub} from "react-icons/fa";
import { GoHome } from "react-icons/go";
import styles from "./Header.module.css";
import { LuLibrary } from "react-icons/lu";
import { CiKeyboard } from "react-icons/ci";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";

export default function Header () {

    const navigate = useNavigate();

    return (
        <header className="px-4 flex items-center justify-between py-2 border-b-2"> 
            <span className={styles.title}>Typefreaks</span>
            <div className={styles.tabs}>
                <GoHome onClick={() => navigate("/")} className="me-2 hover:text-primary" size={"1.3rem"} />
                <button onClick={() => navigate("/typing")} className={clsx(styles.tab)}><CiKeyboard size={"1.3rem"} />Typeboard</button>
                <button onClick={() => navigate("/library")} className={styles.tab}><LuLibrary size={"1.3rem"} />Library</button>
                <FaGithub className="ms-2 hover:text-primary" size={"1.3rem"} />
            </div>
        </header>
    )
}