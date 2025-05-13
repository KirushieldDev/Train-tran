import React, {useState, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import TripSection from "@traintran/components/Calendar/Departure/TripSection";
import {calculatePriceWithDayAdjustment, getDayOfWeek, isJourneyAvailableOnDay, formatTime, calculateDuration} from "@traintran/utils/travel";
import {Journey, Trip} from "@traintran/components/Calendar/types";

export default function Departure({distanceKm}: {distanceKm: number}) {
    const searchParams = useSearchParams();

    const departure = searchParams.get("departure") ?? "";
    const arrival = searchParams.get("arrival") ?? "";
    const departDate = searchParams.get("departure_date");
    const returnDate = searchParams.get("return_date");

    const [departureTrips, setDepartureTrips] = useState<Trip[]>([]);
    const [returnTrips, setReturnTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // États pour stocker les trajets sélectionnés
    const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(null);
    const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);

    // Calcul du jour pour chaque trajet
    const departDay = departDate ? getDayOfWeek(departDate) : getDayOfWeek(new Date().toISOString());
    const returnDay = returnDate ? getDayOfWeek(returnDate) : departDay;

    // Récupérer les trajets depuis l'API
    useEffect(() => {
        const fetchJourneys = async () => {
            if (!departure || !arrival || !departDate) return;

            setLoading(true);
            setError(null);

            try {
                // Construire l'URL avec URLSearchParams
                const params = new URLSearchParams({from: departure, to: arrival});

                // Récupérer les trajets pour le jour de départ
                const response = await fetch(`/api/journey/trip?${params.toString()}`);
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des trajets");
                }

                const data = await response.json();

                // Filtrer les trajets pour le jour de la semaine sélectionné
                const departJourneys = data.journeys.filter((journey: Journey) => {
                    return isJourneyAvailableOnDay(departDay, journey.weekPattern);
                });

                // Utilisation de la fonction formatTime importée depuis travel.ts

                // Utilisation de la fonction calculateDuration importée depuis travel.ts

                // Formater les trajets pour l'affichage
                const formattedDepartTrips = departJourneys
                    .map((journey: Journey) => {
                        // Extraire les horaires spécifiques aux gares de départ et d'arrivée
                        const departureStop = journey.stop_times[journey.fromIndex];
                        const arrivalStop = journey.stop_times[journey.toIndex];

                        const departureTime = formatTime(departureStop?.utc_departure_time);
                        const arrivalTime = formatTime(arrivalStop?.utc_arrival_time);

                        const duration = calculateDuration(departureStop?.utc_departure_time, arrivalStop?.utc_arrival_time);

                        // Calculer le prix en fonction de la distance et du jour
                        const price = calculatePriceWithDayAdjustment(distanceKm, departDay);

                        // Ajouter la valeur numérique de l'heure pour le tri
                        const departureTimeValue = departureStop?.utc_departure_time ? parseInt(departureStop.utc_departure_time.substring(0, 4)) : 0;

                        return {
                            id: journey.id_vehicle_journey,
                            departureTime,
                            arrivalTime,
                            duration,
                            price: `€${price}`,
                            departureTimeValue,
                        };
                    })
                    // Trier les trajets du plus tôt au plus tard
                    .sort((a: Trip, b: Trip) => (a.departureTimeValue || 0) - (b.departureTimeValue || 0));

                setDepartureTrips(formattedDepartTrips);

                // Si une date de retour est spécifiée, récupérer les trajets pour le retour
                if (returnDate) {
                    // Faire une nouvelle requête API pour les trajets de retour en inversant les gares
                    try {
                        // Construire l'URL avec URLSearchParams pour le trajet retour
                        const returnParams = new URLSearchParams({from: arrival, to: departure});

                        const returnResponse = await fetch(`/api/journey/trip?${returnParams.toString()}`);
                        if (!returnResponse.ok) {
                            throw new Error("Erreur lors de la récupération des trajets de retour");
                        }

                        const returnData = await returnResponse.json();

                        // Filtrer les trajets de retour pour le jour de la semaine sélectionné
                        const returnJourneys = returnData.journeys.filter((journey: Journey) => {
                            return isJourneyAvailableOnDay(returnDay, journey.weekPattern);
                        });

                        const formattedReturnTrips = returnJourneys
                            .map((journey: Journey) => {
                                // Extraire les horaires spécifiques aux gares de départ et d'arrivée
                                const departureStop = journey.stop_times[journey.fromIndex];
                                const arrivalStop = journey.stop_times[journey.toIndex];

                                const departureTime = formatTime(departureStop?.utc_departure_time);
                                const arrivalTime = formatTime(arrivalStop?.utc_arrival_time);

                                const duration = calculateDuration(departureStop?.utc_departure_time, arrivalStop?.utc_arrival_time);

                                // Calculer le prix en fonction de la distance et du jour
                                const price = calculatePriceWithDayAdjustment(distanceKm, returnDay);

                                // Ajouter la valeur numérique de l'heure pour le tri
                                const departureTimeValue = departureStop?.utc_departure_time ? parseInt(departureStop.utc_departure_time.substring(0, 4)) : 0;

                                return {
                                    id: journey.id_vehicle_journey,
                                    departureTime,
                                    arrivalTime,
                                    duration,
                                    price: `€${price}`,
                                    departureTimeValue,
                                };
                            })
                            // Trier les trajets du plus tôt au plus tard
                            .sort((a: Trip, b: Trip) => {
                                // Trier par heure de départ
                                const timeA = a.departureTime.split(":");
                                const timeB = b.departureTime.split(":");
                                const hourA = parseInt(timeA[0]);
                                const hourB = parseInt(timeB[0]);
                                if (hourA !== hourB) return hourA - hourB;
                                const minA = parseInt(timeA[1]);
                                const minB = parseInt(timeB[1]);
                                return minA - minB;
                            });

                        setReturnTrips(formattedReturnTrips);
                    } catch (returnError) {
                        console.error("Erreur lors du chargement des trajets de retour:", returnError);
                    }
                }
            } catch (error: unknown) {
                console.error("Erreur lors du chargement des trajets:", error);
                setError(error instanceof Error ? error.message : String(error));
            } finally {
                setLoading(false);
            }
        };

        fetchJourneys();
    }, [departure, arrival, departDate, returnDate, distanceKm, departDay, returnDay]);

    return (
        <div>
            {loading ? (
                <div className="text-center py-4">Chargement des trajets...</div>
            ) : error ? (
                <div className="text-center py-4 text-red-500">Erreur : {error}</div>
            ) : (
                <>
                    {departureTrips.length > 0 ? (
                        <TripSection
                            title="Aller"
                            station1={departure}
                            station2={arrival}
                            trips={departureTrips}
                            selectedTripId={selectedDepartureId || undefined}
                            onSelectTrip={tripId => setSelectedDepartureId(tripId)}
                        />
                    ) : (
                        <div className="text-center py-4">Aucun trajet disponible pour l'aller à cette date</div>
                    )}

                    {returnDate &&
                        (returnTrips.length > 0 ? (
                            <TripSection
                                title="Retour"
                                station1={arrival}
                                station2={departure}
                                trips={returnTrips}
                                selectedTripId={selectedReturnId || undefined}
                                onSelectTrip={tripId => setSelectedReturnId(tripId)}
                            />
                        ) : (
                            <div className="text-center py-4">Aucun trajet disponible pour le retour à cette date</div>
                        ))}
                </>
            )}
        </div>
    );
}
