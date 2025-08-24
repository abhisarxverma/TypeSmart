import clsx from "clsx";
import styles from "./Layout.module.css";

export default function Layout({ children }:{ children : React.ReactNode }) {
    return (
        <div className={clsx(styles.container, "container mx-auto px-4 max-w-screen-xl")}>
            <main className={clsx(styles.main, "bg-[transparent] flex-1 mt-5")}>
                {children}
            </main>
        </div>
    )
}