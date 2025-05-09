import React from "react";
import type {Metadata} from "next";
import "@traintran/app/globals.css";
import {CartProvider} from "@traintran/context/CartContext";
import {AuthProvider} from "@traintran/context/AuthContext";

export const metadata: Metadata = {
    title: process.env.METADATA_TITLE,
    description: process.env.METADATA_DESCRIPTION,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <AuthProvider>
                <CartProvider>
                    <html lang="fr">
                        <body>{children}</body>
                    </html>
                </CartProvider>
        </AuthProvider>
    );
}
