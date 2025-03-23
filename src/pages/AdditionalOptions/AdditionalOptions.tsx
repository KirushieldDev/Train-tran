import React, { useState } from 'react';
import { OptionsList } from '../../components/AdditionalOptions/OptionsList';
import { OrderSummary } from '../../components/AdditionalOptions/OrderSummary';
import { Option } from '../../components/AdditionalOptions/types';
import QuietSVG from '../../assets/AdditionalOptions/QuietSVG';
import PowerSVG from '../../assets/AdditionalOptions/PowerSVG';
import BaggageSVG from '../../assets/AdditionalOptions/BaggageSVG';
import SmsSVG from '../../assets/AdditionalOptions/SmsSVG';
import InsuranceSVG from '../../assets/AdditionalOptions/InsuranceSVG';
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

export const AdditionalOptions: React.FC = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const options: Option[] = [
        {
            id: 'quiet',
            name: 'Place tranquille',
            description: 'Voyagez dans une zone calme et silencieuse',
            price: 5,
            Icon: QuietSVG
        },
        {
            id: 'power',
            name: 'Prise électrique',
            description: 'Accès garanti à une prise électrique',
            price: 3,
            Icon: PowerSVG
        },
        {
            id: 'baggage',
            name: 'Bagage supplémentaire',
            description: 'Ajoutez un bagage supplémentaire à votre voyage',
            price: 15,
            Icon: BaggageSVG
        },
        {
            id: 'sms',
            name: 'Information par SMS',
            description: 'Recevez des notifications sur votre trajet',
            price: 0,
            Icon: SmsSVG
        },
        {
            id: 'insurance',
            name: 'Garantie annulation',
            description: "Protection en cas d'annulation ou de perturbation",
            price: 10,
            Icon: InsuranceSVG
        }
    ];

    const basePrice = 45;
    const totalPrice = basePrice + options
        .filter(opt => selectedOptions.includes(opt.id))
        .reduce((sum, opt) => sum + opt.price, 0);

    const handleOptionChange = (optionId: string) => {
        setSelectedOptions(prev =>
            prev.includes(optionId)
                ? prev.filter(id => id !== optionId)
                : [...prev, optionId]
        );
    };

    const handleContinue = () => {
        console.log('Continue with selected options:', selectedOptions);
    };

    const selectedOptionDetails = options
        .filter(opt => selectedOptions.includes(opt.id));

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="max-w-[1024px] mx-auto px-4 py-8">
                    <h1 className="text-2xl font-semibold text-textPrimary mb-6">Options supplémentaires</h1>
                    <div className="flex flex-col md:flex-row gap-8 md:gap-32 justify-between items-start">
                        <div className="w-full md:w-[480px]">
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-borderContainer">
                                <OptionsList
                                    options={options}
                                    selectedOptions={selectedOptions}
                                    onOptionToggle={handleOptionChange}
                                />
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
};
