import React from "react";
import {IconClockHour1Filled, IconTicket, IconRosetteDiscountFilled} from "@tabler/icons-react";
import {FeatureCard} from "@traintran/components/Home/Features/FeatureCard";

export const Features: React.FC = () => {
    // Tableau contenant les données des différentes fonctionnalités à afficher
    // Chaque objet contient une icône, un titre, une description et des classes CSS optionnelles
    const features = [
        {
            icon: <IconClockHour1Filled className="text-primary bg-primaryLight rounded-full p-3" size="60" />,
            title: "Horaires en temps réel",
            description: "Suivez vos trains et leurs horaires en temps réel",
            className: "",
        },
        {
            icon: <IconTicket className="text-primary bg-primaryLight rounded-full p-3" size="60" />,
            title: "Réservation simple",
            description: "Réservez vos billets en quelques clics",
            className: "px-12 max-md:px-5",
        },
        {
            icon: <IconRosetteDiscountFilled className="text-primary bg-primaryLight rounded-full p-3" size="60" />,
            title: "Meilleurs tarifs",
            description: "Profitez des meilleures offres et réductions",
            className: "px-7 pb-3 max-md:px-5",
        },
    ];

    return (
        <section className="flex flex-wrap gap-10 justify-between items-center px-24 leading-none text-center mb-10">
            {/* Parcours et rendu de chaque fonctionnalité via le composant FeatureCard */}
            {features.map((feature, index) => (
                <FeatureCard key={index} icon={feature.icon} title={feature.title} description={feature.description} className={feature.className} />
            ))}
        </section>
    );
};

export default Features;
