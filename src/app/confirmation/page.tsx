"use client";

import Header from "@traintran/components/Header/Header";
import {IconCalendarWeekFilled, IconCheck, IconDownload, IconHelp, IconMail, IconPrinter} from "@tabler/icons-react";
import Button from "@traintran/components/common/Button";
import Footer from "@traintran/components/Footer/Footer";
import {useRequireAuth} from "@traintran/hooks/useRequireAuth";

export default function Home() {
    useRequireAuth();
    const reservationDetails = {
        outboundRef: "RF789456",
        returnRef: "RF789457",
        passengerName: "Tran Louis",
        email: "louis.tran@gmail.com",
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <main className="flex-grow">
                <div className="max-w-[1024px] mx-auto px-4 py-8">
                    <div className="bg-white rounded-lg p-8 shadow-sm border border-borderContainer flex flex-col items-center">
                        {/* Confirmation icon and title */}
                        <div className="flex flex-col items-center mb-8 text-center">
                            <IconCheck className="text-primary rounded-full bg-primary/20 p-1" size="48" />
                            <h1 className="text-2xl font-semibold text-textPrimary mt-4">Réservation confirmée !</h1>
                            <p className="text-textSecondary mt-2">Les détails de votre commande vous ont été envoyés par mail</p>
                        </div>

                        {/* Reservation details */}
                        <div className="mb-8 w-full max-w-[600px]">
                            <h2 className="text-xl font-semibold text-textPrimary mb-4 text-left">Détails réservations</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-background p-4 rounded-lg">
                                <div className="text-center">
                                    <p className="text-sm text-textSecondary mb-1">Aller</p>
                                    <p className="font-medium text-textPrimary">#{reservationDetails.outboundRef}</p>
                                </div>
                                {reservationDetails.returnRef && (
                                    <div className="text-center">
                                        <p className="text-sm text-textSecondary mb-1">Retour</p>
                                        <p className="font-medium text-textPrimary">#{reservationDetails.returnRef}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Passenger information */}
                        <div className="mb-8 w-full max-w-[600px]">
                            <h2 className="text-xl font-semibold text-textPrimary mb-4 text-left">Informations</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-left">
                                    <p className="text-sm text-textSecondary mb-1">Nom - Prénom</p>
                                    <p className="text-sm text-textSecondary mb-1 mt-4">Email</p>
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-textPrimary">{reservationDetails.passengerName}</p>
                                    <p className="font-medium text-textPrimary mt-4">{reservationDetails.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center">
                            <Button variant="primary" className="flex items-center justify-center" icon={<IconPrinter className="text-white" />}>
                                Imprimer le ticket
                            </Button>
                            <Button variant="outline" className="flex items-center justify-center" icon={<IconDownload className="text-textSecondary" />}>
                                Télécharger le PDF
                            </Button>
                        </div>

                        {/* Additional links */}
                        <div className="flex flex-wrap gap-6 text-sm text-primary justify-center">
                            <button className="flex gap-1.5 items-center hover:underline">
                                <IconCalendarWeekFilled className="text-primary" size="20" />
                                Ajouter au calendrier
                            </button>
                            <button className="flex gap-1.5 items-center hover:underline">
                                <IconMail className="text-primary" size="20" />
                                Renvoyer la confirmation
                            </button>
                            <button className="flex gap-1.5 items-center hover:underline">
                                <IconHelp className="text-primary" size="20" />
                                Besoin d'aide ?
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
