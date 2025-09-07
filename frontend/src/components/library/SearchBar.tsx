import { HiOutlineSearch } from "react-icons/hi";
import { Input } from "../ui/input";

export default function SearchBar({
    querySetterFn,
    addClass="", 
    placeHolder="Search your library...." 
}: {
    querySetterFn: React.Dispatch<React.SetStateAction<(string)>>
    addClass?: string, 
    placeHolder: string
}) {

    function handleChange(value: string) {
        querySetterFn(value);
    }

    return (
        <div className={"relative bg-secondary rounded-md flex-1 mt-4 "+addClass}>
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                onChange={(e) => handleChange(e.target.value)}
                type="text"
                placeholder={placeHolder}
                className="ps-10 w-full border-0 bg-secondary" 
            />
        </div>
    )
}