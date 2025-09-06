import ListLayout from "@/components/layouts/ListLayout";
import type { Group, Text } from "@/Types/Library";
import NoGroups from "./NoGroups";
import PresentInGroupCard from "./PresentInGroupCard";
import { FaPlus } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import AddInGroupDialog from "./AddInGroupDialog/AddInGroupDialog";

export default function PresentInGroups({ text, groups }:{ text: Text, groups: Group[] }) {
    return (
        <div className="mt-10 flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <p className="my-2">Present in groups</p>
                <AddInGroupDialog text={text} presentInGroups={groups}>
                    <Button variant="outline"><FaPlus /> Add in group</Button>
                </AddInGroupDialog>
            </div>
            {groups.length <= 0 ? (
                <NoGroups text={text} />
            ): (
            <ListLayout addClass="">
                {groups.map(grp => (<PresentInGroupCard textId={text.id} group={grp} key={grp.id} />))}
            </ListLayout>
            )}
        </div>
    )
}