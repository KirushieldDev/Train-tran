import * as React from "react";
import { Journey } from "./Calendar";

interface JourneyDisplayProps {
    journey: Journey;
    onSelect?: (journey: Journey) => void;
    isSelected?: boolean;
}

export const JourneyDisplay: React.FC<JourneyDisplayProps> = ({ journey, onSelect, isSelected = false }) => {
    // Calculate the travel duration
    const calculateDuration = (departureTime: string, arrivalTime: string): string => {
        const [depHours, depMinutes] = departureTime.split(':').map(Number);
        const [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);

        let durationHours = arrHours - depHours;
        let durationMinutes = arrMinutes - depMinutes;

        if (durationMinutes < 0) {
            durationHours -= 1;
            durationMinutes += 60;
        }

        return `${durationHours}h${durationMinutes.toString().padStart(2, '0')}`;
    };

    const duration = calculateDuration(journey.departureTime, journey.arrivalTime);

    const handleClick = () => {
        if (onSelect) {
            onSelect(journey);
        }
    };

    return (
        <article
            className={`flex flex-col justify-center p-4 w-full bg-white rounded-lg border border-solid 
                       ${isSelected ? 'border-emerald-600 shadow-md' : 'border-gray-200'} 
                       hover:border-emerald-600 hover:shadow-sm transition-all cursor-pointer`}
            onClick={handleClick}
        >
            <div className="flex flex-wrap gap-5 justify-between items-center w-full">
                <div className="flex gap-4 items-center">
                    <div className="text-center">
                        <time className="block text-xl font-semibold text-gray-800">{journey.departureTime}</time>
                        <p className="text-sm text-gray-500">Départ</p>
                    </div>

                    <div className="flex items-center px-2">
                        <div className="h-0.5 w-16 bg-gray-300"></div>
                        <div className="mx-1 text-xs text-gray-500">{duration}</div>
                        <div className="h-0.5 w-16 bg-gray-300"></div>
                    </div>

                    <div className="text-center">
                        <time className="block text-xl font-semibold text-gray-800">{journey.arrivalTime}</time>
                        <p className="text-sm text-gray-500">Arrivée</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="text-xl font-semibold text-emerald-600">{journey.price}€</p>
                </div>
            </div>
        </article>
    );
};
