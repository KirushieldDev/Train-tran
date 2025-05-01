"use client";
import React from "react";

interface TimeDisplayProps {
    time: string;
    label: string;
}

export const TimeDisplay: React.FC<TimeDisplayProps> = ({time, label}) => {
    return (
        <article className="text-center whitespace-nowrap">
            <time className="block px-1.5 pt-0.5 pb-3 text-xl font-semibold text-gray-800">{time}</time>
            <p className="px-px py-1 text-sm text-gray-500">{label}</p>
        </article>
    );
};
