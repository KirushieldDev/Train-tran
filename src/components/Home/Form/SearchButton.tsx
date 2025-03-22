import * as React from "react";
import Search from "../../../assets/Home/Search.tsx";

export const SearchButton: React.FC = () => {
    return (
        <button className="mt-6 w-full text-base font-medium text-center text-white whitespace-nowrap max-w-[832px] min-h-[47px]">
            <div className="flex flex-wrap flex-1 gap-2 justify-center items-center bg-emerald-600 rounded-lg size-full h-10">
                <Search />
                <span className="self-stretch my-auto w-[92px]">Rechercher</span>
            </div>
        </button>
    );
};
