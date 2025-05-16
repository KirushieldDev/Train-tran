"use client";

import React from "react";
import {Ticket, useCart} from "@traintran/context/CartContext";

interface PricingSummaryProps {
    ticket: Ticket;
}

export default function PricingSummary(props: PricingSummaryProps) {
    const {ticket} = props;
    const {getOptionsPrice} = useCart();

    // Calcul du prix de base du ticket en fonction des passagers et trajet retour
    const ticketPriceOnly = ticket.basePrice * ticket.passengers.length * (ticket.inbound ? 2 : 1);

    return (
        <section className="p-6 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-3">
                {/* Prix hors options */}
                <div className="flex justify-between px-0 py-0.5">
                    <div className="text-base text-textSecondary">Sous-total</div>
                    <div className="text-base text-textSecondary">{ticketPriceOnly} €</div>
                </div>

                {/* Prix des options */}
                <div className="flex justify-between px-0 py-0.5">
                    <div className="text-base text-textSecondary">Options</div>
                    <div className="text-base text-textSecondary">{getOptionsPrice(ticket)} €</div>
                </div>

                {/* TVA calculée à 20% */}
                <div className="flex justify-between px-0 py-0.5">
                    <div className="text-base text-textSecondary">TVA (20%)</div>
                    <div className="text-base text-textSecondary">{(ticket.totalPrice * 0.2).toFixed(2)} €</div>
                </div>

                {/* Prix total final */}
                <div className="flex justify-between pt-4 border-t border-solid">
                    <div className="text-lg font-bold text-black">Total</div>
                    <div className="text-lg font-bold text-primary">{ticket.totalPrice} €</div>
                </div>
            </div>
        </section>
    );
}
