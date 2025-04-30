import * as React from "react";
import {FooterLogo} from "./FooterLogo";
import {FooterHelp} from "./FooterHelp";
import {FooterCopyright} from "./FooterCopyright";

export const Footer: React.FC = () => {
    return (
        <footer className="w-full bg-gray-50 px-20 py-12">
            <div className="flex flex-col gap-12 items-center px-6 py-0 w-full">
                {/* Logo et Aide, centrés avec un espace plus grand entre eux */}
                <div className="flex justify-center items-center w-full gap-[500px]">
                    <FooterLogo />
                    <FooterHelp />
                </div>

                {/* Copyright */}
                <FooterCopyright />
            </div>
        </footer>
    );
};

export default Footer;
