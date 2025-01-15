import React from "react";
import { Outlet } from "react-router-dom";
import NavbarCustom from "../components/NavbarCustom";
import AsideCustom from "../components/AsideCustom";

const AppLayout = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <NavbarCustom />
            <div className="flex">
                {/* Sidebar */}
                <div className="w-48 lg:w-56 xl:w-64 hidden md:block">
                    <AsideCustom />
                </div>
                {/* Contenuto principale */}
                <div className="flex-1 p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AppLayout;
