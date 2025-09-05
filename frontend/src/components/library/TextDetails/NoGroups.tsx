import { Button } from "@/components/ui/button";
import { FaPlus } from "react-icons/fa6";
import AddInGroupDialog from "./AddInGroupDialog/AddInGroupDialog";
import type { Text } from "@/Types/Library";

export default function NoGroups({text}:{text:Text}) {

    return (
        <div className="bg-card-dark border-1 border-border rounded-md w-[400px] max-w-[90vw] h-[150px] flex items-center justify-center">
            <AddInGroupDialog presentInGroups={[]} text={text}>
                <Button variant="ghost" className="text-xl font-semibold text-muted-foreground h-full w-full">
                    <FaPlus />
                    Add in group
                </Button>
            </AddInGroupDialog>
        </div>
    )
}