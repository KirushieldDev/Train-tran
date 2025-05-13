"use client";

import React, {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {useAuth} from "./AuthContext";
import getOptionById, {OptionID} from "@traintran/lib/options";
import {useRouter} from "next/navigation";

const STORAGE_LOCAL_CART = process.env.NEXT_PUBLIC_STORAGE_LOCAL_CART!;

/** Segment d’un trajet */
export interface JourneySegment {
    departureStation: string;
    arrivalStation: string;
    departureTime: string; // String de la date au format ISO
    arrivalTime: string; // ISO
}

/** Un passager */
export interface Passenger {
    firstName: string;
    lastName: string;
    age: number;
}

/** Un ticket complet (aller + éventuel retour) */
export interface Ticket {
    outbound: JourneySegment;
    inbound?: JourneySegment;
    passengers: Passenger[];
    options: OptionID[];
    basePrice: number;
    totalPrice: number;
}

interface CartContextType {
    /** Le ticket en cours (panier) */
    cartTicket: Ticket | null;
    setCartTicket: (ticket: Ticket) => void;
    clearCart: () => void;
    loadingCart: boolean;
    // passagers
    addPassenger: (p: Passenger) => void;
    updatePassenger: (index: number, p: Passenger) => void;
    removePassenger: (index: number) => void;
    setAllPassengers: (passengers: Passenger[]) => void;
    // options
    addOption: (optionId: OptionID) => void;
    removeOption: (optionId: OptionID) => void;
    toggleOption: (optionId: OptionID) => void;
    // Calcul du prix d'un ticket
    getOptionsPrice: (ticket: Ticket) => number;
    getTotalPrice: (ticket: Ticket) => number;
    // paiement
    purchaseCart: () => Promise<void>;
    downloadPdf: (segment: "outbound" | "inbound") => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const {user, protectedFetch} = useAuth();
    const router = useRouter();
    const [cartTicket, setCartTicketRaw] = useState<Ticket | null>(null);
    const [loadingCart, setLoadingCart] = useState(true);
    const initialized = useRef(false);

    // Hydrater depuis localStorage
    useEffect(() => {
        if (initialized.current) return;
        const raw = localStorage.getItem(STORAGE_LOCAL_CART);
        if (raw) {
            try {
                // Ré-instancier les Set pour options
                const obj = JSON.parse(raw) as Ticket;
                setCartTicketRaw(obj);
            } catch {}
        }

        // const testTicket: Ticket = {
        //     outbound: {
        //         departureStation: "Paris Est",
        //         arrivalStation: "Strasbourg",
        //         departureTime: new Date().toISOString(),
        //         arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2h
        //     },
        //     // optional return segment
        //     inbound: {
        //         departureStation: "Strasbourg",
        //         arrivalStation: "Paris Est",
        //         departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // next day
        //         arrivalTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // +2h after return depart
        //     },
        //     passengers: [
        //         {firstName: "Pierre", lastName: "Dupont", age: 45},
        //         {firstName: "Marie", lastName: "Dupont", age: 56},
        //     ],
        //     options: [OptionID.Quiet, OptionID.Insurance, OptionID.Baggage],
        //     basePrice: 120,
        //     totalPrice: 0,
        // };
        // setCartTicket(testTicket);

        initialized.current = true;
        setLoadingCart(false);
    }, []);

    // Persistance dans localStorage
    useEffect(() => {
        if (!initialized.current) return;
        if (cartTicket) {
            localStorage.setItem(STORAGE_LOCAL_CART, JSON.stringify({...cartTicket}));
        } else {
            localStorage.removeItem(STORAGE_LOCAL_CART);
        }
    }, [cartTicket]);

    const setCartTicket = (ticket: Ticket) => {
        // supprimer les doublons dans options[]
        const uniqueOpts = Array.from(new Set(ticket.options));
        setCartTicketRaw({...ticket, options: uniqueOpts, totalPrice: getTotalPrice(ticket)});
    };

    const clearCart = () => setCartTicketRaw(null);

    const addPassenger = (p: Passenger) => {
        if (!cartTicket) return;
        setCartTicket({
            ...cartTicket,
            passengers: [...cartTicket.passengers, p],
        });
    };

    const updatePassenger = (index: number, p: Passenger) => {
        if (!cartTicket || index < 0) return;
        const newPassengers = [...cartTicket.passengers];
        if (index > newPassengers.length) addPassenger(p);
        else newPassengers[index] = p;
        setCartTicket({
            ...cartTicket,
            passengers: newPassengers,
        });
    };

    const removePassenger = (index: number) => {
        if (!cartTicket) return;
        const newPassengers = cartTicket.passengers.filter((_, i) => i !== index);
        setCartTicket({
            ...cartTicket,
            passengers: newPassengers,
        });
    };

    const setAllPassengers = (passengers: Passenger[]) => {
        if (!cartTicket) return;
        setCartTicket({...cartTicket, passengers});
    };

    const addOption = (optionId: OptionID) => {
        if (!cartTicket) return;
        if (!cartTicket.options.includes(optionId)) {
            setCartTicket({...cartTicket, options: [...cartTicket.options, optionId]});
        }
    };

    const removeOption = (optionId: OptionID) => {
        if (!cartTicket) return;
        setCartTicket({...cartTicket, options: cartTicket.options.filter(o => o !== optionId)});
    };

    const toggleOption = (optionId: OptionID) => {
        if (!cartTicket) return;
        const has = cartTicket.options.includes(optionId);
        setCartTicket({...cartTicket, options: has ? cartTicket.options.filter(o => o !== optionId) : [...cartTicket.options, optionId]});
    };

    const getOptionsPrice = (ticket: Ticket) => {
        let total: number = 0;
        const trips = ticket.inbound ? 2 : 1;
        ticket.options.forEach(optId => {
            const opt = getOptionById(optId);
            if (opt) total += opt.price * ticket.passengers.length * trips;
        });
        return total;
    };

    // Calcule le prix total
    const getTotalPrice = (ticket: Ticket): number => {
        if (!ticket) return 0;
        const trips = ticket.inbound ? 2 : 1;
        let total = ticket.basePrice * ticket.passengers.length * trips;
        total += getOptionsPrice(ticket);
        return total;
    };

    // Envoie les tickets par mail via l'API
    const purchaseCart = async (): Promise<void> => {
        if (!user || !cartTicket) throw new Error("Non connecté ou aucun ticket en cours");
        const res = await protectedFetch("/api/cart/purchase", {
            method: "POST",
            body: JSON.stringify({ticket: cartTicket}),
        });
        const data = (await res.json()) as {ok: boolean; error?: string};
        if (!data.ok) {
            throw new Error(data.error || "Échec de l'envoi des billets");
        }
        router.push("/confirmation");
    };

    const downloadPdf = async (segment: "outbound" | "inbound"): Promise<void> => {
        if (!cartTicket) throw new Error("Aucun ticket en cours");
        const segLabel = segment === "outbound" ? "aller" : "retour";
        const filename = `${cartTicket.outbound.departureStation}-${cartTicket.outbound.arrivalStation}-${segLabel}.pdf`;

        const res = await protectedFetch("/api/cart/ticket", {
            method: "POST",
            body: JSON.stringify({ticket: cartTicket, segment}),
        });
        if (!res.ok) throw new Error("Impossible de charger le PDF");

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <CartContext.Provider
            value={{
                cartTicket,
                setCartTicket,
                clearCart,
                loadingCart,
                addPassenger,
                updatePassenger,
                removePassenger,
                setAllPassengers,
                addOption,
                removeOption,
                toggleOption,
                getOptionsPrice,
                getTotalPrice,
                purchaseCart,
                downloadPdf,
            }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart doit être utilisé dans CartProvider");
    return ctx;
};
