import React, {useState, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import TripSection from "@traintran/components/Calendar/Departure/TripSection";
import {calculatePriceWithDayAdjustment, getDayOfWeek, isJourneyAvailableOnDay, formatTime, calculateDuration} from "@traintran/utils/travel";
import {Journey, Trip} from "@traintran/components/Calendar/types";

interface DepartureProps {
    distanceKm: number;
    onSelectDepartureTrip?: (trip: Trip) => void;
    onSelectReturnTrip?: (trip: Trip) => void;
}

export default function Departure({distanceKm, onSelectDepartureTrip, onSelectReturnTrip}: DepartureProps) {
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

    // Fonction pour trouver un trajet par son ID
    const findTripById = (trips: Trip[], id: string): Trip | undefined => {
        return trips.find(trip => trip.id === id);
    };

    // Calcul du jour pour chaque trajet
    const departDay = departDate ? getDayOfWeek(departDate) : getDayOfWeek(new Date().toISOString());
    // Pour le retour, on utilise une date différente de l'aller
    const returnDay = returnDate ? getDayOfWeek(returnDate) : null;

    // Fonction générique pour récupérer les trajets (aller ou retour)
    const fetchJourneysForDirection = async (direction: "outbound" | "inbound") => {
        const isOutbound = direction === "outbound";
        const fromStation = isOutbound ? departure : arrival;
        const toStation = isOutbound ? arrival : departure;
        const selectedDay = isOutbound ? departDay : returnDay || "";

        // Si c'est un trajet retour et qu'il n'y a pas de jour de retour, on arrête
        if (!isOutbound && !returnDay) return;

        try {
            // Construire l'URL avec URLSearchParams
            const params = new URLSearchParams({from: fromStation, to: toStation});

            // Récupérer les trajets
            const response = await fetch(`/api/journey/trip?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Erreur lors de la récupération des trajets ${isOutbound ? "aller" : "retour"}`);
            }

            const data = await response.json();

            // Filtrer les trajets pour le jour de la semaine sélectionné
            const filteredJourneys = data.journeys.filter((journey: Journey) => {
                return journey.weekPattern && isJourneyAvailableOnDay(selectedDay, journey.weekPattern);
            });

            // Formater les trajets pour l'affichage
            const formattedTrips = filteredJourneys
                .map((journey: Journey) => {
                    // Extraire les horaires spécifiques aux gares de départ et d'arrivée
                    const departureStop = journey.stop_times[journey.fromIndex];
                    const arrivalStop = journey.stop_times[journey.toIndex];

                    const departureTime = formatTime(departureStop?.utc_departure_time);
                    const arrivalTime = formatTime(arrivalStop?.utc_arrival_time);

                    const duration = calculateDuration(departureStop?.utc_departure_time, arrivalStop?.utc_arrival_time);

                    // Calculer le prix en fonction de la distance et du jour
                    const price = calculatePriceWithDayAdjustment(distanceKm, selectedDay);

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

            // Mettre à jour l'état approprié
            if (isOutbound) {
                setDepartureTrips(formattedTrips);
            } else {
                setReturnTrips(formattedTrips);
            }

            return formattedTrips;
        } catch (error) {
            console.error(`Erreur lors du chargement des trajets ${isOutbound ? "aller" : "retour"}:`, error);

            // Pour les trajets aller, on propage l'erreur
            // Pour les trajets retour, on ne propage pas l'erreur pour permettre l'affichage des trajets aller
            if (isOutbound) {
                throw error;
            } else {
                setReturnTrips([]);
                return [];
            }
        }
    };

    // Fonctions spécifiques qui utilisent la fonction générique
    const fetchOutboundJourneys = () => fetchJourneysForDirection("outbound");
    const fetchInboundJourneys = () => fetchJourneysForDirection("inbound");

    // Récupérer les trajets depuis l'API
    useEffect(() => {
        const fetchJourneys = async () => {
            if (!departure || !arrival || !departDate) return;

            setLoading(true);
            setError(null);

            try {
                // Récupérer les trajets aller
                await fetchOutboundJourneys();

                // Récupérer les trajets retour si une date de retour est spécifiée
                if (returnDate && returnDay !== null) {
                    await fetchInboundJourneys();
                } else {
                    // Réinitialiser les trajets retour si pas de date de retour
                    setReturnTrips([]);
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

    // Effet pour notifier le composant parent lorsqu'un trajet est sélectionné
    useEffect(() => {
        if (selectedDepartureId && onSelectDepartureTrip) {
            const selectedTrip = findTripById(departureTrips, selectedDepartureId);
            if (selectedTrip) {
                onSelectDepartureTrip(selectedTrip);
            }
        }
    }, [selectedDepartureId, departureTrips, onSelectDepartureTrip]);

    // Effet pour notifier le composant parent lorsqu'un trajet retour est sélectionné
    useEffect(() => {
        if (selectedReturnId && onSelectReturnTrip) {
            const selectedTrip = findTripById(returnTrips, selectedReturnId);
            if (selectedTrip) {
                onSelectReturnTrip(selectedTrip);
            }
        }
    }, [selectedReturnId, returnTrips, onSelectReturnTrip]);

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
                        <div className="text-center py-4">Aucun trajet disponible pour l&#39;aller à cette date</div>
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
