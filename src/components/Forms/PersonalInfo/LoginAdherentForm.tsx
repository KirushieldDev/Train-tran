"use client";

import React, {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {IconUser, IconLockPassword} from "@tabler/icons-react";
import {FormInput} from "@traintran/components/Inputs/Form/FormInput";
import {FormButton} from "@traintran/components/Inputs/Form/FormButton";

type LoginAdherentFormProps = {
    setShowLogin: (val: boolean) => void;
};

interface LoginData {
    email: string;
    password: string;
}

export default function FormLoginAdherent(props: LoginAdherentFormProps) {
    const router = useRouter();
    const [login, setLogin] = useState<LoginData>({email: "", password: ""});

    const handleChange = (field: keyof LoginData, val: string) => {
        setLogin(prev => ({...prev, [field]: val}));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        // récupérer le salt du serveur
        const saltRes = await fetch(`/api/auth/loginSalt?email=${encodeURIComponent(login.email)}`);
        if (!saltRes.ok) {
            alert("Identifiants invalides");
            return;
        }
        const {salt} = (await saltRes.json()) as {salt: string};

        // concaténation + dérivation PBKDF2 identique à l'inscription
        const saltBytes = new Uint8Array(salt.match(/.{2}/g)!.map(h => parseInt(h, 16)));
        const encoder = new TextEncoder();
        const saltedPwd = encoder.encode(salt + login.password);
        const key = await crypto.subtle.importKey("raw", saltedPwd, {name: "PBKDF2"}, false, ["deriveBits"]);
        const bits = await crypto.subtle.deriveBits({name: "PBKDF2", salt: saltBytes, iterations: 10000, hash: "SHA-512"}, key, 64 * 8);
        const hashHex = Array.from(new Uint8Array(bits))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({email: login.email, hash: hashHex}),
        });

        if (res.ok) router.push("/");
        else {
            const err = await res.json();
            alert(err.error || "Erreur connexion");
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
                            value={login.email}
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
                            value={login.password}
                            icon={<IconLockPassword className="text-textSecondary" size="18" />}
                            onChange={value => handleChange("password", value)}
                            required
                        />
                    </div>
                </div>

                <div className="flex gap-5 justify-between mt-6 w-full text-sm">
                    <div className="flex gap-2">
                        <input type="checkbox" className="mt-1" id="remember-me" />
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
                <button onClick={() => props.setShowLogin(false)} type="button" className="my-2 font-medium text-primary">
                    S'inscrire et voir nos offres d'abonnement
                </button>
            </div>
        </section>
    );
}
