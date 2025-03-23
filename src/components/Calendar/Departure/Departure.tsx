"use client";
import * as React from "react";
import { TripSection } from "./TripSection";
import { ActionButtons } from "./ActionButtons";

const Departure: React.FC = () => {
    const departureTrips = [
        {
            departureTime: "08:00",
            arrivalTime: "11:30",
            price: "€89",
            duration: "2h 30m",
        },
        {
            departureTime: "10:30",
            arrivalTime: "14:00",
            price: "€91",
            duration: "2h 30m",
        },
    ];

    const returnTrips = [
        {
            departureTime: "15:00",
            arrivalTime: "18:30",
            price: "€82",
            duration: "2h 30m",
        },
        {
            departureTime: "17:30",
            arrivalTime: "21:00",
            price: "€69",
            duration: "2h 30m",
        },
    ];

    const handleCancel = () => {
        // Handle cancel action
    };

    const handleContinue = () => {
        // Handle continue booking action
    };

    return (
        <main>
            <TripSection
                title="Aller"
                route="Paris → Marseille"
                trips={departureTrips}
            />
            <div className="mt-8">
                <TripSection
                    title="Retour"
                    route="Marseille → Paris"
                    trips={returnTrips}
                />
            </div>
            <ActionButtons onCancel={handleCancel} onContinue={handleContinue} />
        </main>
    );
};

export default Departure;
