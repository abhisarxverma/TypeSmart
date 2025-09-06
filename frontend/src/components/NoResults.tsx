import { PiEmpty } from "react-icons/pi";

export default function NoResults() {
    return (
        <div className="w-full min-h-70 flex flex-col gap-2 items-center justify-center border-2 border-secondary bg-card-secondary border-dashed rounded-md mt-5">
            <PiEmpty className="text-[3rem] text-muted-foreground" />
            <p className="font-semibold">No results</p>
        </div>
    )
}