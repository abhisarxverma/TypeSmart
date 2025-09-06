import SearchBar from "../SearchBar";
import EmptyList from "./TextDetails/EmptyList";
import TextCard from "./cards/TextCard";
import ListLayout from "../layouts/ListLayout";
import { useMemo, useState } from "react";
import { useLibrary } from "@/Hooks/useLibrary";
import LoaderPage from "@/pages/utils/LoaderPage";
import { useSearch } from "@/Hooks/useSearch";
import type { Text } from "@/Types/Library";
import NoResults from "../NoResults";

export default function TextsList() {

    const { library, isFetchingLibrary } = useLibrary();
    const [ searchQuery, setSearchQuery ] = useState<string>("");
    const texts: Text[] = useSearch(library.texts, searchQuery, ["title", "tag"]);

    const renderedTexts = useMemo(() => {
        return texts.map((text) => <TextCard text={text} key={text.id} />);
    }, [texts]);

    if (isFetchingLibrary) return <LoaderPage />

    return (
        <>
            <SearchBar querySetterFn={setSearchQuery} placeHolder="Search texts in your library...." />
            {texts.length <= 0 ? 
                !searchQuery ? <EmptyList category="texts" /> : <NoResults /> : (
                <ListLayout addClass="mt-5">
                    {renderedTexts}
                </ListLayout>
            )}
        </>
    )
}