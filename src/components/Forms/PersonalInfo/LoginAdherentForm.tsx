"use client";

import React, {useState} from "react";
import {IconUser, IconLockPassword} from "@tabler/icons-react";
import {FormInput} from "@traintran/components/Inputs/Form/FormInput";
import {FormButton} from "@traintran/components/Inputs/Form/FormButton";

type LoginAdherentFormProps = {
    setShowLogin: (val: boolean) => void;
};

export default function FormLoginAdherent(props: LoginAdherentFormProps) {
    const [formData, setFormData] = useState({
        identifiant: "",
        password: "",
        rememberMe: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle login logic here
        console.log("Form submitted:", formData);
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    return (
        <section className="overflow-hidden p-8 max-w-md bg-white rounded-xl shadow-[0px_2px_4px_rgba(0,0,0,0.1)]">
            <div className="px-7 py-1 w-full leading-none text-center">
                <h1 className="text-2xl font-semibold text-textPrimary">Espace Adhérents</h1>
                <p className="mt-3 text-base text-textSecondary">Connectez-vous pour accéder à vos avantages</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 w-full">
                <div className="w-full">
                    <div className="mt-2 w-full">
                        <FormInput
                            label="Identifiant"
                            placeholder={"Votre identifiant"}
                            value={formData.identifiant}
                            icon={<IconUser className="text-textSecondary" size="18" />}
                            onChange={value => handleInputChange("identifiant", value)}
                            required
                        />
                    </div>
                </div>

                <div className="mt-6 w-full">
                    <div className="mt-2 w-full">
                        <FormInput
                            label="Mot de passe"
                            placeholder={"Votre mot de passe"}
                            value={formData.password}
                            icon={<IconLockPassword className="text-textSecondary" size="18" />}
                            onChange={value => handleInputChange("password", value)}
                            type="password"
                        />
                    </div>
                </div>

                <div className="flex gap-5 justify-between mt-6 w-full text-sm">
                    <div className="flex gap-2">
                        <input
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={() => handleInputChange("rememberMe", !formData.rememberMe)}
                            className="mt-1"
                            id="remember-me"
                        />
                        <label htmlFor="remember-me" className="py-1.5 cursor-pointer">
                            Se souvenir de moi
                        </label>
                    </div>
                    <button type="button" className="py-1 text-primary">
                        Mot de passe oublié ?
                    </button>
                </div>

                <div className="mt-3.5">
                    <FormButton type="submit">Se connecter</FormButton>
                </div>
            </form>

            <div className="flex flex-col justify-center items-center py-px mt-7 w-full text-sm text-center">
                <p className="self-center leading-none text-textSecondary">Pas encore adhérent ?</p>
                <button
                    onClick={() => props.setShowLogin(false)}
                    type="button"
                    className="my-2 font-medium text-primary">
                    S'inscrire et voir nos offres d'abonnement
                </button>
            </div>
        </section>
    );
}