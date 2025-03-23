import * as React from "react";
import { TimeDisplay } from "./TimeDisplay";
import { JourneyIndicator } from "./JourneyIndicator";
import TrainGreen from "../../../assets/Calendar/TrainGreen.tsx";

interface TripCardProps {
    departureTime: string;
    arrivalTime: string;
    price: string;
    duration: string;
}

export const TripCard: React.FC<TripCardProps> = ({
                                                      departureTime,
                                                      arrivalTime,
                                                      price,
                                                      duration,
                                                  }) => {
    return (
        <article className="flex flex-col justify-center p-4 w-full bg-white rounded-lg border border-solid max-md:max-w-full">
            <div className="flex flex-wrap gap-10 justify-between items-center w-full max-md:max-w-full">
                <div className="flex gap-8 self-stretch my-auto min-w-60 w-[339px]">
                    <TimeDisplay time={departureTime} label="Départ" />
                    <JourneyIndicator>
                        <TrainGreen/>
                    </JourneyIndicator>
                    <TimeDisplay time={arrivalTime} label="Arrivée" />
                </div>
                <div className="self-stretch my-auto text-right w-[60px]">
                    <p className="px-1.5 pt-0.5 pb-3 text-xl font-semibold text-emerald-600 whitespace-nowrap">
                        {price}
                    </p>
                    <p className="px-1 pt-px pb-2.5 text-sm text-gray-500">
                        {duration}
                    </p>
                </div>
            </div>
        </article>
    );
};
