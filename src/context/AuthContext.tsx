"use client";

import React, {createContext, ReactNode, useContext, useEffect, useState} from "react";
import {useRouter} from "next/navigation";

const STORAGE_COOKIE_AUTH = process.env.NEXT_PUBLIC_STORAGE_COOKIE_AUTH!;
const STORAGE_LOCAL_CART = process.env.NEXT_PUBLIC_STORAGE_LOCAL_CART!;
const STORAGE_SESSION_TOKEN = process.env.NEXT_PUBLIC_STORAGE_SESSION_TOKEN!;

// Types représentant les informations utilisateur
export type UserGender = "M" | "Mme";

export interface UserInfo {
    sub: string;
    firstName: string;
    lastName: string;
    gender: UserGender;
    mobile: string;
    email: string;
}

// Shape du contexte d'authentification
interface AuthContextType {
    user: UserInfo | null;
    loading: boolean;
    login: (email: string, passwordHash: string, remember: boolean) => Promise<void>;
    logout: () => void;
    register: (data: {firstName: string; lastName: string; gender: UserGender; mobile: string; email: string; password: string}) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const router = useRouter();
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);

    // Helper : appelle l'API pour obtenir le salt hexadécimal
    const getLoginSalt = async (email: string): Promise<string> => {
        const res = await fetch(`/api/auth/loginSalt?email=${encodeURIComponent(email)}`);
        if (!res.ok) throw new Error("Identifiants invalides");
        const {salt} = (await res.json()) as {salt: string};
        return salt;
    };

    // Helper : dérive le hash PBKDF2 identique à l'inscription
    const deriveHash = async (salt: string, password: string): Promise<string> => {
        const saltBytes = new Uint8Array(salt.match(/.{2}/g)!.map(h => parseInt(h, 16)));
        const encoder = new TextEncoder();
        const salted = encoder.encode(salt + password);
        const key = await crypto.subtle.importKey("raw", salted, {name: "PBKDF2"}, false, ["deriveBits"]);
        const bits = await crypto.subtle.deriveBits({name: "PBKDF2", salt: saltBytes, iterations: 10000, hash: "SHA-512"}, key, 64 * 8);
        return Array.from(new Uint8Array(bits))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
    };

    // Méthode de login : appelle l'API et gère le cookie/token
    const login = async (email: string, password: string, remember: boolean = false) => {
        // 1) récupérer le salt
        const salt = await getLoginSalt(email);
        // 2) dériver le hash
        const hash = await deriveHash(salt, password);
        // 3) appeler l'API login
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email, hash, remember}),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Échec de la connexion");
        // Si pas de remember, garder le token persistant sur la session actuelle seulement
        if (!remember && data.token) {
            sessionStorage.setItem(STORAGE_SESSION_TOKEN, data.token);
        }
        await loadSession();
        setLoading(false);
        router.push("/");
    };

    // Helper pour dériver salt+hash
    const deriveSaltAndHash = async (password: string) => {
        // 1) Générer un salt aléatoire (16 bytes) et le transformer en hex
        const saltBytes = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = Array.from(saltBytes)
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
        // 2) Concaténer salt + password dans un seul buffer
        const encoder = new TextEncoder();
        const salted = encoder.encode(saltHex + password);
        // 3) Dériver un hash via PBKDF2(SHA-512, 10000 itérations, 64 bytes)
        const key = await crypto.subtle.importKey("raw", salted, {name: "PBKDF2"}, false, ["deriveBits"]);
        const bits = await crypto.subtle.deriveBits({name: "PBKDF2", salt: saltBytes, iterations: 10000, hash: "SHA-512"}, key, 64 * 8);
        const hashHex = Array.from(new Uint8Array(bits))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");
        return {salt: saltHex, hash: hashHex};
    };

    // Méthode d'inscription : appelle API
    const register = async (data: {firstName: string; lastName: string; gender: UserGender; mobile: string; email: string; password: string}) => {
        // 1) dériver salt+hash
        const {salt, hash} = await deriveSaltAndHash(data.password);
        // 2) appeler l'API register
        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({...data, salt, hash}),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || "Erreur d’inscription");
        }
        // 3) login automatique
        await login(data.email, data.password);
        setLoading(false);
    };

    const cleanClientData = () => {
        localStorage.removeItem(STORAGE_LOCAL_CART!);
        sessionStorage.removeItem(STORAGE_SESSION_TOKEN);
        setUser(null);
    };

    // Méthode de logout : supprime cookie et contexte
    const logout = async () => {
        await fetch("/api/auth/logout", {method: "POST"});
        cleanClientData();
        router.push("/login");
    };

    const loadSession = async () => {
        // récupérer le token en mémoire de navigation si présent
        const storedToken = typeof window !== "undefined" ? sessionStorage.getItem(STORAGE_SESSION_TOKEN) || undefined : undefined;
        try {
            const headers: Record<string, string> = {};
            if (!document.cookie.includes(STORAGE_COOKIE_AUTH) && storedToken) {
                // pas de cookie persistent : on tente le token en mémoire
                headers["Authorization"] = `Bearer ${storedToken}`;
            }
            const res = await fetch("/api/auth/session", {headers});
            const data = (await res.json()) as {ok: boolean; user: UserInfo | null};
            if (!data.ok) {
                cleanClientData();
                return;
            }
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // À l'initialisation, on vérifie la session via cookie ou token mémorisé
    useEffect(() => {
        loadSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                register,
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth doit être utilisé dans AuthProvider");
    return ctx;
};
