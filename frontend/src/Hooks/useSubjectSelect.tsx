
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import type { Library } from "@/Types/Library"
import { getSubjects } from "@/utils/files";
import { useState } from "react"

export default function useSubjectSelect({ library }: { library: Library }) {

    const [currentSubject, setCurrentSubject] = useState<string>("All");

    const subjects = getSubjects(library);

    const SubjectSelect = () => (
        <Select onValueChange={(value) => setCurrentSubject(value)} value={currentSubject ?? undefined}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by subject" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Your subjects</SelectLabel>
                    <SelectItem value={"All"}>All</SelectItem>
                    {subjects.map((subject: string) => {
                        return <SelectItem value={subject}>{subject}</SelectItem>
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    )

    return { SubjectSelect, currentSubject }
}
