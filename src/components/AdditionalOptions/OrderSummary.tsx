import React from "react";
import Button from "@traintran/components/common/Button";
import getOptionById from "@traintran/lib/options";
import { OrderSummaryProps } from "@traintran/components/AdditionalOptions/types";
import { useCart } from "@traintran/context/CartContext";

export const OrderSummary: React.FC<OrderSummaryProps> = ({
                                                              basePrice,
                                                              selectedOptions,
                                                              totalPrice,
                                                              onContinue,
                                                              showButton = true
                                                          }) => {
    const { tickets } = useCart();

    const passengerCount = tickets.reduce((sum, t) => sum + t.passengers.length, 0);

    return (
        <div className="w-full">
            <h2 className="font-semibold text-xl mb-4 text-textPrimary">Récapitulatif</h2>
            <div className="space-y-3">
                {/* Prix total des billets */}
                <div className="flex justify-between text-textPrimary">
                    <span>Billet de base</span>
                    <span className="font-medium">{basePrice}€</span>
                </div>

                {/* Options sélectionnées */}
                {selectedOptions.map((optId, i) => {
                    const option = getOptionById(optId);
                    if (!option) return null;
                    return (
                        <div key={i} className="flex justify-between text-primary">
                            <span>{option.name}</span>
                            <span className="font-medium">
                {option.price === 0 ? "Gratuit" : `+${option.price}€`}
              </span>
                        </div>
                    );
                })}

                {/* Nombre de passagers */}
                <div className="flex justify-between text-textSecondary">
                    <span>Nombre de passagers</span>
                    <span className="font-medium">{passengerCount}</span>
                </div>

                {/* Total final */}
                <div className="border-t border-borderContainer pt-3 mt-4">
                    <div className="flex justify-between font-semibold text-textPrimary">
                        <span className="text-lg">Total</span>
                        <span className="text-lg">{totalPrice}€</span>
                    </div>
                </div>
            </div>

            {showButton && onContinue && (
                <Button
                    onClick={onContinue}
                    variant="secondary"
                    fullWidth
                    className="mt-8"
                    size="lg"
                >
                    Continuer
                </Button>
            )}
        </div>
    );
};
