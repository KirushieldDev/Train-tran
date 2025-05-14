"use client";

import React, {useEffect, useState} from "react";
import {useSearchParams, useRouter} from "next/navigation";
import Header from "@traintran/components/Header/Header";
import TrainJourneyDisplay from "@traintran/components/Calendar/Destination/TrainJourneyDisplay";
import Calendar from "@traintran/components/Calendar/Calendar";
import {Journey, Trip} from "@traintran/components/Calendar/types";
import Departure from "@traintran/components/Calendar/Departure/Departure";
import Footer from "@traintran/components/Footer/Footer";
import {calculateDistance} from "@traintran/utils/travel";
import ReservationStepper from "@traintran/components/common/ReservationStepper";
import {useCart, Ticket, JourneySegment} from "@traintran/context/CartContext";

export default function CalendarPage() {
    const {cartTicket, setCartTicket} = useCart();
    const router = useRouter();
    const searchParams = useSearchParams();
    const {startTimeout} = useTimeout();

    const departure = searchParams.get("departure") ?? "";
    const arrival = searchParams.get("arrival") ?? "";
    const departDateParam = searchParams.get("departure_date");
    const returnDateParam = searchParams.get("return_date");

    // État pour stocker la date de retour sélectionnée
    const [returnDate, setReturnDate] = useState<Date | null>(returnDateParam ? new Date(returnDateParam) : null);
    
    // État pour stocker le mode de sélection de date (aller ou retour)
    const [dateSelectionMode, setDateSelectionMode] = useState<'outbound' | 'inbound'>('outbound');

    // Gestion du changement de date (aller ou retour selon le mode)
    const handleDateChange = (date: Date | null, journeys?: Journey[], type?: 'outbound' | 'inbound') => {
        if (!date) return;
        
        // Déterminer si c'est une date d'aller ou de retour en fonction du mode
        const isOutbound = dateSelectionMode === 'outbound';
        console.log(`Date ${isOutbound ? 'aller' : 'retour'} sélectionnée:`, date);
        console.log("Trajets disponibles:", journeys);

        // On formatte la date
        const isoDate = date.toISOString().split("T")[0];
        // On récupère les paramètres de la requête
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        
        if (isOutbound) {
            // Mode aller
            params.set("departure_date", isoDate);
            // Conserver la date de retour si elle existe
            if (returnDateParam) params.set("return_date", returnDateParam);
        } else {
            // Mode retour
            params.set("return_date", isoDate);
            setReturnDate(date);
            // S'assurer que la date d'aller est définie
            if (departDateParam) params.set("departure_date", departDateParam);
        }

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
                const params = new URLSearchParams({from: departure, to: arrival});
                const res = await fetch(`/api/journey/stations-coords?${params.toString()}`);
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.message || "Erreur récupération gares");
                }
                const data = await res.json();
                setCoords(data);
            } catch (err: unknown) {
                console.error(err);
                setError(err instanceof Error ? err.message : String(err));
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

    // État pour stocker les trajets sélectionnés
    const [selectedDepartureTrip, setSelectedDepartureTrip] = useState<Trip | null>(null);
    const [selectedReturnTrip, setSelectedReturnTrip] = useState<Trip | null>(null);

    // Fonction pour gérer la sélection d'un trajet aller
    const handleDepartureSelect = (trip: Trip) => {
        setSelectedDepartureTrip(trip);
    };

    // Fonction pour gérer la sélection d'un trajet retour
    const handleReturnSelect = (trip: Trip) => {
        setSelectedReturnTrip(trip);
    };

    const handleNext = () => {
        // TODO: Construire le ticket client et le setter dans CartContext grâce à setCartTicket()
        // on démarre le compte à rebours
        startTimeout();

        // Vérifier qu'un trajet aller a été sélectionné
        if (!selectedDepartureTrip) {
            alert("Veuillez sélectionner un trajet aller.");
            return;
        }

        // Construire le segment aller
        const outbound: JourneySegment = {
            departureStation: departure,
            arrivalStation: arrival,
            departureTime: `${departDateParam}T${selectedDepartureTrip.departureTime}:00.000Z`,
            arrivalTime: `${departDateParam}T${selectedDepartureTrip.arrivalTime}:00.000Z`,
        };

        // Construire le segment retour si nécessaire
        let inbound: JourneySegment | undefined;
        if (returnDateParam && selectedReturnTrip) {
            inbound = {
                departureStation: arrival,
                arrivalStation: departure,
                departureTime: `${returnDateParam}T${selectedReturnTrip.departureTime}:00.000Z`,
                arrivalTime: `${returnDateParam}T${selectedReturnTrip.arrivalTime}:00.000Z`,
            };
        }

        // Extraire le prix de base
        const basePrice = parseFloat(selectedDepartureTrip.price.replace('€', ''));

        // Créer le ticket
        const ticket: Ticket = {
            outbound,
            ...(inbound && { inbound }),
            passengers: [],
            options: [],
            basePrice,
            totalPrice: basePrice
        };

        console.log("Ticket:", ticket);

        // Enregistrer le ticket dans le contexte
        setCartTicket(ticket);
        
        // Rediriger vers la page des passagers
        router.push("/passagers");
    };

    // ON affiche un message de chargement ou d'erreur
    if (loading) return <div>Chargement des données de la gare…</div>;
    if (error || !coords) return <div>Erreur : {error || "Coordonnées introuvables"}</div>;

    // On calcule la distance entre les gares de départ et d'arrivée
    const distanceKm = calculateDistance(coords.from.lat, coords.from.lon, coords.to.lat, coords.to.lon);

    return (
        <>
            <Header />
            <ReservationStepper ticket={cartTicket} page="calendrier" />
            <div className="px-4 md:px-40 lg:px-40">
                <TrainJourneyDisplay />
                <div className="mt-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center mb-4">
                            <div className="inline-flex rounded-md shadow-sm mr-4" role="group">
                                <button
                                    type="button"
                                    onClick={() => setDateSelectionMode('outbound')}
                                    className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg ${dateSelectionMode === 'outbound' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                >
                                    Aller
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setDateSelectionMode('inbound')}
                                    className={`px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-lg ${dateSelectionMode === 'inbound' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                    disabled={!departDateParam} // Désactiver si pas de date d'aller sélectionnée
                                >
                                    Retour
                                </button>
                            </div>
                            <h2 className="text-lg font-semibold">
                                {dateSelectionMode === 'outbound' 
                                    ? "Sélectionnez votre date d'aller" 
                                    : "Sélectionnez votre date de retour"}
                            </h2>
                        </div>
                        
                        {dateSelectionMode === 'outbound' ? (
                            <Calendar
                                onChange={handleDateChange}
                                distanceKm={distanceKm}
                                selectedDate={departDateParam ? new Date(departDateParam) : null}
                                departure={departure}
                                arrival={arrival}
                                type="outbound"
                            />
                        ) : (
                            <Calendar
                                onChange={handleDateChange}
                                distanceKm={distanceKm}
                                selectedDate={returnDate}
                                departure={arrival} // Inverser départ et arrivée pour le retour
                                arrival={departure}
                                type="inbound"
                                minDate={departDateParam ? new Date(departDateParam) : new Date()} // La date de retour doit être après la date d'aller
                            />
                        )}
                    </div>
                </div>
                <Departure 
                    distanceKm={distanceKm} 
                    onSelectDepartureTrip={handleDepartureSelect}
                    onSelectReturnTrip={handleReturnSelect}
                />
                <div className="flex flex-wrap gap-2.5 justify-center mt-8 mb-10 w-full text-base text-center max-md:max-w-full">
                    <button onClick={() => router.push("/")} className="button-base button-variant-outline button-size-lg">
                        Annuler
                    </button>
                    <button onClick={handleNext} className="button-base button-variant-secondary button-size-lg">
                        Continuer la commande
                    </button>
                </div>
            </div>
            <Footer />
        </>
    );
}
