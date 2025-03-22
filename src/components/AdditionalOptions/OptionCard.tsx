import React from 'react';
import { OptionCardProps } from './types';

export const OptionCard: React.FC<OptionCardProps> = ({ option, isSelected, onToggle }) => {
    const { Icon } = option;

    return (
        <div className="border border-borderContainer rounded-lg p-4">
            <label className="flex items-start gap-3 cursor-pointer">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggle(option.id)}
                    className="mt-1"
                />
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-textPrimary">{option.name}</span>
                            <Icon className="w-5 h-5 text-textSecondary" />
                        </div>
                        <span className="text-right text-primary">
                            {option.price === 0 ? 'Gratuit' : `+${option.price}€`}
                        </span>
                    </div>
                    <p className="text-textSecondary text-sm mt-1">{option.description}</p>
                </div>
            </label>
        </div>
    );
};
