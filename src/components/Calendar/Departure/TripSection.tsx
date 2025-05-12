import React from "react";
import {TripCard} from "@traintran/components/Calendar/Departure/TripCard";
import {IconArrowRight} from "@tabler/icons-react";

interface Trip {
    id: string;
    departureTime: string;
    arrivalTime: string;
    price: string;
    duration: string;
}

interface TripSectionProps {
    title: string;
    station1: string;
    station2: string;
    trips: Trip[];
    selectedTripId?: string;
    onSelectTrip?: (tripId: string) => void;
}

export default function TripSection(props: TripSectionProps) {
    const {title, station1, station2, trips, selectedTripId, onSelectTrip} = props;
    return (
        <section className="w-full max-md:max-w-full">
            <div className="flex flex-wrap mt-5 gap-10 justify-between items-center py-1 w-full max-md:max-w-full">
                <h2 className="self-stretch my-auto text-lg font-semibold leading-none text-gray-800">{title}</h2>
                <p className="flex justify-center items-center gap-2 pb-2.5 my-auto text-sm text-textSecondary">
                    {station1}
                    <IconArrowRight className="text-textPrimary" size="14" />
                    {station2}
                </p>
            </div>
            <div className="mt-4 w-full max-md:max-w-full">
                {trips.map((trip, index) => (
                    <div key={index} className={index > 0 ? "mt-4" : ""}>
                        <TripCard {...trip} isSelected={selectedTripId === trip.id} onSelect={onSelectTrip} />
                    </div>
                ))}
            </div>
        </section>
    );
}
