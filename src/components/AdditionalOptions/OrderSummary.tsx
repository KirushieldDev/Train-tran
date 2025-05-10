"use client";

import React from "react";
import getOptionById from "@traintran/lib/options";
import {OrderSummaryProps} from "@traintran/components/AdditionalOptions/types";
import {useCart} from "@traintran/context/CartContext";
import {useRouter} from "next/navigation";

export const OrderSummary: React.FC<OrderSummaryProps> = ({selectedOptions, showButton = true}) => {
    const {cartTicket, getTotalPrice} = useCart();
    const router = useRouter();

    if (!cartTicket) {
        return null;
    }

    const passengersCount = cartTicket.passengers.length;
    // Calculs de prix
    const totalPrice = getTotalPrice();

    return (
        <div className="w-full">
            <h2 className="font-semibold text-xl mb-4 text-textPrimary">Récapitulatif</h2>
            <div className="space-y-3">
                {/* Prix total des billets */}
                <div className="flex justify-between text-textPrimary">
                    <span>Billet de base</span>
                    <span className="font-medium">{cartTicket.basePrice}€</span>
                </div>

                {/* Options sélectionnées */}
                {selectedOptions.map((optId, i) => {
                    const option = getOptionById(optId);
                    if (!option) return null;
                    return (
                        <div key={i} className="flex justify-between text-primary">
                            <span>{option.name}</span>
                            <span className="font-medium">{option.price === 0 ? "Gratuit" : `+${option.price * passengersCount}€`}</span>
                        </div>
                    );
                })}

                {/* Nombre de passagers */}
                <div className="flex justify-between text-textSecondary">
                    <span>Nombre de passagers</span>
                    <span className="font-medium">{passengersCount}</span>
                </div>

                {/* Total final */}
                <div className="border-t border-borderContainer pt-3 mt-4">
                    <div className="flex justify-between font-semibold text-textPrimary">
                        <span className="text-lg">Total</span>
                        <span className="text-lg">{totalPrice}€</span>
                    </div>
                </div>
            </div>

            {showButton && (
                <button
                    onClick={() => router.push("/panier")}
                    className="w-full mt-8 button-base button-variant-primary button-size-lg">
                    Continuer
                </button>
            )}
        </div>
    );
};
