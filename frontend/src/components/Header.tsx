import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { giveTypingPageRoute } from "@/utils/routing";
import { useAuth } from "@/Hooks/useAuth";
import { useMode } from "@/Hooks/useMode";

export default function Header() {

    const { mode } = useMode();
    const { user, signOut, signInWithGoogle, hasCheckedAuth } = useAuth();

    return (
        <header className="flex items-center justify-between border-b border-border py-3 px-3 md:px-8">
            <div className="flex items-center gap-2">
                <img className="h-8 aspect-square" src="/logo.png" alt="Typesmart logo image" />
                <span className="text-xl font-bold">TypeSmart</span>
            </div>
            <nav className="flex items-center gap-1">
                <Button variant="ghost" asChild>
                    <Link to={giveTypingPageRoute(mode)}>Type</Link>
                </Button>
                <Button variant="ghost" asChild>
                    <Link to={mode === "main" ? "/app/library" : "/demo/library"}>Library</Link>
                </Button>
                {user && <Button variant="ghost" onClick={signOut}>Sign out</Button>}
                {!user && hasCheckedAuth && <Button variant="ghost" onClick={signInWithGoogle}>Sign in</Button>}
                <Avatar className="ms-2">
                    <AvatarImage className="" src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </nav>
        </header>
    )
}