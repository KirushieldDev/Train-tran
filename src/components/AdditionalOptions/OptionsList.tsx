import React from "react";
import {OptionsListProps} from "@traintran/components/AdditionalOptions/types";
import {OptionCard} from "@traintran/components/AdditionalOptions/OptionCard";
import {useOptionsList} from "@traintran/lib/options";

export const OptionsList: React.FC<OptionsListProps> = ({selectedOptions, onOptionToggle}) => {
    const {options, loading, error} = useOptionsList();

    if (loading) {
        return <div className="p-4 text-center">Chargement des options...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Erreur lors du chargement des options</div>;
    }

    return (
        // Conteneur principal de la liste d'options
        <div className="w-full">
            {/* Liste verticale avec espace entre chaque option */}
            <div className="space-y-4">
                {/* Parcours toutes les options et affiche une carte pour chacune */}
                {options.map(option => (
                    <OptionCard key={option.id} option={option} isSelected={selectedOptions.includes(option.id)} onToggle={onOptionToggle} />
                ))}
            </div>
        </div>
    );
};
