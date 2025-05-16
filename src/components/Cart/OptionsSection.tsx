"use client";

import React from "react";
import {Ticket} from "@traintran/context/CartContext";
import {useOptionsList, OptionID} from "@traintran/lib/options";

interface OptionsSectionProps {
    ticket: Ticket;
}

export default function OptionsSection(props: OptionsSectionProps) {
    const {ticket} = props;
    const {options, loading} = useOptionsList();

    // Helper pour trouver une option par son ID
    const findOptionById = (optId: OptionID) => options.find(option => option.id === optId);

    if (loading) {
        return (
            <section className="p-6 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
                <h2 className="mb-4 text-lg text-gray-700">Options sélectionnées</h2>
                <div className="p-4 text-center">Chargement des options...</div>
            </section>
        );
    }

    return (
        <section className="p-6 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="mb-4 text-lg text-gray-700">Options sélectionnées</h2>
            {/* Liste des options du ticket */}
            <div className="flex flex-col gap-3">
                {ticket.options.map((optionId, index) => {
                    // Récupération de l'option complète
                    const option = findOptionById(optionId);
                    if (!option) return null;

                    // Calcul prix total selon passagers et trajet retour
                    const optTotalPrice = option.price * ticket.passengers.length * (ticket.inbound ? 2 : 1);

                    return (
                        // Ligne option avec nom, icône et prix
                        <div className="flex justify-between items-center" key={index}>
                            <div className="flex gap-2 items-center">
                                {option.Icon}
                                <div className="text-base text-gray-700">
                                    {option.name} ({option.price === 0 ? "Gratuit" : option.price + "€"})
                                </div>
                            </div>
                            <div className="text-base text-gray-800">{option.price === 0 ? "Gratuit" : "+" + optTotalPrice + "€"}</div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
