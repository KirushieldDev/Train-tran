import React, {useState, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import TripSection from "@traintran/components/Calendar/Departure/TripSection";
import {calculatePriceWithDayAdjustment} from "@traintran/utils/travel";

export default function Departure({distanceKm}: {distanceKm: number}) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const departure = searchParams.get("departure") ?? "";
    const arrival = searchParams.get("arrival") ?? "";
    const departDate = searchParams.get("departure_date");
    const returnDate = searchParams.get("return_date");

    const [departureTrips, setDepartureTrips] = useState<any[]>([]);
    const [returnTrips, setReturnTrips] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // États pour stocker les trajets sélectionnés
    const [selectedDepartureId, setSelectedDepartureId] = useState<string | null>(null);
    const [selectedReturnId, setSelectedReturnId] = useState<string | null>(null);

    // On récupère le jour de la semaine à partir de la date
    const getDayOfWeek = (dateStr: string) => {
        const date = new Date(dateStr);
        // On mets en US pour avoir le nom du jour en anglais et long pour avoir le nom complet
        return date.toLocaleDateString("en-US", {weekday: "long"});
    };

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
                // Récupérer les trajets pour le jour de départ
                const response = await fetch(`/api/journey/trip?from=${encodeURIComponent(departure)}&to=${encodeURIComponent(arrival)}`);
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des trajets");
                }

                const data = await response.json();

                // Filtrer les trajets pour le jour de la semaine sélectionné
                const departJourneys = data.journeys.filter((journey: any) => {
                    const weekPattern = journey.weekPattern;
                    if (!weekPattern) return true;

                    switch (departDay.toLowerCase()) {
                        case "monday":
                            return weekPattern.monday;
                        case "tuesday":
                            return weekPattern.tuesday;
                        case "wednesday":
                            return weekPattern.wednesday;
                        case "thursday":
                            return weekPattern.thursday;
                        case "friday":
                            return weekPattern.friday;
                        case "saturday":
                            return weekPattern.saturday;
                        case "sunday":
                            return weekPattern.sunday;
                        default:
                            return false;
                    }
                });

                // Fonctions utilitaires pour formater les horaires et calculer les durées
                const formatTime = (timeStr: string | undefined): string => {
                    if (!timeStr) return "";

                    // Convertir l'heure UTC en UTC+2 (heure locale française)
                    const hours = parseInt(timeStr.substring(0, 2));
                    const minutes = parseInt(timeStr.substring(2, 4));

                    // Ajouter 2 heures pour passer de UTC à UTC+2
                    let localHours = hours + 2;

                    // Gérer le passage au jour suivant si nécessaire
                    if (localHours >= 24) {
                        localHours -= 24;
                    }

                    // Formater l'heure avec des zéros devant si nécessaire
                    const formattedHours = localHours.toString().padStart(2, "0");
                    const formattedMinutes = minutes.toString().padStart(2, "0");

                    return `${formattedHours}:${formattedMinutes}`;
                };

                const calculateDuration = (depTime: string | undefined, arrTime: string | undefined): string => {
                    if (!depTime || !arrTime) return "";

                    const depHours = parseInt(depTime.substring(0, 2));
                    const depMinutes = parseInt(depTime.substring(2, 4));
                    const arrHours = parseInt(arrTime.substring(0, 2));
                    const arrMinutes = parseInt(arrTime.substring(2, 4));

                    let durationHours = arrHours - depHours;
                    let durationMinutes = arrMinutes - depMinutes;

                    if (durationMinutes < 0) {
                        durationHours--;
                        durationMinutes += 60;
                    }

                    return `${durationHours}h ${durationMinutes}m`;
                };

                // Formater les trajets pour l'affichage
                const formattedDepartTrips = departJourneys
                    .map(journey => {
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
                    .sort((a, b) => a.departureTimeValue - b.departureTimeValue);

                setDepartureTrips(formattedDepartTrips);

                // Si une date de retour est spécifiée, récupérer les trajets pour le retour
                if (returnDate) {
                    // Faire une nouvelle requête API pour les trajets de retour en inversant les gares
                    try {
                        const returnResponse = await fetch(`/api/journey/trip?from=${encodeURIComponent(arrival)}&to=${encodeURIComponent(departure)}`);
                        if (!returnResponse.ok) {
                            throw new Error("Erreur lors de la récupération des trajets de retour");
                        }

                        const returnData = await returnResponse.json();

                        // Filtrer les trajets pour le jour de la semaine sélectionné
                        const returnJourneys = returnData.journeys.filter((journey: any) => {
                            const weekPattern = journey.weekPattern;
                            if (!weekPattern) return true;

                            switch (returnDay.toLowerCase()) {
                                case "monday":
                                    return weekPattern.monday;
                                case "tuesday":
                                    return weekPattern.tuesday;
                                case "wednesday":
                                    return weekPattern.wednesday;
                                case "thursday":
                                    return weekPattern.thursday;
                                case "friday":
                                    return weekPattern.friday;
                                case "saturday":
                                    return weekPattern.saturday;
                                case "sunday":
                                    return weekPattern.sunday;
                                default:
                                    return false;
                            }
                        });

                        const formattedReturnTrips = returnJourneys
                            .map(journey => {
                                // Pour le retour, nous utilisons les mêmes indices car la requête API a déjà inversé les gares
                                const departureStop = journey.stop_times[journey.fromIndex];
                                const arrivalStop = journey.stop_times[journey.toIndex];

                                const departureTime = formatTime(departureStop?.utc_departure_time);
                                const arrivalTime = formatTime(arrivalStop?.utc_arrival_time);

                                const duration = calculateDuration(departureStop?.utc_departure_time, arrivalStop?.utc_arrival_time);

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
                            .sort((a, b) => a.departureTimeValue - b.departureTimeValue);

                        setReturnTrips(formattedReturnTrips);
                    } catch (returnError) {
                        console.error("Erreur lors du chargement des trajets de retour:", returnError);
                    }
                }
            } catch (error) {
                console.error("Erreur lors du chargement des trajets:", error);
                setError(error.message);
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

            <div className="flex flex-wrap gap-2.5 justify-center mt-8 mb-10 w-full text-base text-center max-md:max-w-full">
                <button onClick={() => router.push("/")} className="button-base button-variant-outline button-size-lg">
                    Annuler
                </button>
                <button
                    onClick={() => {
                        // Vérifier qu'un trajet aller est sélectionné
                        if (!selectedDepartureId) {
                            alert("Veuillez sélectionner un trajet aller");
                            return;
                        }

                        // Vérifier qu'un trajet retour est sélectionné si une date de retour est spécifiée
                        if (returnDate && !selectedReturnId) {
                            alert("Veuillez sélectionner un trajet retour");
                            return;
                        }

                        // Construire les paramètres URL pour la page suivante
                        const params = new URLSearchParams(Array.from(searchParams.entries()));
                        params.set("departure_trip_id", selectedDepartureId);
                        if (returnDate && selectedReturnId) {
                            params.set("return_trip_id", selectedReturnId);
                        }
                    }}
                    className={`button-base button-variant-secondary button-size-lg ${!selectedDepartureId || (returnDate && !selectedReturnId) ? "opacity-50 cursor-not-allowed" : ""}`}>
                    Continuer la commande
                </button>
            </div>
        </div>
    );
}
