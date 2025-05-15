"use client";

import React from "react";
import {useOptionsList, OptionID} from "@traintran/lib/options";
import {OrderSummaryProps} from "@traintran/components/AdditionalOptions/types";
import {useRouter} from "next/navigation";
import {useCart} from "@traintran/context/CartContext";
import {useAuth} from "@traintran/context/AuthContext";

export default function OrderSummary(props: OrderSummaryProps) {
    const {ticket, selectedOptions, showButton, reduce} = props;
    const router = useRouter();
    const {getOptionsPrice, getAdherentDiscountPercent, getAdherentDiscountAmount} = useCart();
    const {options, loading} = useOptionsList();
    const {user} = useAuth();

    const passengerCount = ticket.passengers.length;
    const totalPrice = ticket.totalPrice;
    const outboundOptionPrice = getOptionsPrice(ticket) / (ticket.inbound ? 2 : 1);
    
    // Calcul du prix de base des billets
    const baseTicketPrice = ticket.basePrice * ticket.passengers.length * (ticket.inbound ? 2 : 1);
    
    // Récupération des informations de réduction
    const discountPercent = getAdherentDiscountPercent();
    const discountAmount = getAdherentDiscountAmount(baseTicketPrice);

    // Helper pour trouver une option par son ID
    const findOptionById = (optId: OptionID) => options.find(option => option.id === optId);

    return (
        <div className="w-full">
            <h2 className="font-semibold text-xl mb-4 text-textPrimary">Récapitulatif</h2>
            <div className="space-y-3">
                {/* Prix total des billets */}
                <div className="flex justify-between text-textPrimary">
                    <span>Billet de base</span>
                    <span className="font-medium">{ticket.basePrice}€</span>
                </div>

                {/* Nombre de passagers */}
                <div className="flex justify-between text-textSecondary">
                    <span>Nombre de passagers</span>
                    <span className="font-medium">{passengerCount}</span>
                </div>

                {/* Sous total de base */}
                <div className="flex justify-between font-semibold text-textSecondary">
                    <span>Sous total</span>
                    <span>{ticket.basePrice * ticket.passengers.length}€</span>
                </div>
                
                {/* Réduction adhérent */}
                {user && discountAmount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                        <span>Réduction adhérent ({discountPercent}%)</span>
                        <span>-{discountAmount.toFixed(2)}€</span>
                    </div>
                )}

                {/* Options sélectionnées */}
                {selectedOptions.length > 0 && !loading && (
                    <>
                        <div className="flex flex-col gap-2 border-t border-borderContainer pt-3">
                            {reduce ? (
                                <div className="flex justify-between text-textSecondary">
                                    <span>Options</span>
                                    <span className="font-medium">{outboundOptionPrice}€</span>
                                </div>
                            ) : (
                                selectedOptions.map((optId, i) => {
                                    const option = findOptionById(optId);
                                    if (!option) return null;
                                    return (
                                        <div key={i} className="flex justify-between text-textSecondary">
                                            <span>{option.name}</span>
                                            <span className="font-medium text-primary">
                                                {option.price === 0 ? "Gratuit" : `+${option.price * passengerCount}€`}
                                            </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        {/* Sous total des options */}
                        <div className="flex justify-between font-semibold text-textSecondary">
                            <span>Sous total</span>
                            <span>{outboundOptionPrice}€</span>
                        </div>
                    </>
                )}

                <div className="flex flex-col gap-2 justify-between text-textSecondary border-t border-borderContainer pt-3 mt-4">
                    {/* Aller et retour */}
                    {ticket.inbound ? (
                        <div className="flex justify-between text-textSecondary">
                            <span>Aller/Retour</span>
                            <span className="font-medium">x2</span>
                        </div>
                    ) : (
                        <div className="flex justify-between text-textSecondary">
                            <span>Aller simple</span>
                        </div>
                    )}
                    {/* Total final */}
                    <div className="flex justify-between font-semibold text-textPrimary">
                        <span className="text-lg">Total</span>
                        <span className="text-lg">{totalPrice}€</span>
                    </div>
                </div>
            </div>

            {showButton && (
                <button onClick={() => router.push("/panier")} className="w-full mt-8 button-base button-variant-primary button-size-lg">
                    Continuer
                </button>
            )}
        </div>
    );
}
