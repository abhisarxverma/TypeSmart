import { Loader2 } from "lucide-react";

export default function LoaderPage() {
    return (
        <div className="min-h-[500px] flex items-center justify-center">
            <Loader2 className="text-3xl animate-spin" />
            <p>Typesmart</p>
        </div>
    )
}