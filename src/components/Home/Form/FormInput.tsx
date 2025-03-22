"use client";

import * as React from "react";

interface FormInputProps {
    label: string;
    placeholder: string;
    icon: React.ReactNode;
}

export const FormInput: React.FC<FormInputProps> = ({
                                                        label,
                                                        placeholder,
                                                        icon,
                                                    }) => {
    return (
        <div className="flex flex-col grow shrink min-w-60 w-[323px]">
            <label className="gap-2.5 self-start text-sm font-medium text-center text-gray-700">
                {label}
            </label>
            <div className="flex relative justify-between items-start mt-2 w-full min-h-[50px]">
                <input
                    type="text"
                    placeholder={placeholder}
                    className="z-0 flex-1 shrink self-stretch pl-12 my-auto text-base leading-6 text-gray-400 bg-white rounded-lg border border-gray-300 border-solid basis-0 min-w-60 w-[231px]"
                />
                <div className="flex overflow-hidden absolute left-5 z-0 justify-center items-center self-start w-3.5 h-4 bottom-[17px] min-h-4">
                    {icon}
                </div>
            </div>
        </div>
    );
};
