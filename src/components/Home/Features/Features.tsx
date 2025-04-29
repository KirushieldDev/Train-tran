"use client";

import * as React from "react";
import {FeatureCard} from "./FeatureCard.tsx";
import {IconClockHour1Filled, IconTicket, IconRosetteDiscountFilled} from "@tabler/icons-react";

export const Features: React.FC = () => {
    const features = [
        {
            icon: <IconClockHour1Filled className="text-primary bg-primary/20 rounded-full p-3" size="60" />,
            title: "Horaires en temps réel",
            description: "Suivez vos trains et leurs horaires en temps réel",
            className: "",
        },
        {
            icon: <IconTicket className="text-primary bg-primary/20 rounded-full p-3" size="60" />,
            title: "Réservation simple",
            description: "Réservez vos billets en quelques clics",
            className: "px-12 max-md:px-5",
        },
        {
            icon: <IconRosetteDiscountFilled className="text-primary bg-primary/20 rounded-full p-3" size="60" />,
            title: "Meilleurs tarifs",
            description: "Profitez des meilleures offres et réductions",
            className: "px-7 pb-3 max-md:px-5",
        },
    ];

    return (
        <section className="flex flex-wrap gap-10 justify-between items-center px-24 leading-none text-center mb-10">
            {features.map((feature, index) => (
                <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} className={feature.className} />
            ))}
        </section>
    );
};

export default Features;
