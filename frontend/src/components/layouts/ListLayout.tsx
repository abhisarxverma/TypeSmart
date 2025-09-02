import type React from "react";

export default function ListLayout({ children } : { children : React.ReactNode }) {
    return (
        <div className="grid grid-cols-[repeat(auto-fill,_minmax(250px,_1fr))] gap-5 mt-5">
            { children }
        </div>
    )
}