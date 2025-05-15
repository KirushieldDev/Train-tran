import React from "react";
import {OptionsListProps} from "@traintran/components/AdditionalOptions/types";
import {OptionCard} from "@traintran/components/AdditionalOptions/OptionCard";
import {optionsList} from "@traintran/lib/options";

export const OptionsList: React.FC<OptionsListProps> = ({selectedOptions, onOptionToggle}) => {
    return (
        // Conteneur principal de la liste d'options
        <div className="w-full">
            {/* Liste verticale avec espace entre chaque option */}
            <div className="space-y-4">
                {/* Parcours toutes les options et affiche une carte pour chacune */}
                {optionsList.map(option => (
                    <OptionCard key={option.id} option={option} isSelected={selectedOptions.includes(option.id)} onToggle={onOptionToggle} />
                ))}
            </div>
        </div>
    );
};
