import React from "react";
import {IconArrowRight} from "@tabler/icons-react";

interface TripCardProps {
    date: string;
    departureCity: string;
    departureTime: string;
    arrivalCity: string;
    arrivalTime: string;
    price: string;
    passengers: string;
    title: string;
}

export const TripCard: React.FC<TripCardProps> = ({date, departureCity, departureTime, arrivalCity, arrivalTime, price, passengers, title}) => {
    return (
        <article className="p-6 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="mb-4 text-lg text-gray-700">
                {title} {date}
            </h2>
            <div className="flex justify-between items-start max-sm:flex-col max-sm:gap-4">
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col gap-1">
                        <div className="text-base text-gray-800">{departureCity}</div>
                        <time className="text-sm text-gray-500">{departureTime}</time>
                    </div>
                    <IconArrowRight className="text-primary" size="20" />
                    <div className="flex flex-col gap-1">
                        <div className="text-base text-gray-800">{arrivalCity}</div>
                        <time className="text-sm text-gray-500">{arrivalTime}</time>
                    </div>
                </div>
                <div className="text-right max-sm:mt-3">
                    <div className="text-base text-gray-800">{price}</div>
                    <div className="text-sm text-gray-500">{passengers}</div>
                </div>
            </div>
        </article>
    );
};
