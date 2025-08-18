import TypingInterface from "@/components/MyWindowTypingInterface";
import clsx from "clsx";

export default function HomePage() {

    return (
        <>
            <h1 className={clsx("text-heading text-center")}>Typing Interface</h1>
            <TypingInterface />
        </>
    )
}