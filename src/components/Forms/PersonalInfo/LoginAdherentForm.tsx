"use client";

import React, {FormEvent, useState} from "react";
import {IconUser, IconLockPassword} from "@tabler/icons-react";
import {FormInput} from "@traintran/components/Inputs/Form/FormInput";
import {FormButton} from "@traintran/components/Inputs/Form/FormButton";
import {useAuth} from "@traintran/context/AuthContext";

type LoginAdherentFormProps = {
    setShowLogin: (val: boolean) => void;
};

interface LoginData {
    email: string;
    password: string;
}

// Formulaire de connexion pour les adhérents avec validation, gestion d’erreur, et option "Se souvenir de moi"
export default function FormLoginAdherent(props: LoginAdherentFormProps) {
    const [loginData, setLogin] = useState<LoginData>({email: "", password: ""});
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const {login} = useAuth();

    const handleChange = (field: keyof LoginData, val: string) => {
        setLogin(prev => ({...prev, [field]: val}));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (loginData.password.length < 8) {
            setErrorMsg("Le mot de passe doit faire au moins 8 carctères.");
            return;
        }
        try {
            await login(loginData.email, loginData.password, rememberMe);
        } catch (err: unknown) {
            setErrorMsg(err instanceof Error ? err.message : "Erreur de connexion.");
        }
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
                            label="Email"
                            name="email"
                            type="email"
                            placeholder={"Votre email"}
                            value={loginData.email}
                            icon={<IconUser className="text-textSecondary" size="18" />}
                            onChange={value => handleChange("email", value)}
                            required
                        />
                    </div>
                </div>

                <div className="mt-6 w-full">
                    <div className="mt-2 w-full">
                        <FormInput
                            label="Mot de passe"
                            name="password"
                            type="password"
                            placeholder={"Votre mot de passe"}
                            value={loginData.password}
                            icon={<IconLockPassword className="text-textSecondary" size="18" />}
                            onChange={value => handleChange("password", value)}
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-5 justify-between mt-6 w-full text-sm">
                    <div className="flex gap-2">
                        <input type="checkbox" className="mt-1" id="remember-me" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                        <label htmlFor="remember-me" className="py-1.5 cursor-pointer">
                            Se souvenir de moi
                        </label>
                    </div>
                    <button type="button" className="py-1 text-primary">
                        Mot de passe oublié ?
                    </button>
                </div>

                {/* Affichage de l’erreur si besoin */}
                {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}

                <div className="mt-3.5">
                    <FormButton type="submit">Se connecter</FormButton>
                </div>
            </form>

            <div className="flex flex-col justify-center items-center py-px mt-7 w-full text-sm text-center">
                <p className="self-center leading-none text-textSecondary">Pas encore adhérent ?</p>
                <button onClick={() => props.setShowLogin(false)} type="button" className="my-2 font-medium text-primary">
                    S&#39;inscrire et voir nos offres d&#39;abonnement
                </button>
            </div>
        </section>
    );
}
