"use client";

import * as React from "react";

interface GenderSelectionProps {
    value: string;
    onChange: (value: string) => void;
}

export const GenderSelection: React.FC<GenderSelectionProps> = ({
                                                                    value,
                                                                    onChange,
                                                                }) => {
    return (
        <div className="w-full text-gray-700">
            <p className="text-sm font-medium">Civilité</p>
            <div className="flex flex-wrap gap-3 items-center mt-2 text-base leading-none">
                <label className="flex gap-2 items-center cursor-pointer">
                    <input
                        type="radio"
                        name="gender"
                        value="M"
                        checked={value === "M"}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-4 h-4 rounded-full border border-black"
                    />
                    <span>M.</span>
                </label>
                <label className="flex gap-2 items-center cursor-pointer">
                    <input
                        type="radio"
                        name="gender"
                        value="Mme"
                        checked={value === "Mme"}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-4 h-4 rounded-full border border-black"
                    />
                    <span>Mme</span>
                </label>
            </div>
        </div>
    );
};
