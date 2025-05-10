import React from "react";
import {Ticket} from "@traintran/context/CartContext";
import getOptionById from "@traintran/lib/options";

interface OptionsSectionProps {
    ticket: Ticket;
}

export default function OptionsSection(props: OptionsSectionProps) {
    const {ticket} = props;

    return (
        <section className="p-6 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="mb-4 text-lg text-gray-700">Options sélectionnées</h2>
            <div className="flex flex-col gap-3">
                {ticket.options.map((optionId, index) => {
                    const option = getOptionById(optionId);
                    if (!option) return null;
                    const optTotalPrice = option.price * ticket.passengers.length * (ticket.inbound ? 2 : 1);
                    return (
                        <div className="flex justify-between items-center" key={index}>
                            <div className="flex gap-2 items-center">
                                {option.Icon}
                                <div className="text-base text-gray-700">
                                    {option.name} ({option.price}€)
                                </div>
                            </div>
                            <div className="text-base text-gray-800">+ {optTotalPrice} €</div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
