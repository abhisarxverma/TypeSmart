import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function CustomSelect({ options }:{ options: string[] }) {
    return (
        <Select>
            <SelectTrigger className="">
                <SelectValue placeholder="Select Importance" />
            </SelectTrigger>
            <SelectContent>
                {options.map(option => (
                    <SelectItem value={option}>{option.toUpperCase()}</SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}