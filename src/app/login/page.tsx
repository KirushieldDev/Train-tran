"use client";

import React, { useState } from "react";
import PersonalInfoForm from "@traintran/components/Forms/PersonalInfo/PersonalInfoForm";
import LoginAdherentForm from "@traintran/components/Forms/PersonalInfo/LoginAdherentForm";
import Header from "@traintran/components/Header/Header";
import Footer from "@traintran/components/Footer/Footer";

export default function Home() {
    const [showLogin, setShowLogin] = useState(true);

    return (
        <>
            <Header />
            <div className="w-full flex justify-center items-center bg-background h-full py-8">
                {showLogin ?
                    <LoginAdherentForm setShowLogin={setShowLogin} />
                    : <PersonalInfoForm setShowLogin={setShowLogin} />}
            </div>
            <Footer />
        </>
    );
}
