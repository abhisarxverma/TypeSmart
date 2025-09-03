import { Button } from "@/components/ui/button";
import { useAuth } from "@/Hooks/useAuth";

export default function AuthPage() {

    const { signInWithGoogle } = useAuth();

    return (
        <div className="text-7xl flex items-center justify-center min-h-svh flex-col gap-5">
            <p>Auth Page</p>
            <Button onClick={signInWithGoogle}>One click login/signup</Button>
        </div>
    )
}