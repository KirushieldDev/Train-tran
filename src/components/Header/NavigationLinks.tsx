import * as React from "react";

export const NavigationLinks: React.FC = () => {
    return (
        <nav className="flex gap-8 items-center max-sm:hidden justify-start">
            <button className="text-base leading-4 text-gray-600 cursor-pointer hover:text-emerald-600 transition-colors">
                Trafic
            </button>
            <button className="text-base leading-4 text-gray-600 cursor-pointer hover:text-emerald-600 transition-colors">
                Réserver
            </button>
            <button className="text-base leading-4 text-gray-600 cursor-pointer hover:text-emerald-600 transition-colors">
                Contact
            </button>
        </nav>
    );
};
