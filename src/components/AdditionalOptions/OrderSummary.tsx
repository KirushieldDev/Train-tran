import React from 'react';
import { OrderSummaryProps } from './types';
import Button from '../common/Button';

export const OrderSummary: React.FC<OrderSummaryProps> = ({
    basePrice,
    selectedOptions,
    totalPrice,
    onContinue,
    showButton = true
}) => {
    return (
        <div>
            <h2 className="font-semibold text-lg mb-4 text-textPrimary">Récapitulatif</h2>
            <div className="space-y-2">
                <div className="flex justify-between text-textPrimary">
                    <span>Billet de base</span>
                    <span>{basePrice}€</span>
                </div>
                {selectedOptions.map(option => (
                    <div key={option.id} className="flex justify-between text-primary">
                        <span>{option.name}</span>
                        <span>{option.price === 0 ? 'Gratuit' : `+${option.price}€`}</span>
                    </div>
                ))}
                <div className="border-t border-borderContainer pt-2 mt-4">
                    <div className="flex justify-between font-semibold text-textPrimary">
                        <span>Total</span>
                        <span>{totalPrice}€</span>
                    </div>
                </div>
            </div>
            {showButton && onContinue && (
                <Button
                    onClick={onContinue}
                    variant="secondary"
                    fullWidth
                    className="mt-6"
                >
                    Continuer
                </Button>
            )}
        </div>
    );
};
