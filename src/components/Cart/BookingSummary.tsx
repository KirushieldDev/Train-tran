"use client";

import TripCard from "@traintran/components/Cart/TripCard";
import OptionsSection from "@traintran/components/Cart/OptionsSection";
import PricingSummary from "@traintran/components/Cart/PricingSummary";
import {useRouter} from "next/navigation";
import {useCart} from "@traintran/context/CartContext";
import React from "react";

export default function BookingSummary() {
    // Hooks pour navigation et récupération du ticket en cours
    const router = useRouter();
    const {cartTicket} = useCart();

    // Si pas de ticket en cours, on ne rend rien
    if (!cartTicket) return null;

    // Gérer la modification : rediriger vers le calendrier avec paramètres actuels
    const handleModify = () => {
        const params = new URLSearchParams({
            departure: cartTicket.outbound.departureStation,
            arrival: cartTicket.outbound.arrivalStation,
            departure_date: cartTicket.outbound.departureTime.split("T")[0],
        });
        if (cartTicket.inbound) {
            params.set("return_date", cartTicket.inbound.arrivalTime.split("T")[0]);
        }
        router.push(`/calendrier?${params.toString()}`);
    };

    // Gérer la confirmation : rediriger vers la page paiement
    const handleConfirm = () => {
        router.push("/paiement");
    };

    return (
        <main className="flex flex-col gap-6 pl-19 pt-10 pb-24 mx-auto w-[1000px]">
            {/* Titre de la page */}
            <h1 className="text-4xl font-bold leading-snug text-gray-900">Récapitulatif de votre réservation</h1>

            {/* Affichage du trajet aller */}
            <TripCard ticket={cartTicket} segment="outbound" />

            {/* Affichage du trajet retour s'il existe */}
            {cartTicket && cartTicket.inbound !== undefined ? <TripCard ticket={cartTicket} segment="inbound" /> : null}

            {/* Section des options additionnelles */}
            <OptionsSection ticket={cartTicket} />

            {/* Résumé des prix */}
            <PricingSummary ticket={cartTicket} />

            {/* Boutons Modifier et Confirmer */}
            <div className="flex flex-wrap gap-2.5 justify-center mt-8 mb-5 w-full text-base text-center max-md:max-w-full">
                <button onClick={handleModify} className="button-base button-variant-outline button-size-lg">
                    Modifier
                </button>
                <button onClick={handleConfirm} className="button-base button-variant-secondary button-size-lg">
                    Confirmer et payer
                </button>
            </div>
        </main>
    );
}
