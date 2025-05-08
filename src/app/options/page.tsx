"use client";

import {useState} from "react";
import Header from "@traintran/components/Header/Header";
import {OptionsList} from "@traintran/components/AdditionalOptions/OptionsList";
import {OrderSummary} from "@traintran/components/AdditionalOptions/OrderSummary";
import Footer from "@traintran/components/Footer/Footer";
import {useRouter} from "next/navigation";
import getOptionById, {OptionID, optionsList} from "@traintran/lib/options";

export default function Home() {
    const [selectedOptions, setSelectedOptions] = useState<OptionID[]>([]);
    const router = useRouter();

    const basePrice = 45;
    const totalPrice = basePrice + selectedOptions.map(opt_id => (getOptionById(opt_id)?.price || 0) as number).reduce((sum, opt) => sum + opt, 0);

    const handleOptionChange = (optionId: OptionID) => {
        setSelectedOptions(prev => (prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]));
    };

    const handleContinue = () => {
        console.log("Continue with selected options:", selectedOptions);
        router.push("/panier");
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="max-w-[1024px] mx-auto px-4 py-8">
                    <h1 className="text-2xl font-semibold text-textPrimary mb-6">Options supplémentaires</h1>
                    <div className="flex flex-col md:flex-row gap-8 md:gap-32 justify-between items-start">
                        <div className="w-full md:w-[480px]">
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-borderContainer">
                                <OptionsList options={optionsList} selectedOptions={selectedOptions} onOptionToggle={handleOptionChange} />
                            </div>
                        </div>
                        <div className="w-full md:w-[384px]">
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-borderContainer sticky top-4">
                                <OrderSummary basePrice={basePrice} selectedOptions={selectedOptions} totalPrice={totalPrice} onContinue={handleContinue} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
