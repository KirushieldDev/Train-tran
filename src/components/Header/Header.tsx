"use client";

import React, {useState} from "react";
import {IconCircleCheck, IconCircleX, IconUser} from "@tabler/icons-react";
import Logo from "@traintran/assets/Header/Logo";
import {NavigationLinks} from "@traintran/components/Header/NavigationLinks";
import Link from "next/link";
import {useAuth} from "@traintran/context/AuthContext";
import {useTimeout} from "@traintran/context/CartContext";
import TimeoutClock from "@traintran/components/Header/TimeoutClock";
import {useRouter} from "next/navigation";
import SessionExpiredModal from "@traintran/components/Modal/SessionExpiredModal";

export default function Header() {
    const {user, cleanClientData} = useAuth();
    const {isActive: showTimeoutClock, remainingTime, stopTimeout} = useTimeout();
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const handleTimeout = () => {
        stopTimeout();
        // On affiche le modal
        setShowModal(true);
        // On détruit les données du local storage
        cleanClientData();
    };

    const closeModal = () => {
        // On peut fermer le modal
        setShowModal(false);
        // On rammène à l'accueil
        router.push("/");
    };

    return (
        <header className="flex flex-col items-start px-20 py-0 bg-white border-0 shadow-sm">
            <nav className="flex justify-between items-center px-0 py-2.5 w-full">
                <div className="flex gap-10 items-center flex-1 max-sm:gap-5">
                    <Link href="/">
                        <Logo />
                    </Link>
                    <NavigationLinks />
                </div>

                {showTimeoutClock && <TimeoutClock initialTime={remainingTime} onTimeout={handleTimeout} />}

                {user ? (
                    <IconCircleCheck size={24} className="text-green-500" title="Connecté" />
                ) : (
                    <IconCircleX size={24} className="text-red-500" title="Non connecté" />
                )}
                <Link href="/login">
                    <IconUser className="text-textSecondary" size="26" />
                </Link>
            </nav>

            <SessionExpiredModal isOpen={showModal} onClose={closeModal} />
        </header>
    );
}
