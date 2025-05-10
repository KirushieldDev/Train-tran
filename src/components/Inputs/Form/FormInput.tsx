"use client";

import React from "react";
import PhoneInput from "react-phone-number-input";

interface FormInputProps {
    label: string;
    name?: string;
    placeholder?: string;
    type?: string;
    icon?: React.ReactNode;
    className?: string;
    required?: boolean;
    value?: string;
    onChange?: (value: string) => void;
}

export const FormInput: React.FC<FormInputProps> = ({label, name, placeholder, type = "text", icon, className = "", required = false, value, onChange}) => {
    return (
        <div className="w-full">
            <label className="block py-1 text-sm font-medium text-gray-700">{label}</label>
            <div className="mt-2">
                <div className="flex items-center bg-white rounded-lg border border-gray-300 focus-within:ring-2 focus-within:ring-primary">
                    {icon && <div className="pl-2">{icon}</div>}
                    {type === "tel" ? (
                        <PhoneInput
                            international
                            defaultCountry="FR"
                            countryCallingCodeEditable={false}
                            name={name}
                            value={value}
                            limitMaxLength={true}
                            onChange={val => onChange?.(val || "")}
                            className={`w-full px-3 py-2.5 bg-transparent rounded-lg focus:outline-none ${className}`}
                        />
                    ) : (
                        <input
                            name={name}
                            type={type}
                            placeholder={placeholder}
                            className={`w-full px-3 py-2.5 bg-transparent rounded-lg focus:outline-none ${className}`}
                            required={required}
                            value={value}
                            onChange={e => onChange?.(e.target.value)}
                            aria-label={label}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
