import { MdErrorOutline } from "react-icons/md";

export default function NotFound({ text }: {text: string}){
    return (
        <div className="min-h-[500px] flex items-center justify-center gap-2">
            <MdErrorOutline className="text-4xl text-base" />
            <h1 className="text-3xl">{text}</h1>
        </div>
    )
}