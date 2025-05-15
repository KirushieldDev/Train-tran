import React from "react";
import {TimeDisplay} from "./TimeDisplay";
import {JourneyIndicator} from "./JourneyIndicator";
import TrainSVG from "@traintran/assets/Calendar/TrainSVG";

interface TripCardProps {
    id: string;
    departureTime: string;
    arrivalTime: string;
    price: string;
    duration: string;
    isSelected?: boolean;
    onSelect?: (id: string) => void;
}

// Composant affichant une carte de trajet avec heure de départ/arrivée, prix, durée,
export const TripCard: React.FC<TripCardProps> = ({id, departureTime, arrivalTime, price, duration, isSelected = false, onSelect}) => {
    return (
        <article
            className={`flex flex-col justify-center p-4 w-full bg-white rounded-lg border border-solid max-md:max-w-full ${isSelected ? "border-primary border-2" : ""}`}>
            <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
                <div className="flex gap-8 self-stretch my-auto min-w-60 w-[339px]">
                    <TimeDisplay time={departureTime} label="Départ" />
                    <JourneyIndicator>
                        <TrainSVG />
                    </JourneyIndicator>
                    <TimeDisplay time={arrivalTime} label="Arrivée" />
                </div>
                <div className="flex flex-col items-end">
                    <div className="self-stretch my-auto text-right w-[60px]">
                        <p className="px-1.5 pt-0.5 pb-3 text-xl font-semibold text-primary whitespace-nowrap">{price}</p>
                        <p className="px-1 pt-px pb-2.5 text-sm text-gray-500">{duration}</p>
                    </div>
                    <button
                        onClick={() => onSelect && onSelect(id)}
                        className={`mt-2 px-4 py-1 rounded-md text-sm ${isSelected ? "bg-primary text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}>
                        {isSelected ? "Sélectionné" : "Sélectionner"}
                    </button>
                </div>
            </div>
        </article>
    );
};
