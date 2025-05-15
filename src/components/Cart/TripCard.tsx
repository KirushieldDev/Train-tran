import React from "react";
import {IconArrowRight} from "@tabler/icons-react";
import {JourneySegment, Ticket} from "@traintran/context/CartContext";
import {formattedDate, formattedTime} from "@traintran/utils/travel";

interface TripCardProps {
    ticket: Ticket;
    segment: "outbound" | "inbound";
}

export default function TripCard(props: TripCardProps) {
    const {ticket, segment} = props;

    // Détermination du segment (aller ou retour) et récupération du trajet associé
    let segLabel: string;
    let journey: JourneySegment;
    if (segment === "inbound" && ticket.inbound) {
        segLabel = "retour";
        journey = ticket.inbound;
    } else {
        segLabel = "aller";
        journey = ticket.outbound;
    }

    return (
        <article className="p-6 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            {/* Titre affichant le segment, destination et date */}
            <h2 className="mb-4 text-lg text-gray-700">
                Trajet {segLabel} vers {journey.arrivalStation} le {formattedDate(journey.departureTime)}
            </h2>

            {/* Affichage des stations, heures et prix total */}
            <div className="flex justify-between items-start max-sm:flex-col max-sm:gap-4">
                <div className="flex gap-4 items-center">
                    {/* Départ avec heure */}
                    <div className="flex flex-col gap-1">
                        <div className="text-base text-gray-800">{journey.departureStation}</div>
                        <time className="text-sm text-gray-500">{formattedTime(journey.departureTime)}</time>
                    </div>

                    {/* Flèche indiquant le sens du trajet */}
                    <IconArrowRight className="text-primary" size="20" />

                    {/* Arrivée avec heure */}
                    <div className="flex flex-col gap-1">
                        <div className="text-base text-gray-800">{journey.arrivalStation}</div>
                        <time className="text-sm text-gray-500">{formattedTime(journey.arrivalTime)}</time>
                    </div>
                </div>

                {/* Prix total et nombre de passagers */}
                <div className="text-right max-sm:mt-3">
                    <div className="text-base text-gray-800">{ticket.basePrice * ticket.passengers.length} €</div>
                    <div className="text-sm text-gray-500">
                        {ticket.passengers.length} {ticket.passengers.length === 1 ? "passager" : "passagers"}
                    </div>
                </div>
            </div>
        </article>
    );
}
