import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { RiDeleteBinLine } from "react-icons/ri";

interface DeleteButtonProps {
    deleteFn : () => void;
    isDeleting: boolean;
}

export default function DeleteButton({ deleteFn, isDeleting }:DeleteButtonProps) {

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className="text-red-500 hover:text-red-500"><RiDeleteBinLine /></Button>
            </PopoverTrigger>
            <PopoverContent asChild>
                <div className="flex flex-col gap-4">
                    <p>Confirm delete</p>
                    <Button onClick={() => deleteFn()} variant="secondary" className="text-destructive hover:text-destructive">Delete {isDeleting ? <Loader2 className="animate-spin" /> : <RiDeleteBinLine />}</Button>
                </div>
            </PopoverContent>
        </Popover>
    )

}