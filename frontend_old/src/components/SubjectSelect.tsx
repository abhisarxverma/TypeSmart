
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import clsx from "clsx";

interface SubjectSelectProps {
    subjects: string[]
    customClass: string
    currentSubject: string
    clickFn : React.Dispatch<React.SetStateAction<string>> 
}

export default function SubjectSelect({ subjects, customClass, currentSubject, clickFn }: SubjectSelectProps) {


    return (
        <Select onValueChange={(value) => clickFn(value)} value={currentSubject ?? undefined}>
            <SelectTrigger className={clsx(customClass)}>
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

}
