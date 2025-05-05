"use client";

import React, {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {FormInput} from "@traintran/components/Inputs/Form/FormInput";
import {FormButton} from "@traintran/components/Inputs/Form/FormButton";
import {IconMailFilled, IconLockPassword, IconPhone} from "@tabler/icons-react";
import {GenderSelection} from "@traintran/components/Inputs/Form/GenderSelection";

type PersonalInfoFormProps = {
    setShowLogin: (val: boolean) => void;
};

interface FormData {
    gender: string;
    lastName: string;
    firstName: string;
    mobile: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export default function PersonalInfoForm(props: PersonalInfoFormProps) {
    const router = useRouter();
    const [data, setData] = useState<FormData>({
        gender: "",
        lastName: "",
        firstName: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (field: keyof FormData, value: string) => {
        setData(prev => ({...prev, [field]: value}));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (data.password !== data.confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }

        // 1) Générer un salt aléatoire (16 bytes) et le transformer en hex
        const saltBytes = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = Array.from(saltBytes)
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

        // 2) Concaténer salt + password dans un seul buffer
        const encoder = new TextEncoder();
        const saltedPassword = encoder.encode(saltHex + data.password);

        // 3) Dériver un hash via PBKDF2(SHA-512, 10000 itérations, 64 bytes)
        const key = await crypto.subtle.importKey("raw", saltedPassword, {name: "PBKDF2"}, false, ["deriveBits"]);
        const bits = await crypto.subtle.deriveBits({name: "PBKDF2", salt: saltBytes, iterations: 10000, hash: "SHA-512"}, key, 64 * 8);
        const hashHex = Array.from(new Uint8Array(bits))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

        // 4) N’envoyer que saltHex et hashHex
        const payload = {
            gender: data.gender,
            lastName: data.lastName,
            firstName: data.firstName,
            mobile: data.mobile,
            email: data.email,
            salt: saltHex,
            hash: hashHex,
        };

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        });

        if (res.ok) router.push("/");
        else {
            const err = await res.json();
            alert(err.error || "Erreur inscription");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col justify-center p-8 max-w-2xl bg-white rounded-xl shadow-[0px_1px_2px_rgba(0,0,0,0.05)] max-md:px-5">
            <div className="flex flex-col justify-center w-full leading-none max-md:max-w-full">
                <h1 className="text-2xl font-semibold text-textPrimary max-md:max-w-full">Informations Personnelles</h1>
                <p className="mt-3.5 text-base text-textSecondary max-md:max-w-full">Veuillez renseigner vos informations</p>
            </div>

            <div className="mt-8 w-full max-md:max-w-full">
                <GenderSelection value={data.gender} onChange={value => handleChange("gender", value)} />

                <div className="flex flex-wrap gap-6 justify-between items-center mt-3.5 w-full">
                    <div className="self-stretch my-auto min-w-60 w-[292px]">
                        <FormInput label="Nom" name="lastName" value={data.lastName} onChange={value => handleChange("lastName", value)} required />
                    </div>
                    <div className="self-stretch my-auto min-w-60 w-[292px]">
                        <FormInput label="Prénom" name="firstName" value={data.firstName} onChange={value => handleChange("firstName", value)} required />
                    </div>
                </div>

                <div className="mt-3.5">
                    <FormInput
                        label="Téléphone mobile"
                        name="mobile"
                        type="tel"
                        icon={<IconPhone className="text-textSecondary" size="18" />}
                        value={data.mobile}
                        onChange={value => handleChange("mobile", value)}
                        required
                    />
                </div>

                <div className="mt-3.5">
                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        icon={<IconMailFilled className="text-textSecondary" size="18" />}
                        value={data.email}
                        onChange={value => handleChange("email", value)}
                        required
                    />
                </div>

                <div className="mt-3.5">
                    <FormInput
                        label="Mot de passe"
                        name="password"
                        type="password"
                        icon={<IconLockPassword className="text-textSecondary" size="18" />}
                        value={data.password}
                        onChange={value => handleChange("password", value)}
                        required
                    />
                </div>

                <div className="mt-3.5">
                    <FormInput
                        label="Confirmation de mot de passe"
                        name="confirmPassword"
                        type="password"
                        icon={<IconLockPassword className="text-textSecondary" size="18" />}
                        value={data.confirmPassword}
                        onChange={value => handleChange("confirmPassword", value)}
                        required
                    />
                </div>

                <div className="mt-3.5">
                    <FormButton type="submit">S'inscrire</FormButton>
                </div>
            </div>
            <div className="flex justify-center items-center gap-4 py-px mt-4 w-full text-sm text-center">
                <p className="self-center leading-none text-textSecondary">Déjà dhérent ?</p>
                <button onClick={() => props.setShowLogin(true)} type="button" className="my-2 font-medium text-primary">
                    Se connecter
                </button>
            </div>
        </form>
    );
}
