import { Progress } from "@/components/ui/progress";
import { useTyping } from "@/Hooks/useTyping";
import { useEffect, useState } from "react";

export default function ProgressBar({ addClass }: {addClass?: string}) {

    const { progressRef } = useTyping();
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        const id = setInterval(() => {
            setProgress(progressRef.current);
        }, 200);

        return () => clearInterval(id);
    }, [progressRef]);


    return (
        <div className={addClass}>
            <Progress value={progress} />
        </div>
    )
}