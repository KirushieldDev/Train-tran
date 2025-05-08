"use client";

import React, {useState, useEffect} from "react";
import PersonalInfoForm from "@traintran/components/Forms/PersonalInfo/PersonalInfoForm";
import LoginAdherentForm from "@traintran/components/Forms/PersonalInfo/LoginAdherentForm";
import Header from "@traintran/components/Header/Header";
import Footer from "@traintran/components/Footer/Footer";
import {useRouter} from "next/navigation";
import {checkIfLogin} from "@traintran/utils/auth";

export default function Home() {
    const [isLogged, setIsLogged] = useState<boolean | null>(null);
    const [showLogin, setShowLogin] = useState(true);
    const router = useRouter();

    useEffect(() => {
        (async () => {
            const user = await checkIfLogin();
            setIsLogged(!!user);
        })();
    }, []);

    const handleLogout = async () => {
        await fetch("/api/auth/logout", {method: "POST"});
        setIsLogged(false);
        setShowLogin(true);
        router.refresh();
    };

    if (isLogged === null) return null;

    return (
        <>
            <Header />
            <div className="w-full flex justify-center items-center bg-background h-full py-8">
                {isLogged ? (
                    <button onClick={handleLogout} className="px-6 py-3 bg-red-500 text-white rounded">
                        Se déconnecter
                    </button>
                ) : showLogin ? (
                    <LoginAdherentForm setShowLogin={setShowLogin} />
                ) : (
                    <PersonalInfoForm setShowLogin={setShowLogin} />
                )}
            </div>
            <Footer />
        </>
    );
}
