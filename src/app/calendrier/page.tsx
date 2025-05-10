"use client";

import React, {useMemo, useEffect, useState} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import Header from "@traintran/components/Header/Header";
import TrainJourneyDisplay from "@traintran/components/Calendar/Destination/TrainJourneyDisplay";
import Calendar, {Journey} from "@traintran/components/Calendar/Calendar";
import Departure from "@traintran/components/Calendar/Departure/Departure";
import Footer from "@traintran/components/Footer/Footer";
import journeyData from "@traintran/components/Calendar/journeys.json";
import {calculateDistance} from "@traintran/utils/travel";

export default function CalendarPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const departure = searchParams.get("departure") ?? "";
    const arrival = searchParams.get("arrival") ?? "";
    const departDateParam = searchParams.get("departure_date");
    const returnDateParam = searchParams.get("return_date");

    const availableDates = useMemo(() => {
        return journeyData.journeys.map(item => ({
            date: new Date(item.date),
            journeys: item.journeys,
        }));
    }, []);

    const handleDateChange = (date: Date | null, journeys?: Journey[]) => {
        if (!date) return;
        console.log("Date sélectionnée:", date);
        console.log("Trajets disponibles:", journeys);

        // On formatte la date
        const isoDate = date.toISOString().split("T")[0];
        // On récupère les paramètres de la requête
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set("departure_date", isoDate);
        // Mettre à jour departure_date
        if (returnDateParam) params.set("return_date", returnDateParam);

        // On actualise l'URL
        router.push(`?${params.toString()}`);
    };
    const [coords, setCoords] = useState<{
        from: {lat: number; lon: number};
        to: {lat: number; lon: number};
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // On utilise useEffect pour récupérer les coordonnées des gares
    useEffect(() => {
        async function fetchStations() {
            try {
                // On appelle l'API pour récupérer les coordonnées des gares
                const res = await fetch(`/api/journey/stations-coords?from=${encodeURIComponent(departure)}&to=${encodeURIComponent(arrival)}`);
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Erreur récupération gares");
                }
                const data = await res.json();
                setCoords(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        // si on a les gares de départ et d'arrivée, on appelle l'API
        if (departure && arrival) fetchStations();
        else {
            setError("Paramètres de gare manquants");
            setLoading(false);
        }
    }, [departure, arrival]);

    // ON affiche un message de chargement ou d'erreur
    if (loading) return <div>Chargement des données de la gare…</div>;
    if (error || !coords) return <div>Erreur : {error || "Coordonnées introuvables"}</div>;

    // On calcule la distance entre les gares de départ et d'arrivée
    const distanceKm = calculateDistance(coords.from.lat, coords.from.lon, coords.to.lat, coords.to.lon);

    return (
        <>
            <Header />
            <div className="px-4 md:px-40 lg:px-40">
                <TrainJourneyDisplay />
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <Calendar
                        onChange={handleDateChange}
                        availableDates={availableDates}
                        distanceKm={distanceKm}
                        selectedDate={departDateParam ? new Date(departDateParam) : null}
                    />
                </div>
                <Departure distanceKm={distanceKm} />
            </div>
            <Footer />
        </>
    );
}
