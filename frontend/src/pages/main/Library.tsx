import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TextsList from "@/components/library/TextsList";
import GroupsList from "@/components/library/GroupsList";
import { useLibrary } from "@/Hooks/useLibrary";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewGroupDialog from "@/components/library/NewGroupDialog";
import { useMode } from "@/Hooks/useMode";
import { useProtectFeature } from "@/utils/protection";
import { giveAddTextRoute } from "@/utils/routing";

export default function Library() {

    const { library, isFetchingLibrary } = useLibrary();

    const navigate = useNavigate();
    const { mode } = useMode();

    console.log("LIBRARY : ", library);

    function navigateToAddText() {
        navigate(giveAddTextRoute());
    }

    const handleAddTextClick = useProtectFeature(navigateToAddText, mode);


    if (isFetchingLibrary) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center gap-2">
                <span>Loading your library</span> <Loader2 className="animate-spin text-5xl" />
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
                    <Button variant="ghost" onClick={handleAddTextClick}>
                        <FaPlus /><span className="font-semibold">New text</span>
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="texts" className="mt-10">
                <TabsList>
                    <TabsTrigger value="texts">Texts</TabsTrigger>
                    <TabsTrigger value="groups"> Groups</TabsTrigger>
                </TabsList>
                <TabsContent className="h-auto" value="texts">
                    <TextsList />
                </TabsContent>
                <TabsContent value="groups">
                    <GroupsList />
                </TabsContent>
            </Tabs>
        </>
    )
}