import type { Group } from "@/Types/Library";
import { timeAgo } from "@/utils/text";
import { memo } from "react";
import { FaHashtag, FaLayerGroup } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { giveGroupDetailsRoute } from "@/utils/routing";
import { useMode } from "@/Hooks/useMode";

function GroupCard({ group }: { group: Group }) {

    const navigate = useNavigate();
    const { mode } = useMode();
    const groupDetailsRoute = giveGroupDetailsRoute(group.id, mode);

    return (
        <div onClick={() => navigate(groupDetailsRoute)} className="relative min-h-[145px] p-5 rounded-lg border-1 border-border bg-card-dark flex flex-col justify-between transition-all duration-300 hover:bg-card cursor-pointer">
            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <p className="font-semibold">{group.name}</p>
                </div>
                <div className="flex items-center text-muted-foreground text-[.8rem] gap-1">
                    <FaHashtag />
                    <span className="">{group.tag}</span>
                </div>
            </div>
            <div className="text-muted-foreground pt-2 mt-5 text-[.7rem] border-t-2 border-secondary flex items-center justify-between">
                <p className="text-[.8rem] flex items-center gap-1"><FaLayerGroup /><span>{group.group_texts.length ?? 0} texts</span></p>
                <p>{timeAgo(group.created_at)}</p>
            </div>
        </div>
    )
}

export default memo(GroupCard, (prevProps, nextProps) => {
    return (
        prevProps.group.name === nextProps.group.name &&
        prevProps.group.group_texts === nextProps.group.group_texts &&
        prevProps.group.created_at === nextProps.group.created_at
    );
});
