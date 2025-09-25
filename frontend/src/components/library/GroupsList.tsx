import SearchBar from "./SearchBar";
import EmptyList from "./TextDetails/EmptyList";
import ListLayout from "../layouts/ListLayout";
import GroupCard from "./cards/GroupCard";
import { useLibrary } from "@/Hooks/useLibrary";
import { useMemo, useState } from "react";
import { useSearch } from "@/Hooks/useSearch";
import type { Group } from "@/Types/Library";
import LoaderPage from "@/pages/utils/LoaderPage";
import NoResults from "./NoResults";

export default function GroupsList() {

    const { library, isFetchingLibrary } = useLibrary();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const groups: Group[] = useSearch(library.groups ?? [], searchQuery, ["name", "tag"]);

    const renderedGroups = useMemo(() => {
        return groups.map((group) => <GroupCard group={group} key={group.id} />);
    }, [groups]);

    if (isFetchingLibrary) return <LoaderPage />

    return (
        <>
            <SearchBar querySetterFn={setSearchQuery} placeHolder="Search groups in your library....." />
            {groups.length <= 0 ? 
            !searchQuery ? <EmptyList category="groups" /> : <NoResults /> : (
                <ListLayout addClass="mt-5">
                    {renderedGroups}
                </ListLayout>
            )}
        </>
    )
}