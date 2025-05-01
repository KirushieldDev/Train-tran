import React from "react";
import Logo from "@traintran/assets/Header/Logo";

export const FooterLogo: React.FC = () => {
    return (
        <div className="flex flex-col gap-1.5 items-start text-left w-[200px]">
            <Logo />
            <p>Voyagez en toute simplicité</p>
        </div>
    );
};
