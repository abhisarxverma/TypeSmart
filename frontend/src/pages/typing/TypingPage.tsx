import TypingInterface from "@/components/typing/TypingInterface/TypingInterface";
import { FaFile, FaLayerGroup } from "react-icons/fa6";

export default function TypingPage() {
    return (

        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-10">
                <span className="text-xl flex text-muted-foreground gap-2"><FaFile /> Text : <span className="font-semibold">Demo</span></span>
                <span className="text-xl text-muted-foreground flex items-center gap-2"><FaLayerGroup /> Group : <span className="font-semibold">Demo</span></span>
            </div>
            <TypingInterface />
        </div>

    )
}