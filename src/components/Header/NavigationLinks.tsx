import React from "react";

export const NavigationLinks: React.FC = () => {
    return (
        <nav className="flex gap-8 items-center max-sm:hidden justify-start">
            <button className="text-base leading-4 text-textSecondary cursor-pointer hover:text-primary transition-colors">Trafic</button>
            <button className="text-base leading-4 text-textSecondary cursor-pointer hover:text-primary transition-colors">Réserver</button>
            <button className="text-base leading-4 text-textSecondary cursor-pointer hover:text-primary transition-colors">Contact</button>
        </nav>
    );
};
