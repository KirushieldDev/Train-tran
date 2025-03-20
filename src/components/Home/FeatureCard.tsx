"use client";

import * as React from "react";

interface FeatureCardProps {
    icon: React.ReactNode;  // 🔄 Remplace imageUrl par un composant
    title: string;
    description: string;
    className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
                                                            icon,
                                                            title,
                                                            description,
                                                            className = "",
                                                        }) => {
    return (
        <article
            className={`flex flex-col items-center self-stretch px-2 pb-2 my-auto min-w-60 w-[389px] ${className}`}
        >
            <div className="w-16 h-16">{icon}</div> {/* Affichage de l'icône */}
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
                {title}
            </h2>
            <p className="self-stretch mt-3.5 text-base text-gray-600">
                {description}
            </p>
        </article>
    );
};
