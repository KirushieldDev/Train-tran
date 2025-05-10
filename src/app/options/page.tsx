"use client";

import {OptionID} from "@traintran/lib/options";
import Header from "@traintran/components/Header/Header";
import {OptionsList} from "@traintran/components/AdditionalOptions/OptionsList";
import {OrderSummary} from "@traintran/components/AdditionalOptions/OrderSummary";
import Footer from "@traintran/components/Footer/Footer";
import {useCart} from "@traintran/context/CartContext";
import {useOptionsSync} from "@traintran/hooks/useOptionsSync";

export default function Home() {
    const {toggleOption} = useCart();
    const {selectedOptions, setSelectedOptions} = useOptionsSync();

    // Quand l'utilisateur change une option, on met à jour le contexte
    const handleOptionChange = (id: OptionID) => {
        toggleOption(id);
        setSelectedOptions(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-grow">
                <div className="mx-auto max-w-[1024px] px-4 py-8">
                    <h1 className="mb-6 text-2xl font-semibold text-textPrimary">Options supplémentaires</h1>
                    <div className="flex flex-col gap-8 md:flex-row md:gap-32">
                        {/* Sélecteur d’options */}
                        <div className="w-full md:w-[480px]">
                            <div className="rounded-lg border border-borderContainer bg-white p-6 shadow-sm">
                                <OptionsList selectedOptions={selectedOptions} onOptionToggle={handleOptionChange} />
                            </div>
                        </div>
                        {/* Récapitulatif */}
                        <div className="w-full md:w-[384px]">
                            <div className="sticky top-4 rounded-lg border border-borderContainer bg-white p-6 shadow-sm">
                                <OrderSummary selectedOptions={selectedOptions} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
