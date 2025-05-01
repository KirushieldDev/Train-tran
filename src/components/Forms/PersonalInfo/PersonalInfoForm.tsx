"use client";

import React, {useState} from "react";
import {IconMailFilled, IconLockPassword, IconPhone} from "@tabler/icons-react";
import {GenderSelection} from "@traintran/components/Inputs/Form/GenderSelection";
import {FormInput} from "@traintran/components/Inputs/Form/FormInput";
import {FormButton} from "@traintran/components/Inputs/Form/FormButton";
import {useRouter} from "next/navigation";

type PersonalInfoFormProps = {
    setShowLogin: (val: boolean) => void;
};

interface PersonalInfo {
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
    const [formData, setFormData] = useState<PersonalInfo>({
        gender: "",
        lastName: "",
        firstName: "",
        mobile: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const arrayBufferToHex = (buf: ArrayBuffer): string =>
        Array.from(new Uint8Array(buf))
            .map(b => b.toString(16).padStart(2, "0"))
            .join("");

    const hashPassword = async (password: string, saltHex: string): Promise<string> => {
        const encoder = new TextEncoder();
        const passwordKey = await crypto.subtle.importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveBits"]);
        const salt = Uint8Array.from(saltHex.match(/.{2}/g)!.map(byte => parseInt(byte, 16)));
        const bits = await crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt,
                iterations: 10000,
                hash: "SHA-512",
            },
            passwordKey,
            64 * 8,
        );
        return arrayBufferToHex(bits);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const {gender, lastName, firstName, mobile, email, password, confirmPassword} = formData;
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }

        // générer un salt aléatoire
        const saltBytes = crypto.getRandomValues(new Uint8Array(16));
        const saltHex = arrayBufferToHex(saltBytes.buffer);
        const hash = await hashPassword(password, saltHex);

        const payload = {gender, lastName, firstName, mobile, email, salt: saltHex, hash};

        try {
            const res = await fetch("/api/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const err = await res.json();
                alert(err.error || "Erreur inscription");
            }
            router.push("/");
        } catch (err) {
            console.error(err);
            alert((err as Error).message);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
        }));
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
                <GenderSelection value={formData.gender} onChange={value => handleInputChange("gender", value)} />

                <div className="flex flex-wrap gap-6 justify-between items-center mt-3.5 w-full">
                    <div className="self-stretch my-auto min-w-60 w-[292px]">
                        <FormInput label="Nom" name="lastName" value={formData.lastName} onChange={value => handleInputChange("lastName", value)} required />
                    </div>
                    <div className="self-stretch my-auto min-w-60 w-[292px]">
                        <FormInput
                            label="Prénom"
                            name="firstName"
                            value={formData.firstName}
                            onChange={value => handleInputChange("firstName", value)}
                            required
                        />
                    </div>
                </div>

                <div className="mt-3.5">
                    <FormInput
                        label="Téléphone mobile"
                        name="mobile"
                        type="tel"
                        icon={<IconPhone className="text-textSecondary" size="18" />}
                        value={formData.mobile}
                        onChange={value => handleInputChange("mobile", value)}
                        required
                    />
                </div>

                <div className="mt-3.5">
                    <FormInput
                        label="Email"
                        name="email"
                        type="email"
                        icon={<IconMailFilled className="text-textSecondary" size="18" />}
                        value={formData.email}
                        onChange={value => handleInputChange("email", value)}
                        required
                    />
                </div>

                <div className="mt-3.5">
                    <FormInput
                        label="Mot de passe"
                        name="password"
                        type="password"
                        icon={<IconLockPassword className="text-textSecondary" size="18" />}
                        value={formData.password}
                        onChange={value => handleInputChange("password", value)}
                        required
                    />
                </div>

                <div className="mt-3.5">
                    <FormInput
                        label="Confirmation de mot de passe"
                        name="confirmPassword"
                        type="password"
                        icon={<IconLockPassword className="text-textSecondary" size="18" />}
                        value={formData.confirmPassword}
                        onChange={value => handleInputChange("confirmPassword", value)}
                        required
                    />
                </div>

                <div className="mt-3.5">
                    <FormButton type="submit">S'inscrire</FormButton>
                </div>
            </div>
            <div className="flex justify-center items-center gap-4 py-px mt-4 w-full text-sm text-center">
                <p className="self-center leading-none text-textSecondary">Adhérent ?</p>
                <button onClick={() => props.setShowLogin(true)} type="button" className="my-2 font-medium text-primary">
                    Se connecter
                </button>
            </div>
        </form>
    );
}
