import React from "react";
import {OptionsListProps} from "@traintran/components/AdditionalOptions/types";
import {OptionCard} from "@traintran/components/AdditionalOptions/OptionCard";
import {optionsList} from "@traintran/lib/options";

export const OptionsList: React.FC<OptionsListProps> = ({selectedOptions, onOptionToggle}) => {
    return (
        <div className="w-full">
            <div className="space-y-4">
                {optionsList.map(option => (
                    <OptionCard key={option.id} option={option} isSelected={selectedOptions.includes(option.id)} onToggle={onOptionToggle} />
                ))}
            </div>
        </div>
    );
};
