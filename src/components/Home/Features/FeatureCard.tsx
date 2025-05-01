import React from "react";

interface FeatureCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    className?: string;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({icon, title, description, className = ""}) => {
    return (
        <article className={`flex flex-col items-center mt-10 self-stretch px-2 pb-2 my-auto min-w-60 w-[389px] ${className}`}>
            {icon}
            <h2 className="mt-4 text-xl font-semibold text-gray-800">{title}</h2>
            <p className="self-stretch mt-3.5 text-base text-textSecondary">{description}</p>
        </article>
    );
};
