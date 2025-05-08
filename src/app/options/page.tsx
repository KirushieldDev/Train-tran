"use client";

import { useEffect, useRef, useState } from "react";
import { OptionID, optionsList } from "@traintran/lib/options";
import Header from "@traintran/components/Header/Header";
import { OptionsList } from "@traintran/components/AdditionalOptions/OptionsList";
import { OrderSummary } from "@traintran/components/AdditionalOptions/OrderSummary";
import Footer from "@traintran/components/Footer/Footer";
import { useRouter } from "next/navigation";
import { useCart } from "@traintran/context/CartContext";

export default function Home() {
    const { tickets, toggleOptionForAllTickets } = useCart();
    const [selectedOptions, setSelectedOptions] = useState<OptionID[]>([]);
    const prevRef = useRef<OptionID[]>([]);
    const router = useRouter();

    // Propagation des toggles au contexte
    useEffect(() => {
        const prev = prevRef.current;
        optionsList.forEach(opt => {
            const was = prev.includes(opt.id);
            const is = selectedOptions.includes(opt.id);
            if (!was && is) toggleOptionForAllTickets(opt.id, true);
            if (was && !is) toggleOptionForAllTickets(opt.id, false);
        });
        prevRef.current = selectedOptions;
    }, [selectedOptions, toggleOptionForAllTickets]);

    const handleOptionChange = (id: OptionID) =>
        setSelectedOptions(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );

    // Calculs de prix
    const totalPassengers = tickets.reduce((sum, t) => sum + t.passengers.length, 0);
    const basePrice = tickets.reduce((sum, t) => sum + t.basePrice, 0);
    const optionsTotal = selectedOptions.reduce((sum, id) => {
        const opt = optionsList.find(o => o.id === id)!;
        return sum + opt.price;
    }, 0);
    const totalPrice = basePrice * totalPassengers + optionsTotal * totalPassengers;

    const handleContinue = () => router.push("/panier");

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow">
                <div className="mx-auto max-w-[1024px] px-4 py-8">
                    <h1 className="mb-6 text-2xl font-semibold text-textPrimary">
                        Options supplémentaires
                    </h1>
                    <div className="flex flex-col gap-8 md:flex-row md:gap-32">
                        {/* Sélecteur d’options */}
                        <div className="w-full md:w-[480px]">
                            <div className="rounded-lg border border-borderContainer bg-white p-6 shadow-sm">
                                <OptionsList
                                    selectedOptions={selectedOptions}
                                    onOptionToggle={handleOptionChange}
                                />
                            </div>
                        </div>
                        {/* Récapitulatif */}
                        <div className="w-full md:w-[384px]">
                            <div className="sticky top-4 rounded-lg border border-borderContainer bg-white p-6 shadow-sm">
                                <OrderSummary
                                    basePrice={basePrice}
                                    selectedOptions={selectedOptions}
                                    totalPrice={totalPrice}
                                    onContinue={handleContinue}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
