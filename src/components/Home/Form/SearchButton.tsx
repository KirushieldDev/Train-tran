import React from "react";
import {IconSearch} from "@tabler/icons-react";

export const SearchButton: React.FC = () => {
    return (
        <button className="mt-6 w-full text-base font-medium text-center text-white whitespace-nowrap max-w-[832px] min-h-[47px]" type="submit">
            <div className="flex flex-wrap flex-1 gap-2 justify-center items-center bg-primary hover:bg-primaryDark transition-colors rounded-lg size-full h-10">
                <IconSearch className="text-white" size="18" />
                <span className="self-stretch my-auto w-[92px]">Rechercher</span>
            </div>
        </button>
    );
};
