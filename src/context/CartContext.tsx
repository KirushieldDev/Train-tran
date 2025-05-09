"use client";

import React, {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {useAuth} from "./AuthContext";
import getOptionById, {Option, OptionID} from "@traintran/lib/options";
import {TrainTicketPDFProps} from "@traintran/components/Mail/TrainTicketPDF";
import {useRouter} from "next/navigation";

const STORAGE_LOCAL_CART = process.env.NEXT_PUBLIC_STORAGE_LOCAL_CART!;
const STORAGE_SESSION_TOKEN = process.env.NEXT_PUBLIC_STORAGE_SESSION_TOKEN!;

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
    options: Set<OptionID>;
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
    // Helper pour obtenir toutes les pages groupées par ticket
    getAllPages: () => TrainTicketPDFProps[];
    // paiement
    purchaseCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const {user} = useAuth();
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
                obj.options = new Set(obj.options);
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
            options: new Set([OptionID.Quiet, OptionID.Insurance, OptionID.Baggage]),
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
            // convertir Set en array pour le JSON
            const toStore = {
                ...cartTicket,
                outbound: {...cartTicket.outbound},
                return: cartTicket.return ? {...cartTicket.return} : undefined,
            };
            localStorage.setItem(STORAGE_LOCAL_CART, JSON.stringify(toStore));
        } else {
            localStorage.removeItem(STORAGE_LOCAL_CART);
        }
    }, [cartTicket]);

    // wrapper pour ré-instancier Set automatiquement
    const setCartTicket = (ticket: Ticket) => {
        ticket.options = new Set(ticket.options);
        setCartTicketRaw(ticket);
    };

    const clearCart = () => setCartTicketRaw(null);

    const addOption = (optionId: OptionID) => {
        if (!cartTicket) return;
        const opts = new Set(cartTicket.options);
        opts.add(optionId);
        setCartTicketRaw({...cartTicket, options: opts});
    };

    const removeOption = (optionId: OptionID) => {
        if (!cartTicket) return;
        const opts = new Set(cartTicket.options);
        opts.delete(optionId);
        setCartTicketRaw({...cartTicket, options: opts});
    };

    const toggleOption = (optionId: OptionID) => {
        if (!cartTicket) return;
        const opts = new Set(cartTicket.options);
        if (opts.has(optionId)) opts.delete(optionId);
        else opts.add(optionId);
        setCartTicketRaw({...cartTicket, options: opts});
    };

    // Transforme un segment + passager en props PDF en injectant orderer depuis user
    const buildPropsForPassenger = (ticket: Ticket, passenger: Passenger): TrainTicketPDFProps => {
        if (!user) throw new Error("Utilisateur non connecté");
        // on récupère les objets Option à partir des IDs
        const resolvedOptions: Option[] = Array.from(ticket.options)
            .map(id => getOptionById(id))
            .filter((o): o is Option => !!o);

        // Assigne aléatoirement la voiture (1-10) et le siège (1-100)
        const carNumber = (Math.floor(Math.random() * 10) + 1).toString();
        const seatNumber = (Math.floor(Math.random() * 100) + 1).toString();

        return {
            ordererFirstName: user.firstName,
            ordererLastName: user.lastName,
            passengerFirstName: passenger.firstName,
            passengerLastName: passenger.lastName,
            journeySegment: ticket.outbound,
            carNumber,
            seatNumber,
            options: resolvedOptions,
        };
    };

    // Pour chaque ticket, une page par passager et par segment
    const getAllPages = (): TrainTicketPDFProps[] => {
        if (!cartTicket) return [];
        return cartTicket.passengers.flatMap(
            p =>
                [
                    buildPropsForPassenger(cartTicket, p),
                    cartTicket.return ? buildPropsForPassenger({...cartTicket, outbound: cartTicket.return}, p) : undefined,
                ].filter(Boolean) as TrainTicketPDFProps[],
        );
    };

    // Calcule le prix total
    const getTotalPrice = (): number => {
        if (!cartTicket) return 0;
        let total = cartTicket.basePrice * (cartTicket.return ? 2 : 1);
        cartTicket.options.forEach(optId => {
            const opt = getOptionById(optId);
            if (opt) total += opt.price * cartTicket.passengers.length * (cartTicket.return ? 2 : 1);
        });
        return total;
    };

    // Envoie les tickets par mail via l'API
    const purchaseCart = async (): Promise<void> => {
        if (!user || !cartTicket) throw new Error("Pas de ticket en cours");
        const pages = getAllPages();
        // récupère le token de session (pour remember=false) ou laisser le cookie faire son boulot
        const token = sessionStorage.getItem(STORAGE_SESSION_TOKEN);
        const headers: Record<string, string> = {"Content-Type": "application/json"};
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }
        // sinon le cookie httpOnly sera renvoyé automatiquement
        const res = await fetch("/api/send-tickets", {
            method: "POST",
            headers: headers,
            body: JSON.stringify({tickets: pages}),
        });
        if (!res.ok) {
            const {error} = await res.json();
            throw new Error(error || "Échec de l'envoi des billets");
        } else {
            router.push("/confirmation");
        }
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
                getAllPages: getAllPages,
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
