"use client";

import React, {useState} from "react";

interface FormInputProps {
    label: string;
    placeholder: string;
    name: string;
    icon?: React.ReactNode;
    type?: string;
    required?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    suggestions?: string[];
}

export const FormInput: React.FC<FormInputProps> = ({label, placeholder, name, icon, type = "text", required, value = "", onChange, suggestions = []}) => {
    // Etat pour afficher ou masquer la liste des suggestions
    const [open, setOpen] = useState(false);

    // Delay sur blur pour laisser le temps à l'utilisateur de cliquer sur une suggestion
    const onBlur = () => setTimeout(() => setOpen(false), 100);

    // Sélection d'une suggestion et notification du parent via onChange
    const selectSuggestion = (s: string) => {
        if (onChange) {
            onChange({currentTarget: {value: s}} as React.ChangeEvent<HTMLInputElement>);
        }
        setOpen(false);
    };

    const inputProps = {
        value,
        onChange,
        onFocus: () => setOpen(true),
        onBlur,
    };

    return (
        <div className="flex flex-col grow shrink min-w-60 w-[323px]">
            <label className="gap-2.5 self-start text-sm font-medium text-center text-gray-700">{label}</label>
            <div className="flex relative justify-between items-start mt-2 w-full min-h-[55px] rounded-lg focus-within:ring-2 focus-within:ring-primary">
                <input
                    type={type}
                    placeholder={placeholder}
                    name={name}
                    required={required}
                    {...inputProps}
                    className={`z-0 flex-1 shrink self-stretch my-auto text-base leading-6 placeholder:text-gray-400 text-textPrimary bg-white rounded-lg border border-gray-300 border-solid basis-0 min-w-60 w-[231px] min-h-[55px] ${icon ? "pl-12" : "pl-4"} focus:outline-none`}
                />
                {/* Affichage conditionnel de l'icône */}
                {icon && (
                    <div className="flex overflow-hidden absolute left-5 z-0 justify-center items-center self-start w-3.5 h-4 bottom-[20px] min-h-4">
                        {icon}
                    </div>
                )}
                {/* Liste déroulante des suggestions */}
                {type === "text" && open && value.length >= 2 && suggestions.length > 0 && (
                    <ul className="absolute top-full mt-1 w-full max-h-40 overflow-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                        {suggestions.map((s, i) => (
                            <li key={i} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700" onMouseDown={() => selectSuggestion(s)}>
                                {s}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
