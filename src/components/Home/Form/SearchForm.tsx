"use client";

import * as React from "react";
import {FormInput} from "./FormInput";
import {SearchButton} from "./SearchButton";
import Train from "../../../assets/Home/Train.tsx";

export const SearchForm: React.FC = () => {
    return (
        <form className="flex flex-col items-center w-full" action={"/calendrier"}>
            <div className="flex flex-wrap gap-6 items-start w-full">
                <FormInput label="Gare de départ" placeholder="Saisissez une gare de départ" icon={<Train />} required={true} />
                <FormInput label="Gare d'arrivée" placeholder="Saisissez une gare d'arrivée" icon={<Train />} required={true} />
                <FormInput label="Date de départ" placeholder="mm/dd/yyyy" type={"date"} required={true} autocompleteToday={true} />
                <FormInput label="Date de retour" placeholder="mm/dd/yyyy" type={"date"} />
            </div>
            <SearchButton />
        </form>
    );
};
