import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TextsList from "@/components/library/TextsList";
import GroupsList from "@/components/library/GroupsList";
import { useLibrary } from "@/Hooks/useLibrary";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import NewGroupDialog from "@/components/library/NewGroupDialog";

export default function Library() {

    const { library, isFetchingLibrary } = useLibrary();

    console.log("LIBRARY : ", library);

    if (isFetchingLibrary) {
        return (
            <div className="min-h-screen">
                <Loader2 className="animate-spin text-5xl" />
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-heading">Library</h1>
                <div className="flex items-center">
                    <NewGroupDialog>
                        <Button variant="ghost"><FaPlus /><span className="font-semibold">New group</span></Button>
                    </NewGroupDialog>
                    <Button variant="ghost" asChild>
                        <Link to="/app/add-text">
                            <FaPlus /><span className="font-semibold">New text</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="texts" className="mt-10">
                <TabsList>
                    <TabsTrigger value="texts">Texts</TabsTrigger>
                    <TabsTrigger value="groups">Groups</TabsTrigger>
                </TabsList>
                <TabsContent className="h-auto" value="texts">
                    <TextsList texts={library.texts} />
                </TabsContent>
                <TabsContent value="groups">
                    <GroupsList groups={library.groups} />
                </TabsContent>
            </Tabs>
        </>
    )
}