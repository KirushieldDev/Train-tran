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
    return?: JourneySegment;
    passengers: Passenger[];
    options: OptionID[];
    basePrice: number;
}

interface CartContextType {
    /** Le ticket en cours (panier) */
    cartTicket: Ticket | null;
    setCartTicket: (ticket: Ticket) => void;
    clearCart: () => void;
    loadingCart: boolean;
    // options
    addOption: (optionId: OptionID) => void;
    removeOption: (optionId: OptionID) => void;
    toggleOption: (optionId: OptionID) => void;
    // Calcul du prix total
    getTotalPrice: () => number;
    // paiement
    purchaseCart: () => Promise<void>;
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

        const testTicket: Ticket = {
            outbound: {
                departureStation: "Paris",
                arrivalStation: "Lyon",
                departureTime: new Date().toISOString(),
                arrivalTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // +2h
            },
            // optional return segment
            return: {
                departureStation: "Lyon",
                arrivalStation: "Paris",
                departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // next day
                arrivalTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(), // +2h after return depart
            },
            passengers: [
                {firstName: "Pierre", lastName: "Dupont", age: 45},
                {firstName: "Marie", lastName: "Dupont", age: 56},
            ],
            options: [OptionID.Quiet, OptionID.Insurance, OptionID.Baggage],
            basePrice: 120,
        };
        setCartTicket(testTicket);

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
        setCartTicketRaw({...ticket, options: uniqueOpts});
    };

    const clearCart = () => setCartTicketRaw(null);

    const addOption = (optionId: OptionID) => {
        if (!cartTicket) return;
        if (!cartTicket.options.includes(optionId)) {
            setCartTicketRaw({...cartTicket, options: [...cartTicket.options, optionId]});
        }
    };

    const removeOption = (optionId: OptionID) => {
        if (!cartTicket) return;
        setCartTicketRaw({...cartTicket, options: cartTicket.options.filter(o => o !== optionId)});
    };

    const toggleOption = (optionId: OptionID) => {
        if (!cartTicket) return;
        const has = cartTicket.options.includes(optionId);
        setCartTicketRaw({...cartTicket, options: has ? cartTicket.options.filter(o => o !== optionId) : [...cartTicket.options, optionId]});
    };

    // Calcule le prix total
    const getTotalPrice = (): number => {
        if (!cartTicket) return 0;
        const trips = cartTicket.return ? 2 : 1;
        let total = cartTicket.basePrice * trips;
        cartTicket.options.forEach(optId => {
            const opt = getOptionById(optId);
            if (opt) total += opt.price * cartTicket.passengers.length * trips;
        });
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

    return (
        <CartContext.Provider
            value={{
                cartTicket,
                setCartTicket,
                clearCart,
                loadingCart,
                addOption,
                removeOption,
                toggleOption,
                getTotalPrice,
                purchaseCart,
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
