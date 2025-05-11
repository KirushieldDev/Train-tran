"use client";

import Header from "@traintran/components/Header/Header";
import Footer from "@traintran/components/Footer/Footer";
import ReservationStepper from "@traintran/components/common/ReservationStepper";
import React from "react";
import {useCart} from "@traintran/context/CartContext";
import PassengersForm from "@traintran/components/Forms/PassengersForm";

export default function Home() {
    const {cartTicket} = useCart();

    return (
        <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
            <Header />
            <ReservationStepper ticket={cartTicket} page="passagers" />
            <div className="w-full flex justify-center items-center">
                <PassengersForm />
            </div>
            <Footer />
        </div>
    );
}
