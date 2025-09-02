
export default function MainLayout({ children } : { children : React.ReactNode }) {
    return (
        <main className="py-5 md:py-10 w-[1200px] max-w-[90vw] mx-auto h-full">
            {children}
        </main>
    )
}