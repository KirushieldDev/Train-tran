import React from "react";
import QRCode from "react-qr-code";

export interface TrainTicketProps {
    departureStation: string;
    arrivalStation: string;
    departureTime: string;
    arrivalTime: string;
    date: string;
    firstName: string;
    lastName: string;
    carNumber: string;
    seatNumber: string;
}

/**
 * TrainTicket
 * Composant représentant un billet de train réaliste et agrandi,
 * avec QR Code, numéro de voiture et de place.
 */
export const TrainTicket: React.FC<TrainTicketProps> = ({
    departureStation,
    arrivalStation,
    departureTime,
    arrivalTime,
    date,
    firstName,
    lastName,
    carNumber,
    seatNumber,
}) => {
    // Génération de la valeur QR à partir des données du billet
    const qrValue = JSON.stringify({
        departureStation,
        arrivalStation,
        departureTime,
        arrivalTime,
        date,
        firstName,
        lastName,
        carNumber,
        seatNumber,
    });

    return (
        <div className="inline-flex bg-white shadow-2xl rounded-3xl overflow-hidden">
            {/* Partie principale du billet */}
            <div className="flex-1 p-8 space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Billet de Train</h2>
                    <p className="text-sm text-gray-500">{new Date().toLocaleDateString("fr-FR")}</p>
                </div>

                <div className="flex items-center justify-between whitespace-nowrap">
                    {/* Gare de départ */}
                    <div className="text-center">
                        <p className="text-3xl md:text-4xl font-extrabold">{departureStation}</p>
                        <p className="text-base md:text-lg text-gray-600 mt-1">Départ à {departureTime}</p>
                    </div>

                    <div className="border-dashed border-r-2 border-gray-300 h-24 mx-6" />

                    {/* Gare d'arrivée */}
                    <div className="text-center">
                        <p className="text-3xl md:text-4xl font-extrabold">{arrivalStation}</p>
                        <p className="text-base md:text-lg text-gray-600 mt-1">Arrivée à {arrivalTime}</p>
                    </div>
                </div>

                <div className="flex justify-between text-lg text-gray-700">
                    <span>Nom : {lastName}</span>
                    <span>Prénom : {firstName}</span>
                </div>

                <div className="flex justify-between text-lg text-gray-700">
                    <span>Voiture : {carNumber}</span>
                    <span>Place : {seatNumber}</span>
                </div>

                <div className="border-t border-gray-200 pt-6 text-center text-lg text-gray-500">Bon voyage !</div>
            </div>

            {/* Encart détachable avec QR Code */}
            <div className="w-48 bg-gray-100 flex flex-col items-center justify-around relative p-4">
                <div className="absolute inset-y-0 left-0 w-2 bg-white rounded-l-full" />
                <p className="text-sm font-semibold rotate-90 -mt-6">COUPON</p>
                <QRCode value={qrValue} size={96} />
            </div>
        </div>
    );
};

export default TrainTicket;
