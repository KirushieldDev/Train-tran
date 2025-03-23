"use client";
import { TripCard } from "./TripCard";
import { OptionsSection } from "./OptionsSection";
import { PricingSummary } from "./PricingSummary";
import Buttons from "./Buttons.tsx";

export default function BookingSummary() {
    const handleModify = () => {
        window.location.href = "/calendrier";
    };

    const handleConfirm = () => {
        window.location.href = "/paiement";
    };
    return (
        <>
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
                rel="stylesheet"
            />
            <main className="flex flex-col gap-6 pl-19 pt-10 pb-24 mx-auto w-[1000px]">
                <h1 className="text-4xl font-bold leading-snug text-gray-900">
                    Récapitulatif de votre réservation
                </h1>

                <TripCard
                    date="20/03/2025"
                    departureCity="Paris"
                    departureTime="09:30"
                    arrivalCity="Lyon"
                    arrivalTime="11:45"
                    price="45,00 €"
                    passengers="2 passagers"
                    title="Trajet aller vers Lyon le"
                />

                <TripCard
                    date="23/03/2025"
                    departureCity="Lyon"
                    departureTime="18:30"
                    arrivalCity="Paris"
                    arrivalTime="20:45"
                    price="45,00 €"
                    passengers="2 passagers"
                    title="Trajet retour vers Paris le"
                />

                <OptionsSection />
                <PricingSummary />

                <Buttons onModify={handleModify} onConfirmAndPay={handleConfirm} />
            </main>
        </>
    );
}
