"use client";

import {IconCreditCard, IconHelp, IconLock, IconShieldCheck} from "@tabler/icons-react";
import Header from "@traintran/components/Header/Header";
import {OrderSummary} from "@traintran/components/AdditionalOptions/OrderSummary";
import Footer from "@traintran/components/Footer/Footer";
import Button from "@traintran/components/common/Button";
import {useCart} from "@traintran/context/CartContext";
import React, {ChangeEvent, FormEvent, useState} from "react";
import {useOptionsSync} from "@traintran/hooks/useOptionsSync";
import {useRequireAuth} from "@traintran/hooks/useRequireAuth";

export default function Home() {
    useRequireAuth();
    const {purchaseCart} = useCart();
    const {selectedOptions} = useOptionsSync();
    const [cardNumber, setCardNumber] = useState("");
    const [expiry, setExpiry] = useState("");

    const formatCard = (value: string) => {
        const digits = value.replace(/\D/g, "").slice(0, 16);
        return digits.replace(/(.{4})/g, "$1 ").trim();
    };

    const handleCardChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCardNumber(formatCard(e.target.value));
    };

    const handleExpiryChange = (e: ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, "").slice(0, 4);
        if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
        setExpiry(val);
    };

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        await purchaseCart();
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-grow max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="md:col-span-7 bg-white p-6 rounded-lg shadow-sm">
                        <h1 className="text-xl font-semibold text-gray-900 mb-1">Paiement sécurisé</h1>
                        <p className="text-sm text-gray-600 mb-5">Veuillez saisir vos informations de paiement</p>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="cardNumber" className="text-sm font-medium text-gray-700 mb-1">
                                    Numéro de carte
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardNumber}
                                        onChange={handleCardChange}
                                        maxLength={19}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                        <IconCreditCard className="text-textSecondary" size="16" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label htmlFor="expiryDate" className="text-sm font-medium text-gray-700 mb-1">
                                        Date d&apos;expiration
                                    </label>
                                    <input
                                        type="text"
                                        id="expiryDate"
                                        placeholder="mm/aa"
                                        value={expiry}
                                        onChange={handleExpiryChange}
                                        maxLength={5}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cvv" className="text-sm font-medium text-gray-700 mb-1">
                                        CVV
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            id="cvv"
                                            placeholder="123"
                                            maxLength={3}
                                            pattern="[0-9]{3}"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <IconHelp className="text-textSecondary" size="16" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="cardName" className="text-sm font-medium text-gray-700 mb-1">
                                    Nom sur la carte
                                </label>
                                <input
                                    type="text"
                                    id="cardName"
                                    placeholder="John Doe"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700"
                                />
                            </div>

                            <Button type="submit" variant="primary" size="lg" fullWidth icon={<IconLock className="text-white" size="18" />}>
                                Payer maintenant
                            </Button>
                        </form>
                    </div>

                    <div className="md:col-span-5">
                        <div className="flex flex-col items-center md:items-start">
                            <div className="w-96">
                                <div className="bg-white rounded-lg p-6 shadow-sm">
                                    <OrderSummary selectedOptions={selectedOptions} showButton={false} />

                                    <div className="mt-4 pt-4 flex gap-2 items-center justify-center border-t border-gray-200">
                                        <IconShieldCheck className="text-primary" size="20" />
                                        <span className="text-[#059669] text-sm">Paiement sécurisé par cryptage SSL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
