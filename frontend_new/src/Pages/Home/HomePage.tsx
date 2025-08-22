import { Button } from "@/components/ui/button";
import { useAuth } from "@/Hooks/useAuth"
import api from "@/lib/axios";

export default function HomePage() {

    const { user, signOut } = useAuth();

    async function test() {
        try {
            const res = await api.get("/user/add_in_group");
            const data = res.data;

            console.log("Test result : ", data);

            if (data.error) {
                console.log("Error in testing : ", data.error);
                return null;
            }

            return data
        } catch (error) {
            console.log("Error in Testing : ", error);
            return null;
        }
    }

    return (
        <>
            <h1>Welcome {user?.full_name ?? "User"}</h1>
            <Button onClick={signOut}>Logout</Button>
            <Button onClick={test}>Test adding</Button>
        </>
    )
}