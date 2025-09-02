import styles from "./AuthPage.module.css";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/Hooks/useAuth";
import { FaGoogle } from "react-icons/fa";

export default function AuthPage() {

    const { signInWithGoogle } = useAuth();

    return (
        <main className={clsx(styles.main)}>
            <p className={clsx(styles.title, "text-hero")}>One Click Enterance</p>
            <div className="flex gap-2 items-center">
                <FaGoogle size={"3rem"} className="bg-foreground text-background animate-bounce p-2 rounded-full" />
                <Button onClick={signInWithGoogle}>
                    Login/Signup with Google
                </Button>
            </div>
        </main>
    )
}