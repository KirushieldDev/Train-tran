"use client";

import React, {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {TrainTicketPDFProps} from "@traintran/components/Mail/TrainTicketPDF";
import getOptionById, {Option, OptionID} from "@traintran/lib/options";

export interface JourneySegment {
    departureStation: string;
    arrivalStation: string;
    departureTime: string; // String de la date au format ISO
    arrivalTime: string;
    options: Set<OptionID>;
}

// Types pour le passager et les informations de commande
export interface Passenger {
    firstName: string;
    lastName: string;
}

export interface OrderInfo {
    orderNumber?: string;
    ordererFirstName: string;
    ordererLastName: string;
    ordererEmail: string;
}

// Le ticket contient un segment aller et un segment retour optionnel
export interface Ticket {
    outbound: JourneySegment;
    return?: JourneySegment;
    passengers: Passenger[];
    orderInfo: OrderInfo;
    basePrice: number;
}

// Valeurs du contexte
export interface CartContextType {
    tickets: Ticket[];
    addTicket: (ticket: Ticket) => void;
    removeTicket: (orderNumber: string) => void;
    clearCart: () => void;
    infoBuyer?: OrderInfo;
    setInfoBuyer: (info: OrderInfo) => void;
    toggleOptionForAllTickets: (optionId: OptionID, add: boolean) => void;
    // Helper pour transformer un ticket en props pour le PDF
    buildPropsFromSegment: (segment: JourneySegment, passenger: Passenger, orderInfo: OrderInfo) => TrainTicketPDFProps;
    buildPagesForTicket: (ticket: Ticket) => TrainTicketPDFProps[];
    // Helper pour obtenir toutes les pages groupées par ticket
    getAllPagesGroupedByTicket: () => TrainTicketPDFProps[][];
}

// Création context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [infoBuyer, setInfoBuyer] = useState<OrderInfo>();
    const ticketsRef = useRef(tickets);

    useEffect(() => {
        ticketsRef.current = tickets;
    }, [tickets]);

    useEffect(() => {
        const testTicket: Ticket = {
            outbound: {
                departureStation: "Paris",
                arrivalStation: "Lyon",
                departureTime: new Date().toISOString(),
                arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2h
                options: new Set([OptionID.Quiet, OptionID.Sms, OptionID.Insurance, OptionID.Baggage]),
            },
            // optional return segment
            return: {
                departureStation: "Lyon",
                arrivalStation: "Paris",
                departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // next day
                arrivalTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // +2h after return depart
                options: new Set([OptionID.Sms]),
            },
            passengers: [
                {firstName: "Pierre", lastName: "Dupont"},
                {firstName: "Marie", lastName: "Dupont"},
            ],
            orderInfo: {
                orderNumber: "TEST-0001",
                ordererFirstName: "Pierre",
                ordererLastName: "Dupont",
                ordererEmail: "julien.synaeve@gmail.com",
            },
            basePrice: 120,
        };
        addTicket(testTicket);
        setInfoBuyer(testTicket.orderInfo);
    }, []);

    const addTicket = (ticket: Ticket) => {
        setTickets(prev => [...prev, ticket]);
    };

    const removeTicket = (orderNumber: string) => {
        setTickets(prev => prev.filter(t => t.orderInfo.orderNumber !== orderNumber));
    };

    const clearCart = () => {
        setTickets([]);
    };

    const toggleOptionForAllTickets = (optionId: OptionID, add: boolean) => {
        setTickets(prev => prev.map(ticket => {
            const updateSeg = (seg: JourneySegment) => {
                const has = seg.options.has(optionId);
                const newSet = new Set(seg.options);
                if (add && !has) newSet.add(optionId);
                if (!add && has) newSet.delete(optionId);
                return { ...seg, options: newSet };
            };
            return {
                ...ticket,
                outbound: updateSeg(ticket.outbound),
                return: ticket.return ? updateSeg(ticket.return) : undefined
            };
        }));
    };


    /**
     * Transforme un ticket en props pour le composent mail.
     * Utilise le segment aller et le premier passager; assigne aléatoirement la voiture et le siège.
     */
    const buildPropsFromSegment = (segment: JourneySegment, passenger: Passenger, orderInfo: OrderInfo): TrainTicketPDFProps => {
        const {departureStation, arrivalStation, departureTime, arrivalTime, options} = segment;
        // on récupère les objets Option à partir des IDs
        const resolvedOptions = Array.from(options)
            .map(id => getOptionById(id))
            .filter((opt): opt is Option => !!opt);

        // Extraction de la date au format YYYY-MM-DD
        const date = departureTime.split("T")[0];

        // Assigne aléatoirement la voiture (1-10) et le siège (1-100)
        const carNumber = (Math.floor(Math.random() * 10) + 1).toString();
        const seatNumber = (Math.floor(Math.random() * 100) + 1).toString();

        return {
            ordererFirstName: orderInfo.ordererFirstName,
            ordererLastName: orderInfo.ordererLastName,
            passengerFirstName: passenger.firstName,
            passengerLastName: passenger.lastName,
            departureStation,
            arrivalStation,
            departureTime,
            arrivalTime,
            date,
            carNumber,
            seatNumber,
            options: resolvedOptions,
        };
    };

    /**
     * 1 ticket → X pages (passagers × segments)
     */
    const buildPagesForTicket = (ticket: Ticket): TrainTicketPDFProps[] => {
        const {outbound, return: retour, passengers, orderInfo} = ticket;

        return passengers.flatMap(passenger => {
            // page aller
            const pages = [buildPropsFromSegment(outbound, passenger, orderInfo)];
            // page retour si présente
            if (retour) {
                pages.push(buildPropsFromSegment(retour, passenger, orderInfo));
            }
            return pages;
        });
    };

    const getAllPagesGroupedByTicket = (): TrainTicketPDFProps[][] => {
        return ticketsRef.current.map(buildPagesForTicket);
    };

    return (
        <CartContext.Provider
            value={{
                tickets,
                addTicket,
                removeTicket,
                clearCart,
                infoBuyer,
                setInfoBuyer,
                toggleOptionForAllTickets,
                buildPropsFromSegment,
                buildPagesForTicket,
                getAllPagesGroupedByTicket,
            }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook pour utiliser le contexte
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
