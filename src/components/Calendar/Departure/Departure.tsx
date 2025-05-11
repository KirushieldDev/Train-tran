import React from "react";
import {useSearchParams} from "next/navigation";
import TripSection from "@traintran/components/Calendar/Departure/TripSection";
import {calculatePriceWithDayAdjustment} from "@traintran/utils/travel";

export default function Departure({distanceKm}: {distanceKm: number}) {
    const searchParams = useSearchParams();

    const departure = searchParams.get("departure") ?? "";
    const arrival = searchParams.get("arrival") ?? "";
    const departDate = searchParams.get("departure_date");
    const returnDate = searchParams.get("return_date");

    // On récupere le jour de la semaine à partir de la date
    const getDayOfWeek = (dateStr: string) => {
        const date = new Date(dateStr);
        // On mets en US pour avoir le nom du jour en anglais et long pour avoir le nom complet
        return date.toLocaleDateString("en-US", {weekday: "long"});
    };

    // Calcul du jour pour chaque trajet
    const departDay = departDate ? getDayOfWeek(departDate) : getDayOfWeek(new Date().toISOString());
    const returnDay = returnDate ? getDayOfWeek(returnDate) : departDay;

    const baseTrips = [
        {departureTime: "08:00", arrivalTime: "11:30", duration: "2h 30m"},
        {departureTime: "10:30", arrivalTime: "14:00", duration: "2h 30m"},
    ];

    // On ajoute le prix à chaque trajet en fonction de la distance et du jour
    const departureTrips = baseTrips.map(trip => {
        const price = calculatePriceWithDayAdjustment(distanceKm, departDay);
        return {...trip, price: `€${price}`};
    });

    const returnTrips = baseTrips.map(trip => {
        const price = calculatePriceWithDayAdjustment(distanceKm, returnDay);
        return {...trip, price: `€${price}`};
    });

    return (
        <div>
            <TripSection title="Aller" station1={departure} station2={arrival} trips={departureTrips} />
            {returnDate && <TripSection title="Retour" station1={arrival} station2={departure} trips={returnTrips} />}
        </div>
    );
}
