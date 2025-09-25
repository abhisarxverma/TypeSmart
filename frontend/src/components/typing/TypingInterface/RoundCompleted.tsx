import { Button } from "@/components/ui/button";
import { useMode } from "@/Hooks/useMode";
import { giveLibraryRoute } from "@/utils/routing";
import Confetti from "react-confetti";
import { VscDebugRestart } from "react-icons/vsc";
import { Link } from "react-router-dom";
import { useWindowSize } from "react-use";

export default function RoundCompleted({ wpm, restartFn }: { wpm: number, restartFn: () => void }) {

    const { width, height } = useWindowSize();
    const { mode } = useMode();

    return (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <Confetti 
                width={width} 
                height={height}
                numberOfPieces={50}       
                gravity={0.05}             
                initialVelocityY={5}       
                friction={0.99}            
            />
            <h1 className="text-6xl font-bold mb-6">WPM: {wpm}</h1>
            <div className="flex gap-4">
                <Button onClick={restartFn}><VscDebugRestart /> Restart</Button>
                <Button variant="secondary" asChild>
                    <Link to={giveLibraryRoute(mode)}>Go to Library</Link>
                </Button>
            </div>
        </div>
    )

}