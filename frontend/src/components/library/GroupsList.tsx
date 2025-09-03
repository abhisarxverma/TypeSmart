import SearchBar from "../SearchBar";
import EmptyList from "./EmptyList";
import type { Group } from "@/Types/Library";
import ListLayout from "../layouts/ListLayout";
import GroupCard from "./cards/GroupCard";

export default function GroupsList({ groups } : { groups : Group[] }) {
    return (
        <>
            <SearchBar />
            {groups.length <= 0 ? <EmptyList category="groups" /> : (
                <ListLayout addClass="mt-5">
                    {groups.map(group => (<GroupCard group={group} key={group.id} />))}
                </ListLayout>
            )}
        </>
    )
}