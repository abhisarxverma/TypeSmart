import { MdOutlineUploadFile } from "react-icons/md";
import { Button } from "../../ui/button";
import { FaPlus } from "react-icons/fa6";
import { FaLayerGroup } from "react-icons/fa";
import { Link } from "react-router-dom";
import { giveAddTextRoute } from "@/utils/routing";
import NewGroupDialog from "../NewGroupDialog";

export default function EmptyList({ category }: { category: "texts" | "groups" }) {
    return (
        <div className="w-full min-h-70 flex flex-col gap-2 items-center justify-center border-2 border-secondary bg-card-secondary border-dashed rounded-md mt-5">
            {category === "texts" ? <MdOutlineUploadFile className="text-[3rem] text-muted-foreground" /> : <FaLayerGroup className="text-[3rem] text-muted-foreground" /> }
            <p className="font-semibold">No {category} yet</p>
            <p className="text-muted-foreground text-sm">{ category === "texts" ? "Upload your first text" : "Create your first group" } to practice typing smartly</p>
            {category === "texts" && <Button asChild variant="ghost" className="mt-4"><Link to={giveAddTextRoute()}><FaPlus />Add First Text</Link></Button>}
            {category === "groups" && <NewGroupDialog><Button variant="ghost" className="mt-4"><FaPlus />Create First Group</Button></NewGroupDialog>}
        </div>
    )
}