import TypingInterface from "@/components/MyWindowTypingInterface";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Link } from "react-router-dom";

export default function HomePage() {

    return (
        <>  
            <div className="flex items-center justify-between">
                <h1 className={clsx("text-heading")}>Typing Interface</h1>
                <Button asChild>
                    <Link to="/library">Change text</Link>
                </Button>
            </div>
            <TypingInterface />
        </>
    )
}