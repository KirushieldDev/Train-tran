import React from "react";
import Link from "next/link";

// Permet d'afficher une section d’aide dans le footer avec des liens vers FAQ, Contact et Support
export const FooterHelp: React.FC = () => {
    return (
        <nav className="flex flex-col gap-4 justify-center items-start w-[200px]">
            <h2 className="text-base font-semibold leading-4 text-gray-800 text-start ">Aide</h2>
            <ul className="flex flex-col gap-2">
                <li>
                    <Link href="#faq" className="text-base leading-4 text-textSecondary">
                        FAQ
                    </Link>
                </li>
                <li>
                    <Link href="#contact" className="text-base leading-4 text-textSecondary">
                        Contact
                    </Link>
                </li>
                <li>
                    <Link href="#support" className="text-base leading-4 text-textSecondary">
                        Support
                    </Link>
                </li>
            </ul>
        </nav>
    );
};
