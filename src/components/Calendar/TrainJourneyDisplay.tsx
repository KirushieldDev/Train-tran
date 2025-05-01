"use client";

import React from "react";
import TrainSVG from "../../assets/Calendar/TrainSVG.tsx";
import { IconEdit } from "@tabler/icons-react";

export const TrainJourneyDisplay: React.FC = () => {
    return (
        <article className="flex flex-col gap-2.5 items-start p-6 bg-white rounded-lg shadow-sm mt-5">
            <div className="flex justify-between items-center w-full">
                <div className="flex gap-2.5 items-center">
                    <figure className="flex justify-center items-center w-8 h-[29px]">
                        <TrainSVG />
                    </figure>
                    <h2 className="px-0 py-3.5 text-xl font-bold leading-5 text-black">Paris (Gare du Nord) → Marseille (Saint-Charles)</h2>
                </div>
                <button className="flex gap-2 items-center cursor-pointer max-sm:justify-end max-sm:w-full" aria-label="Modifier le trajet">
                    <IconEdit className="text-primary" size="16" />
                    <span className="text-base text-emerald-600">Modifier</span>
                </button>
            </div>
        </article>
    );
};

export default TrainJourneyDisplay;
