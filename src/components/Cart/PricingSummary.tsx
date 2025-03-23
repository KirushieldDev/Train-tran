import React from "react";

export const PricingSummary: React.FC = () => {
    return (
        <section className="p-6 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col gap-3">
                <div className="flex justify-between px-0 py-0.5">
                    <div className="text-base text-gray-600">Sous-total</div>
                    <div className="text-base text-gray-600">90 €</div>
                </div>
                <div className="flex justify-between px-0 py-0.5">
                    <div className="text-base text-gray-600">Options</div>
                    <div className="text-base text-gray-600">25 €</div>
                </div>
                <div className="flex justify-between px-0 py-0.5">
                    <div className="text-base text-gray-600">TVA (20%)</div>
                    <div className="text-base text-gray-600">23 €</div>
                </div>
                <div className="flex justify-between pt-4 border-t border-solid">
                    <div className="text-lg font-bold text-black">Total</div>
                    <div className="text-lg font-bold text-emerald-600">138 €</div>
                </div>
            </div>
        </section>
    );
};
