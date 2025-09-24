import Header from "@/components/Header";
import LibraryProvider from "@/Contexts/LibraryProvider";
import TypingProvider from "@/Contexts/TypingProvider";
import MainLayout from "@/layouts/MainLayout";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

export default function MainApp() {
    return (
        <LibraryProvider>
            <TypingProvider>
                <div className="min-h-screen flex flex-col">
                    <Toaster />
                    <Header />
                    <MainLayout>
                        {<Outlet />}
                    </MainLayout>
                </div>
            </TypingProvider>
        </LibraryProvider>
    )
}