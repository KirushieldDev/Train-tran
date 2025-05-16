import React from "react";
import {OptionCardProps} from "./types";

export const OptionCard: React.FC<OptionCardProps> = ({option, isSelected, onToggle}) => {
    return (
        // Carte d'option avec bordure et padding
        <div className="border border-borderContainer rounded-lg p-4">
            {/* Checkbox pour sélectionner/désélectionner l'option */}
            <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={isSelected} onChange={() => onToggle(option.id)} className="mt-1" />
                {/* Contenu : nom, icône, prix et description */}
                <div className="flex-1">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-textPrimary">{option.name}</span>
                            {option.Icon}
                        </div>
                        {option.price === 0 ? (
                            <span className="text-right text-primary">Gratuit</span>
                        ) : (
                            <span className="text-right text-textSecondary">{option.price}€</span>
                        )}
                    </div>
                    <p className="text-textSecondary text-sm mt-1">{option.description}</p>
                </div>
            </label>
        </div>
    );
};
