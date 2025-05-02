"use client"

import React, {createContext, useContext, useState, ReactNode, useRef, useEffect} from "react";
import { TrainTicketProps } from "@traintran/components/Mail/TrainTicket";

// Types for journey segments (aller / retour)
export interface Option {
    name: string;
    price: number;
}

export interface JourneySegment {
    departureStation: string;
    arrivalStation: string;
    departureTime: string; // ISO string or any date representation
    arrivalTime: string;
    options: Option[];
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
    getTicketAsProps: (ticket: Ticket) => TrainTicketProps;
    // helper to transform all tickets in the cart into mail props array
    getAllTicketsAsProps: () => TrainTicketProps[];
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
                options: [{ name: "Standard", price: 79 }],
            },
            // optional return segment
            return: {
                departureStation: "Lyon",
                arrivalStation: "Paris",
                departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // next day
                arrivalTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // +2h after return depart
                options: [{ name: "Standard", price: 79 }],
            },
            passengers: [
                { firstName: "Test", lastName: "User" }
            ],
            orderInfo: {
                orderNumber: "TEST-0001",
                ordererFirstName: "Test",
                ordererLastName: "User",
                ordererEmail: "tellealexis@gmail.com",
            },
        };
        addTicket(testTicket);
        setInfoBuyer(testTicket.orderInfo);
    }, []);

    const addTicket = (ticket: Ticket) => {
        setTickets((prev) => [...prev, ticket]);
    };

    const removeTicket = (orderNumber: string) => {
        setTickets((prev) => prev.filter((t) => t.orderInfo.orderNumber !== orderNumber));
    };

    const clearCart = () => {
        setTickets([]);
    };

    /**
     * Transform a Ticket into the TrainTicketProps expected by the Mail component.
     * Uses the outbound segment and the first passenger; assigns car and seat randomly.
     */
    const getTicketAsProps = (ticket: Ticket): TrainTicketProps => {
        const { departureStation, arrivalStation, departureTime, arrivalTime } = ticket.outbound;

        // Extract date portion (YYYY-MM-DD) from ISO string
        const date = departureTime.split("T")[0];

        // For simplicity, handle only the first passenger per ticket
        const passenger = ticket.passengers[0];

        // Randomly assign car (1-10) and seat (1-100)
        const carNumber = (Math.floor(Math.random() * 10) + 1).toString();
        const seatNumber = (Math.floor(Math.random() * 100) + 1).toString();

        return {
            departureStation,
            arrivalStation,
            departureTime,
            arrivalTime,
            date,
            firstName: passenger.firstName,
            lastName: passenger.lastName,
            carNumber,
            seatNumber,
        };
    };

    /**
     * Transform all tickets in the cart into an array of TrainTicketProps
     */
    const getAllTicketsAsProps = (): TrainTicketProps[] => {
        return ticketsRef.current.map(getTicketAsProps);
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
                getTicketAsProps,
                getAllTicketsAsProps,
            }}
        >
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
