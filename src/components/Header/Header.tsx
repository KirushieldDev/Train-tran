"use client";
import * as React from "react";
import Logo from "../../assets/Header/Logo.tsx";
import { NavigationLinks } from "./NavigationLinks.tsx";
import  ProfileIcon  from "../../assets/Header/ProfileIcon.tsx";

export const Header: React.FC = () => {
    return (
        <header className="flex flex-col items-start px-20 py-0 bg-white border-0 border border-solid shadow-sm">
            <nav className="flex justify-between items-center px-0 py-2.5 w-full">
                <div className="flex gap-10 items-center flex-1 max-sm:gap-5">
                    <Logo />
                    <NavigationLinks />
                </div>
                <ProfileIcon />
            </nav>
        </header>
    );
};

export default Header;
