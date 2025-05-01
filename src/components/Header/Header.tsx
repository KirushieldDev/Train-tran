import React from "react";
import {IconUser} from "@tabler/icons-react";
import Logo from "@traintran/assets/Header/Logo";
import {NavigationLinks} from "@traintran/components/Header/NavigationLinks";

export const Header: React.FC = () => {
    return (
        <header className="flex flex-col items-start px-20 py-0 bg-white border-0 shadow-sm">
            <nav className="flex justify-between items-center px-0 py-2.5 w-full">
                <div className="flex gap-10 items-center flex-1 max-sm:gap-5">
                    <Logo />
                    <NavigationLinks />
                </div>
                <IconUser className="text-textSecondary" size="26" />
            </nav>
        </header>
    );
};

export default Header;
