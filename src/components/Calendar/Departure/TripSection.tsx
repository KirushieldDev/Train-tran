import * as React from "react";
import { TripCard } from "./TripCard";

interface Trip {
    departureTime: string;
    arrivalTime: string;
    price: string;
    duration: string;
}

interface TripSectionProps {
    title: string;
    route: string;
    trips: Trip[];
}

export const TripSection: React.FC<TripSectionProps> = ({
                                                            title,
                                                            route,
                                                            trips,
                                                        }) => {
    return (
        <section className="w-full max-md:max-w-full">
            <header className="flex flex-wrap mt-5 gap-10 justify-between items-center py-1 w-full max-md:max-w-full">
                <h2 className="self-stretch my-auto text-lg font-semibold leading-none text-gray-800">
                    {title}
                </h2>
                <p className="self-stretch pb-2.5 my-auto text-sm text-gray-600 w-[105px]">
                    {route}
                </p>
            </header>
            <div className="mt-4 w-full max-md:max-w-full">
                {trips.map((trip, index) => (
                    <div key={index} className={index > 0 ? "mt-4" : ""}>
                        <TripCard {...trip} />
                    </div>
                ))}
            </div>
        </section>
    );
};
