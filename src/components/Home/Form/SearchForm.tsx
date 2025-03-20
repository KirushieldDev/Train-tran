"use client";

import * as React from "react";
import { FormInput } from "./FormInput";
import { SearchButton } from "./SearchButton";
import Train from "../../../assets/Home/Train.tsx";
import Calendar from "../../../assets/Home/Calendar.tsx";

export const SearchForm: React.FC = () => {
    return (
        <form className="flex flex-col items-center w-full max-md:max-w-full">
            <div className="flex flex-wrap gap-6 items-start w-full">
                <FormInput
                    label="Gare de départ"
                    placeholder="Saisissez une gare de départ"
                    icon={<Train />}
                />
                <FormInput
                    label="Gare d'arrivée"
                    placeholder="Saisissez une gare d'arrivée"
                    icon={<Train />}
                />
                <FormInput
                    label="Date de départ"
                    placeholder="mm/dd/yyyy"
                    icon={<Calendar />}
                />
                <FormInput
                    label="Date de retour"
                    placeholder="mm/dd/yyyy"
                    icon={<Calendar />}
                />
            </div>
            <SearchButton />
        </form>
    );
};
