import { HiOutlineSearch } from "react-icons/hi";
import { Input } from "./ui/input";


export default function SearchBar({ addClass="", placeHolder="Search your library...." }: {addClass: string, placeHolder: string}) {
    return (
        <div className={"relative bg-secondary rounded-md flex-1 mt-4 "+addClass}>
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
                type="text"
                placeholder={placeHolder}
                className="ps-10 w-full border-0 bg-secondary" 
            />
        </div>
    )
}