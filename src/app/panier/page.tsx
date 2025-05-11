"use client";

import BookingSummary from "@traintran/components/Cart/BookingSummary";
import Header from "@traintran/components/Header/Header";
import Footer from "@traintran/components/Footer/Footer";
import ReservationStepper from "@traintran/components/common/ReservationStepper";
import React from "react";
import {useCart} from "@traintran/context/CartContext";

export default function Home() {
    const {cartTicket} = useCart();

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
            <Header />
            <ReservationStepper ticket={cartTicket} page="panier" />
            <BookingSummary />
            <Footer />
        </div>
    );
}
