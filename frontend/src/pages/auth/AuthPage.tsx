import { Button } from "@/components/ui/button";
import { useAuth } from "@/Hooks/useAuth";
import { FaGoogle } from "react-icons/fa6";

export default function AuthPage() {

    const { signInWithGoogle } = useAuth();

    return (
        <div className="flex items-center justify-center min-h-svh">
            <div className="flex items-center justify-center flex-col max-w-[320px] mx-auto text-center bg-transparent border-2 border-accent py-7 px-5 rounded-md">
                <img src="/logo.png" alt="logo image of typesmart" className="aspect-square w-17 mb-5" />
                <p className="font-semibold text-heading">TypeSmart</p>
                <p className="text-muted-foreground font-semibold text-subheading-lg mb-5 mt-1">Productive chill typing mode</p>
                <p className="text-muted-foreground text-subheading max-w-full mb-5">Add your own texts, make groups, and just type with the flow. Try a new way of learning.</p>
                <Button onClick={signInWithGoogle} className="w-full"><FaGoogle /> One click login / signup</Button>
            </div>
        </div>
    )
}