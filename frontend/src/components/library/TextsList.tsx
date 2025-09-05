import SearchBar from "../SearchBar";
import EmptyList from "./TextDetails/EmptyList";
import type { Text } from "@/Types/Library";
import TextCard from "./cards/TextCard";
import ListLayout from "../layouts/ListLayout";
import { useMemo } from "react";

export default function TextsList({ texts } : { texts : Text[] }) {

    const renderedTexts = useMemo(() => {
        return texts.map((text) => <TextCard text={text} key={text.id} />);
    }, [texts]);


    return (
        <>
            <SearchBar placeHolder="Search groups...." />
            {texts.length <= 0 ? <EmptyList category="texts" /> : (
                <ListLayout addClass="mt-5">
                    {renderedTexts}
                </ListLayout>
            )}
        </>
    )
}