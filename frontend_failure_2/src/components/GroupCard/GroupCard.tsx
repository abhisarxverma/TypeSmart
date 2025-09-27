import type { Group } from "@/lib/Types/Library";
import { RxKeyboard } from "react-icons/rx";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";
import GroupDialog from "../GroupDialog/GroupDialog";
import { IoOpenOutline } from "react-icons/io5";

export default function GroupCard({ group }: {group: Group}) {

    const [dialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <>
            <GroupDialog open={dialogOpen} setOpen={setDialogOpen} group={group} />
            <div className="rounded px-3 py-2 shadow bg-background gap-y-4 flex items-center justify-between ">
                <div className="gap-y-2 row-end-2 flex flex-col">
                    <span className="text-lg">{group.name}</span>
                    {group.subject && <Badge variant="secondary" className="rounded" >{group.subject}</Badge>}
                </div>
                <Button className="" variant={"ghost"} onClick={() => setDialogOpen(true)}><IoOpenOutline /></Button>
                {/* <Button className="col-start-1 col-end-3 row-start-2 row-end-3 self-center"  variant="outline"><RxKeyboard /> Start Typing</Button> */}
            </div>
        </>
    )
}