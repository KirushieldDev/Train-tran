"use client";

import React, {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {useAuth} from "./AuthContext";
import getOptionById, {OptionID} from "@traintran/lib/options";
import {useRouter} from "next/navigation";

const STORAGE_LOCAL_CART = process.env.NEXT_PUBLIC_STORAGE_LOCAL_CART!;
const STORAGE_LOCAL_TIMEOUT = process.env.NEXT_PUBLIC_STORAGE_LOCAL_TIMEOUT!;
const STORAGE_LOCAL_REMAINING_TIME = process.env.NEXT_PUBLIC_STORAGE_LOCAL_REMAINING_TIME!;
// Durée initiale du timer en secondes
const INITIAL_TIMEOUT = 300;
// Réduction pour les adhérents (10%)
const ADHERENT_DISCOUNT = 0.1;

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
    carNumber: number | null;
    seatNumber: number | null;
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
    // Réduction adhérent
    getAdherentDiscountPercent: () => number;
    getAdherentDiscountAmount: (basePrice: number) => number;
    // paiement
    purchaseCart: () => Promise<void>;
    downloadPdf: (segment: "outbound" | "inbound") => Promise<void>;
    resendTicket: () => Promise<void>;
}

interface TimeoutContextValue {
    isActive: boolean;
    remainingTime: number;
    startTimeout: () => void;
    stopTimeout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
const TimeoutContext = createContext<TimeoutContextValue | undefined>(undefined);

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

        // Prix de base des billets
        let baseTicketPrice = ticket.basePrice * ticket.passengers.length * trips;

        // Appliquer la réduction pour les adhérents (seulement sur le prix de base des billets)
        if (user) {
            baseTicketPrice = baseTicketPrice * (1 - ADHERENT_DISCOUNT);
        }

        let total = baseTicketPrice + getOptionsPrice(ticket);

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

    // --- Timeout state ---
    const [startTimestamp, setStartTimestamp] = useState<number | null>(() => {
        if (typeof window !== "undefined") {
            const raw = localStorage.getItem(STORAGE_LOCAL_TIMEOUT);
            if (raw) {
                const ts = parseInt(raw, 10);
                if (!isNaN(ts)) return ts;
            }
        }
        return null;
    });

    const [remainingTime, setRemainingTime] = useState<number>(() => {
        if (typeof window !== "undefined") {
            const raw = localStorage.getItem(STORAGE_LOCAL_REMAINING_TIME);
            if (raw) {
                const rt = parseInt(raw, 10);
                if (!isNaN(rt)) return rt;
            }
        }
        return INITIAL_TIMEOUT;
    });

    // Démarrage du timer
    const startTimeout = () => {
        if (typeof window !== "undefined" && startTimestamp === null) {
            const now = Date.now();
            setStartTimestamp(now);
            localStorage.setItem(STORAGE_LOCAL_TIMEOUT, now.toString());
            setRemainingTime(INITIAL_TIMEOUT);
            localStorage.setItem(STORAGE_LOCAL_REMAINING_TIME, INITIAL_TIMEOUT.toString());
        }
    };

    // Arrêt du timer et nettoyage
    const stopTimeout = () => {
        if (typeof window !== "undefined") {
            setStartTimestamp(null);
            localStorage.removeItem(STORAGE_LOCAL_TIMEOUT);
            localStorage.removeItem(STORAGE_LOCAL_REMAINING_TIME);
        }
    };

    // Calcul du temps restant
    useEffect(() => {
        if (startTimestamp !== null) {
            const interval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - startTimestamp) / 1000);
                const newRemainingTime = Math.max(0, INITIAL_TIMEOUT - elapsed);
                setRemainingTime(newRemainingTime);
                if (typeof window !== "undefined") {
                    localStorage.setItem(STORAGE_LOCAL_REMAINING_TIME, newRemainingTime.toString());
                }
                if (newRemainingTime <= 0) {
                    stopTimeout();
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [startTimestamp]);

    const isActive = startTimestamp !== null && remainingTime > 0;

    const resendTicket = async () => {
        if (!user || !cartTicket) throw new Error("Non connecté ou aucun ticket en cours");
        const res = await protectedFetch("/api/cart/resend-ticket", {
            method: "POST",
            body: JSON.stringify({ticket: cartTicket}),
        });
        const data = (await res.json()) as {ok: boolean; error?: string};
        if (!data.ok) {
            throw new Error(data.error || "Échec de l'envoi des billets");
        }
    };

    // Fonction pour obtenir le pourcentage de réduction pour les adhérents
    const getAdherentDiscountPercent = () => {
        return user ? ADHERENT_DISCOUNT * 100 : 0;
    };

    // Fonction pour calculer le montant de la réduction
    const getAdherentDiscountAmount = (basePrice: number) => {
        return user ? basePrice * ADHERENT_DISCOUNT : 0;
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
                getAdherentDiscountPercent,
                getAdherentDiscountAmount,
                purchaseCart,
                downloadPdf,
                resendTicket,
            }}>
            <TimeoutContext.Provider value={{isActive, remainingTime, startTimeout, stopTimeout}}>{children}</TimeoutContext.Provider>
        </CartContext.Provider>
    );
};

export const useCart = (): CartContextType => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart doit être utilisé dans CartProvider");
    return ctx;
};

export const useTimeout = (): TimeoutContextValue => {
    const ctx = useContext(TimeoutContext);
    if (!ctx) throw new Error("useTimeout must be used within CartProvider");
    return ctx;
};
