"use client";

import React, {useState} from "react";

interface FormInputProps {
    label: string;
    name: string;
    placeholder: string;
    icon?: React.ReactNode;
    type?: string;
    required?: boolean;
    autocompleteToday?: boolean;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    suggestions?: string[];
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    placeholder,
    icon,
    type = "text",
    required,
    autocompleteToday,
    value = "",
    onChange,
    suggestions = [],
}) => {
    const today = new Date().toISOString().split("T")[0];
    const [open, setOpen] = useState(false);

    const onBlur = () => setTimeout(() => setOpen(false), 100);

    const selectSuggestion = (s: string) => {
        if (onChange) {
            // Simule un event pour la valeur
            const syntheticEvent = {
                target: { value: s },
                currentTarget: { value: s },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(syntheticEvent);
        }
        setOpen(false);
    };

    const inputProps = type === "date" ? (autocompleteToday ? {defaultValue: today} : {}) : {value, onFocus: () => setOpen(true), onBlur};

    return (
        <div className="flex flex-col grow shrink min-w-60 w-[323px]">
            <label className="gap-2.5 self-start text-sm font-medium text-center text-gray-700">{label}</label>
            <div className="flex relative justify-between items-start mt-2 w-full min-h-[55px]">
                <input
                    type={type}
                    name={name}
                    placeholder={placeholder}
                    required={required}
                    onChange={onChange}
                    {...inputProps}
                    className={`z-0 flex-1 shrink self-stretch my-auto text-base leading-6 placeholder:text-gray-400 text-textPrimary bg-white rounded-lg border border-gray-300 border-solid basis-0 min-w-60 w-[231px] min-h-[55px] ${icon ? "pl-12" : "pl-4"}`}
                />
                {icon && (
                    <div className="flex overflow-hidden absolute left-5 z-0 justify-center items-center self-start w-3.5 h-4 bottom-[20px] min-h-4">
                        {icon}
                    </div>
                )}
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
