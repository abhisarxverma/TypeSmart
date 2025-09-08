import ProgressBar from "@/components/typing/TypingInterface/ProgressBar";
import TypingInterface from "@/components/typing/TypingInterface/TypingInterface";
import { useLibrary } from "@/Hooks/useLibrary";
import { useTyping } from "@/Hooks/useTyping";
import { FaFile, FaLayerGroup } from "react-icons/fa6";

export default function TypingPage() {

    const { state, getCurrentTextName } = useTyping();
    const { library } = useLibrary();

    console.log("Currents state : ", state);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mt-10 mb-15">
                {state.mode === "text" && (
                    <span className="text-xl flex items-center text-muted-foreground gap-2"><FaFile /><span className="font-semibold">{getCurrentTextName()}</span></span>
                )}
                {state.mode === "group" && (
                    <>
                        <span className="text-xl flex items-center text-muted-foreground gap-2"><FaFile /><span className="font-semibold">{getCurrentTextName()}</span></span>
                        <span className="text-xl flex items-center text-muted-foreground gap-2 font-semibold"><FaLayerGroup /> {
                            library.groups.find(g => g.id === state.source?.id)?.name
                        }</span>
                    </>
                )}
            </div>
            <TypingInterface />
            <ProgressBar addClass="mt-10" />
        </div>
    )
}