"use client";

import React, {useState} from "react";
import PersonalInfoForm from "@traintran/components/Forms/PersonalInfo/PersonalInfoForm";
import LoginAdherentForm from "@traintran/components/Forms/PersonalInfo/LoginAdherentForm";
import Header from "@traintran/components/Header/Header";
import Footer from "@traintran/components/Footer/Footer";
import {useAuth} from "@traintran/context/AuthContext";

// Page d'accès au compte – connexion ou formulaire d’info perso selon contexte
export default function Home() {
    const {user, logout} = useAuth();
    const [showLogin, setShowLogin] = useState(true); // toggle entre login et création de compte

    return (
        <>
            <Header />
            <div className="w-full flex justify-center items-center bg-background h-full py-8">
                {user ? (
                    // Affiche bouton de déconnexion si utilisateur connecté
                    <button onClick={logout} className="px-6 py-3 bg-red-500 text-white rounded">
                        Se déconnecter
                    </button>
                ) : showLogin ? (
                    <LoginAdherentForm setShowLogin={setShowLogin} /> // formulaire de login
                ) : (
                    <PersonalInfoForm setShowLogin={setShowLogin} /> // formulaire d’info perso pour inscription
                )}
            </div>
            <Footer />
        </>
    );
}
