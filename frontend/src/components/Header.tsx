import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { giveTypingPageRoute } from "@/utils/routing";
import { useAuth } from "@/Hooks/useAuth";
import { useMode } from "@/Hooks/useMode";
import { FaGoogle } from "react-icons/fa6";
import { Badge } from "./ui/badge";
import { LuLogOut } from "react-icons/lu";

import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"
import { useTheme } from "@/Hooks/useTheme";

export default function Header() {

    const { mode } = useMode();
    const { user, signOut, signInWithGoogle, hasCheckedAuth } = useAuth();

    const { theme, setTheme } = useTheme();

    const themes = [
        { name: "Obsidian Dark", value: "obsidian-dark" as const },
        { name: "Solar Night", value: "solar-night" as const },
        { name: "Forest Night", value: "forest-night" as const },
        { name: "Dracula Dark", value: "dracula-dark" as const },
        { name: "Nordic Dark", value: "nordic-dark" as const },
        { name: "Default Dark", value: "default-dark" as const },
    ];

    return (
        <header className="flex items-center justify-between border-b border-border py-3 px-3 md:px-8">
            <div className="flex items-center gap-2 cursor-pointer">
                <img className="h-8 aspect-square" src="/logo.png" alt="Typesmart logo image" />
                <Link to="/home" className="text-xl font-bold">TypeSmart</Link>
                {mode === "demo" && <Badge title="This is demo mode">Demo</Badge>}
            </div>
            <nav className="flex items-center gap-1">
                <Button variant="ghost" asChild>
                    <Link to={giveTypingPageRoute(mode)}>Type</Link>
                </Button>
                <Button variant="ghost" asChild>
                    <Link to={mode === "main" ? "/app/library" : "/demo/library"}>Library</Link>
                </Button>
                <Menubar>
                    <MenubarMenu>
                        <MenubarTrigger className="border-none">
                           Theme ({themes.find(t => t.value === theme)?.name || "default-dark"})
                        </MenubarTrigger>
                        <MenubarContent>
                            {themes.map((themeOption) => (
                                <MenubarItem 
                                    key={themeOption.value}
                                    onClick={() => {
                                        console.log("Setting theme to:", themeOption.value);
                                        setTheme(themeOption.value);
                                    }}
                                    className={theme === themeOption.value ? "bg-accent" : ""}
                                >
                                    {themeOption.name}
                                    {theme === themeOption.value && " ✓"}
                                </MenubarItem>
                            ))}
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                {!user && hasCheckedAuth && <Button variant="ghost" onClick={signInWithGoogle}><FaGoogle /> Sign in</Button>}
                <Avatar className="ms-2">
                    <AvatarImage className="" src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                {user && <Button variant="ghost" onClick={signOut}><LuLogOut /></Button>}
            </nav>
        </header>
    )
}