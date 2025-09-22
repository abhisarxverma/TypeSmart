import Header from "@/components/Header";
import LibraryProvider from "@/Contexts/LibraryProvider";
import MainLayout from "@/layouts/MainLayout";
import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";

export default function MainApp() {
    return (
        <LibraryProvider>
            <div className="min-h-screen flex flex-col">
                <Toaster />
                <Header />
                <MainLayout>
                    { <Outlet /> }
                </MainLayout>
            </div>
        </LibraryProvider>
    )
}