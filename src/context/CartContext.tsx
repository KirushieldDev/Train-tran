import React, { createContext, useContext, useState, ReactNode } from 'react';

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
    orderNumber: string;
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
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider component
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tickets, setTickets] = useState<Ticket[]>([]);

    const addTicket = (ticket: Ticket) => {
        setTickets(prev => [...prev, ticket]);
    };

    const removeTicket = (orderNumber: string) => {
        setTickets(prev => prev.filter(t => t.orderInfo.orderNumber !== orderNumber));
    };

    const clearCart = () => {
        setTickets([]);
    };

    return (
        <CartContext.Provider value={{ tickets, addTicket, removeTicket, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use the cart context
export const useCart = (): CartContextType => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
