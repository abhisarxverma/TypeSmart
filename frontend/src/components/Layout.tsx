import clsx from "clsx";
import styles from "./Layout.module.css";
import Header from "./Header";

export default function Layout({ children }:{ children : React.ReactNode }) {
    return (
        <div className={clsx(styles.container, "container mx-auto px-4 max-w-screen-lg")}>
            <Header />
            <main className={clsx(styles.main, "bg-background flex-1 mt-5")}>
                {children}
            </main>
        </div>
    )
}