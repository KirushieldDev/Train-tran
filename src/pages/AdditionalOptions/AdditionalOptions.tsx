import React, { useState } from 'react';

interface Option {
    id: string;
    name: string;
    description: string;
    price: number;
}

export const AdditionalOptions: React.FC = () => {
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const options: Option[] = [
        {
            id: 'quiet',
            name: 'Place tranquille',
            description: 'Voyagez dans une zone calme et silencieuse',
            price: 5
        },
        {
            id: 'power',
            name: 'Prise électrique',
            description: 'Accès garanti à une prise électrique',
            price: 3
        },
        {
            id: 'baggage',
            name: 'Bagage supplémentaire',
            description: 'Ajoutez un bagage supplémentaire à votre voyage',
            price: 15
        },
        {
            id: 'sms',
            name: 'Information par SMS',
            description: 'Recevez des notifications sur votre trajet',
            price: 0
        },
        {
            id: 'insurance',
            name: 'Garantie annulation',
            description: "Protection en cas d'annulation ou de perturbation",
            price: 10
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

    return (
        <div className="max-w-[1024px] mx-auto px-4 py-8">
            <div className="flex gap-32 justify-center items-start">
                {/* Options section */}
                <div className="w-[480px]">
                    <h1 className="text-2xl font-bold mb-8">Options supplémentaires</h1>
                    <div className="space-y-4">
                        {options.map((option) => (
                            <div key={option.id} className="border border-borderContainer rounded-lg p-4">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedOptions.includes(option.id)}
                                        onChange={() => handleOptionChange(option.id)}
                                        className="mt-1"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <span className="font-medium text-textPrimary">{option.name}</span>
                                            <span className="text-right text-primary">
                                                {option.price === 0 ? 'Gratuit' : `+${option.price}€`}
                                            </span>
                                        </div>
                                        <p className="text-textSecondary text-sm">{option.description}</p>
                                    </div>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary section */}
                <div className="w-96">
                    <div className="bg-background rounded-lg p-6 sticky top-4">
                        <h2 className="font-semibold text-lg mb-4 text-textPrimary">Récapitulatif</h2>
                        <div className="space-y-2">
                            <div className="flex justify-between text-textPrimary">
                                <span>Billet de base</span>
                                <span>{basePrice}€</span>
                            </div>
                            {selectedOptions.map(optionId => {
                                const option = options.find(opt => opt.id === optionId);
                                if (!option) return null;
                                return (
                                    <div key={option.id} className="flex justify-between text-primary">
                                        <span>{option.name}</span>
                                        <span>{option.price === 0 ? 'Gratuit' : `+${option.price}€`}</span>
                                    </div>
                                );
                            })}
                            <div className="border-t border-borderContainer pt-2 mt-4">
                                <div className="flex justify-between font-semibold text-textPrimary">
                                    <span>Total</span>
                                    <span>{totalPrice}€</span>
                                </div>
                            </div>
                        </div>
                        <button
                            className="w-full bg-primary text-white rounded-lg py-3 mt-6 hover:bg-primary/90 transition-colors"
                        >
                            Continuer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
