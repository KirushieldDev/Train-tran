"use client";

import React from "react";
import {Ticket, useCart} from "@traintran/context/CartContext";
import {useAuth} from "@traintran/context/AuthContext";

interface PricingSummaryProps {
    ticket: Ticket;
}

export default function PricingSummary(props: PricingSummaryProps) {
    const {ticket} = props;
    const {getOptionsPrice, getAdherentDiscountPercent, getAdherentDiscountAmount} = useCart();
    const {user} = useAuth();

    // Prix brut sans réduction
    const trips = ticket.inbound ? 2 : 1;
    const ticketPriceOnly = ticket.basePrice * ticket.passengers.length * trips;
    const optionsPrice = getOptionsPrice(ticket);

    // Récupération des informations de réduction
    const discountPercent = getAdherentDiscountPercent();
    const discountAmount = getAdherentDiscountAmount(ticketPriceOnly);

    return (
        <section className="p-6 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-3">
                <div className="flex justify-between px-0 py-0.5">
                    <div className="text-base text-textSecondary">Sous-total</div>
                    <div className="text-base text-textSecondary">{ticketPriceOnly} €</div>
                </div>
                <div className="flex justify-between px-0 py-0.5">
                    <div className="text-base text-textSecondary">Options</div>
                    <div className="text-base text-textSecondary">{optionsPrice} €</div>
                </div>

                {user && discountAmount > 0 && (
                    <div className="flex justify-between px-0 py-0.5">
                        <div className="text-base font-medium text-green-600">Réduction adhérent ({discountPercent}%)</div>
                        <div className="text-base font-medium text-green-600">-{discountAmount.toFixed(2)} €</div>
                    </div>
                )}

                <div className="flex justify-between px-0 py-0.5">
                    <div className="text-base text-textSecondary">TVA (20%)</div>
                    <div className="text-base text-textSecondary">{(ticket.totalPrice * 0.2).toFixed(2)} €</div>
                </div>
                <div className="flex justify-between pt-4 border-t border-solid">
                    <div className="text-lg font-bold text-black">Total</div>
                    <div className="text-lg font-bold text-primary">{ticket.totalPrice} €</div>
                </div>
            </div>
        </section>
    );
}
