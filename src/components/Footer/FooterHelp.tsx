import React from "react";

export const FooterHelp: React.FC = () => {
    return (
        <nav className="flex flex-col gap-4 justify-center items-start w-[200px]">
            <h2 className="text-base font-semibold leading-4 text-gray-800 text-start ">Aide</h2>
            <ul className="flex flex-col gap-2">
                <li>
                    <a href="#faq" className="text-base leading-4 text-gray-600">
                        FAQ
                    </a>
                </li>
                <li>
                    <a href="#contact" className="text-base leading-4 text-gray-600">
                        Contact
                    </a>
                </li>
                <li>
                    <a href="#support" className="text-base leading-4 text-gray-600">
                        Support
                    </a>
                </li>
            </ul>
        </nav>
    );
};
