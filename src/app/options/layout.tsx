import React from "react";
import type {Metadata} from "next";
import "@traintran/app/globals.css";

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
        <html lang="fr">
            <body>{children}</body>
        </html>
    );
}
