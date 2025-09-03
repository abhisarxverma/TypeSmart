import type React from "react";

export default function ListLayout({ children, addClass="" } : { children : React.ReactNode, addClass: string }) {
    return (
        <div className={"grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-5 "+addClass}>
            { children }
        </div>
    )
}