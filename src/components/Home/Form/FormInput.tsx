"use client";

import * as React from "react";

interface FormInputProps {
    label: string;
    placeholder: string;
    icon?: React.ReactNode;
    type?: string;
    required?: boolean;
    autocompleteToday?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({label, placeholder, icon, type = "text", required, autocompleteToday}) => {
    const today = new Date().toISOString().split("T")[0];
    return (
        <div className="flex flex-col grow shrink min-w-60 w-[323px]">
            <label className="gap-2.5 self-start text-sm font-medium text-center text-gray-700">{label}</label>
            <div className="flex relative justify-between items-start mt-2 w-full min-h-[55px]">
                <input
                    type={type}
                    placeholder={placeholder}
                    defaultValue={type === "date" && autocompleteToday ? today : ""}
                    className={`z-0 flex-1 shrink self-stretch my-auto text-base leading-6 text-gray-400 bg-white rounded-lg border border-gray-300 border-solid basis-0 min-w-60 w-[231px] min-h-[55px] ${icon ? "pl-12" : "pl-4"}`}
                    required={required}
                />
                {icon && (
                    <div className="flex overflow-hidden absolute left-5 z-0 justify-center items-center self-start w-3.5 h-4 bottom-[20px] min-h-4">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
};
