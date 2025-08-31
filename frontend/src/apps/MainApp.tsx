import Header from "@/components/Header";
import MainLayout from "@/layouts/MainLayout";
import { Outlet } from "react-router-dom";

export default function MainApp() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <MainLayout>
                { <Outlet /> }
            </MainLayout>
        </div>
    )
}