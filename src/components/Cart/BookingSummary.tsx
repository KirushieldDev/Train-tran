"use client";

import TripCard from "@traintran/components/Cart/TripCard";
import OptionsSection from "@traintran/components/Cart/OptionsSection";
import PricingSummary from "@traintran/components/Cart/PricingSummary";
import {useRouter} from "next/navigation";
import {useCart} from "@traintran/context/CartContext";
import React from "react";

export default function BookingSummary() {
    const router = useRouter();
    const {cartTicket} = useCart();

    if (!cartTicket) return null;

    const handleModify = () => {
        const params = new URLSearchParams({
            departure: cartTicket.outbound.departureStation,
            arrival: cartTicket.outbound.arrivalStation,
            departure_date: (cartTicket.outbound.departureTime).split('T')[0],
        });
        if (cartTicket.inbound) {
            params.set("return_date", (cartTicket.inbound.arrivalTime).split('T')[0]);
        }
        router.push(`/calendrier?${params.toString()}`);
    };

    const handleConfirm = () => {
        router.push("/paiement");
    };

    return (
        <main className="flex flex-col gap-6 pl-19 pt-10 pb-24 mx-auto w-[1000px]">
            <h1 className="text-4xl font-bold leading-snug text-gray-900">Récapitulatif de votre réservation</h1>

            <TripCard ticket={cartTicket} segment="outbound" />

            {cartTicket && cartTicket.inbound !== undefined ? <TripCard ticket={cartTicket} segment="inbound" /> : null}

            <OptionsSection ticket={cartTicket} />
            <PricingSummary ticket={cartTicket} />

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
