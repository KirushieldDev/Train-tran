import React from 'react';
import { OptionCard } from './OptionCard';
import { OptionsListProps } from './types';

export const OptionsList: React.FC<OptionsListProps> = ({
    options,
    selectedOptions,
    onOptionToggle
}) => {
    return (
        <div className="w-[480px]">
            <h1 className="text-2xl font-bold mb-8 text-textPrimary">Options supplémentaires</h1>
            <div className="space-y-4">
                {options.map((option) => (
                    <OptionCard
                        key={option.id}
                        option={option}
                        isSelected={selectedOptions.includes(option.id)}
                        onToggle={onOptionToggle}
                    />
                ))}
            </div>
        </div>
    );
};
