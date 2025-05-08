"use client";

import React, {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {TrainTicketPDFProps} from "@traintran/components/Mail/TrainTicketPDF";
import getOptionById, {Option, OptionID, optionsList} from "@traintran/lib/options";

export interface JourneySegment {
    departureStation: string;
    arrivalStation: string;
    departureTime: string; // ISO string or any date representation
    arrivalTime: string;
    options: Set<OptionID>;
}

// Types for passenger and order info
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

// Ticket contains an outbound segment and an optional return segment
export interface Ticket {
    outbound: JourneySegment;
    return?: JourneySegment;
    passengers: Passenger[];
    orderInfo: OrderInfo;
}

// Context value interface
export interface CartContextType {
    tickets: Ticket[];
    addTicket: (ticket: Ticket) => void;
    removeTicket: (orderNumber: string) => void;
    clearCart: () => void;
    infoBuyer?: OrderInfo;
    setInfoBuyer: (info: OrderInfo) => void;
    // helper to transform a single ticket into mail props
    buildPropsFromSegment: (segment: JourneySegment, passenger: Passenger, orderInfo: OrderInfo) => TrainTicketPDFProps;
    buildPagesForTicket: (ticket: Ticket) => TrainTicketPDFProps[];
    // helper to transform all tickets in the cart into mail props array
    getAllPagesGroupedByTicket: () => TrainTicketPDFProps[][];
}

// Create context
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

    /**
     * Transform a Ticket into the TrainTicketPDFProps expected by the Mail component.
     * Uses the outbound segment and the first passenger; assigns car and seat randomly.
     */
    const buildPropsFromSegment = (segment: JourneySegment, passenger: Passenger, orderInfo: OrderInfo): TrainTicketPDFProps => {
        const {departureStation, arrivalStation, departureTime, arrivalTime, options} = segment;
        // on récupère les objets Option à partir des IDs
        const resolvedOptions = Array.from(options)
            .map(id => getOptionById(id))
            .filter((opt): opt is Option => !!opt);

        // Extract date portion (YYYY-MM-DD) from ISO string
        const date = departureTime.split("T")[0];

        // Randomly assign car (1-10) and seat (1-100)
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
                buildPropsFromSegment,
                buildPagesForTicket,
                getAllPagesGroupedByTicket,
            }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
};
