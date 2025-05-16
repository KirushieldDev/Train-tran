import React from "react";
import type {Metadata} from "next";
import "@traintran/app/globals.css";
import {CartProvider} from "@traintran/context/CartContext";
import {AuthProvider} from "@traintran/context/AuthContext";

// Métadonnées globales de l'application
export const metadata: Metadata = {
    title: process.env.METADATA_TITLE,
    description: process.env.METADATA_DESCRIPTION,
};

// Layout principal englobant l'app avec providers et balises HTML
export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // Contexte d'authentification global
        <AuthProvider>
            {/* Contexte panier global */}
            <CartProvider>
                <html lang="fr">
                    <body>{children}</body>
                </html>
            </CartProvider>
        </AuthProvider>
    );
}
