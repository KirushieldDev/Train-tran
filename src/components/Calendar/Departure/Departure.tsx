"use client";

import React from "react";
import {useRouter, useSearchParams} from "next/navigation";
import TripSection from "@traintran/components/Calendar/Departure/TripSection";
import {ActionButtons} from "@traintran/components/Calendar/Departure/ActionButtons";

export default function Departure() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const departure = searchParams.get("departure") ?? "";
    const arrival = searchParams.get("arrival") ?? "";

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
        router.push("/");
    };

    const handleContinue = () => {
        // Handle continue booking action
        router.push("/options");
    };

    return (
        <div>
            <TripSection title="Aller" station1={departure} station2={arrival} trips={departureTrips} />
            {searchParams.get("return_date") && (
                <TripSection title="Retour" station1={arrival} station2={departure} trips={returnTrips} />
            )}
            <ActionButtons onCancel={handleCancel} onContinue={handleContinue} />
        </div>
    );
};