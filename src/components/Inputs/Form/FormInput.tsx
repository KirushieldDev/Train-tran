"use client";

import * as React from "react";

interface FormInputProps {
    label: string;
    type?: string;
    icon?: string;
    className?: string;
    required?: boolean;
    value?: string;
    onChange?: (value: string) => void;
}

export const FormInput: React.FC<FormInputProps> = ({
                                                        label,
                                                        type = "text",
                                                        icon,
                                                        className = "",
                                                        required = false,
                                                        value,
                                                        onChange,
                                                    }) => {
    return (
        <div className="w-full">
            <label className="block py-1 text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="mt-2">
                <div className="flex items-center bg-white rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-emerald-600">
                    {icon && (
                        <>
                            <img
                                src={icon}
                                alt=""
                                className="object-contain w-7 h-7 max-w-[18px] max-h-[18px] ml-2"
                                aria-hidden="true"
                            />
                        </>
                    )}
                    <input
                        type={type}
                        className={`w-full px-3 py-2.5 bg-transparent rounded-lg focus:outline-none ${className}`}
                        required={required}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        aria-label={label}
                    />
                </div>
            </div>
        </div>
    );
};
