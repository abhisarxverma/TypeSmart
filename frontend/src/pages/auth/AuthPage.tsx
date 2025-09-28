import { Button } from "@/components/ui/button";
import { useAuth } from "@/Hooks/useAuth";
import { giveLibraryRoute } from "@/utils/routing";
import { FaGoogle } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png"

export default function AuthPage() {

    const { user, signInWithGoogle } = useAuth();
    const navigate = useNavigate();
    if (user) navigate(giveLibraryRoute("main"))

    return (
        <div className="flex items-center justify-center min-h-svh">
            <div className="flex items-center justify-center flex-col max-w-[320px] mx-auto text-center bg-transparent border-2 border-accent py-7 px-5 rounded-md">
                <img src={logo} alt="logo image of typesmart" className="aspect-square w-17 mb-5" />
                <p className="font-semibold text-heading">TypeSmart</p>
                <p className="text-muted-foreground font-semibold text-subheading-lg mb-5 mt-1">Productive chill typing mode</p>
                <p className="text-muted-foreground text-subheading max-w-full mb-5">Add your own texts, make groups, and just type with the flow. Try a new way of learning.</p>
                <Button onClick={signInWithGoogle} className="w-full"><FaGoogle /> One click login / signup</Button>
            </div>
        </div>
    )
}