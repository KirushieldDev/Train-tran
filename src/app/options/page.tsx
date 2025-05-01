"use client";

import {useState} from "react";
import {Option} from "@traintran/components/AdditionalOptions/types";
import {IconLuggage, IconMessagePause, IconPlug, IconShieldDollar, IconVolume3} from "@tabler/icons-react";
import Header from "@traintran/components/Header/Header";
import {OptionsList} from "@traintran/components/AdditionalOptions/OptionsList";
import {OrderSummary} from "@traintran/components/AdditionalOptions/OrderSummary";
import Footer from "@traintran/components/Footer/Footer";
import {useRouter} from "next/navigation";

export default function Home() {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const router = useRouter();

    const options: Option[] = [
        {
            id: "quiet",
            name: "Place tranquille",
            description: "Voyagez dans une zone calme et silencieuse",
            price: 5,
            Icon: <IconVolume3 className="text-textSecondary" size="16" />,
        },
        {
            id: "power",
            name: "Prise électrique",
            description: "Accès garanti à une prise électrique",
            price: 3,
            Icon: <IconPlug className="text-textSecondary" size="16" />,
        },
        {
            id: "baggage",
            name: "Bagage supplémentaire",
            description: "Ajoutez un bagage supplémentaire à votre voyage",
            price: 15,
            Icon: <IconLuggage className="text-textSecondary" size="16" />,
        },
        {
            id: "sms",
            name: "Information par SMS",
            description: "Recevez des notifications sur votre trajet",
            price: 0,
            Icon: <IconMessagePause className="text-textSecondary" size="16" />,
        },
        {
            id: "insurance",
            name: "Garantie annulation",
            description: "Protection en cas d'annulation ou de perturbation",
            price: 10,
            Icon: <IconShieldDollar className="text-textSecondary" size="16" />,
        },
    ];

    const basePrice = 45;
    const totalPrice = basePrice + options.filter(opt => selectedOptions.includes(opt.id)).reduce((sum, opt) => sum + opt.price, 0);

    const handleOptionChange = (optionId: string) => {
        setSelectedOptions(prev => (prev.includes(optionId) ? prev.filter(id => id !== optionId) : [...prev, optionId]));
    };

    const handleContinue = () => {
        console.log("Continue with selected options:", selectedOptions);
        router.push("/panier");
    };

    const selectedOptionDetails = options.filter(opt => selectedOptions.includes(opt.id));

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="max-w-[1024px] mx-auto px-4 py-8">
                    <h1 className="text-2xl font-semibold text-textPrimary mb-6">Options supplémentaires</h1>
                    <div className="flex flex-col md:flex-row gap-8 md:gap-32 justify-between items-start">
                        <div className="w-full md:w-[480px]">
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-borderContainer">
                                <OptionsList options={options} selectedOptions={selectedOptions} onOptionToggle={handleOptionChange} />
                            </div>
                        </div>
                        <div className="w-full md:w-[384px]">
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-borderContainer sticky top-4">
                                <OrderSummary
                                    basePrice={basePrice}
                                    selectedOptions={selectedOptionDetails}
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
