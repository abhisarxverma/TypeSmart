import type React from "react";

export default function ListLayout({ children, addClass="" } : { addClass?: string, children : React.ReactNode }) {
    return (
        <div className={"grid grid-cols-[repeat(auto-fill,_minmax(220px,_1fr))] gap-5 "+addClass}>
            { children }
        </div>
    )
}