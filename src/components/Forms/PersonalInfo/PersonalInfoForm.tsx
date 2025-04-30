"use client";

import * as React from "react";
import {FormInput} from "../../Inputs/Form/FormInput";
import {GenderSelection} from "../../Inputs/Form/GenderSelection";
import {FormButton} from "../../Inputs/Form/FormButton";
import {IconMailFilled, IconMailOpenedFilled, IconPhone} from "@tabler/icons-react";

const PersonalInfoForm: React.FC = () => {
    const [formData, setFormData] = React.useState({
        gender: "",
        lastName: "",
        firstName: "",
        mobile: "",
        email: "",
        confirmEmail: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log("Form submitted:", formData);
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
            <header className="flex flex-col justify-center w-full leading-none max-md:max-w-full">
                <h1 className="text-2xl font-semibold text-textPrimary max-md:max-w-full">Informations Personnelles</h1>
                <p className="mt-3.5 text-base text-textSecondary max-md:max-w-full">Veuillez renseigner vos informations</p>
            </header>

            <div className="mt-8 w-full max-md:max-w-full">
                <GenderSelection value={formData.gender} onChange={value => handleInputChange("gender", value)} />

                <div className="flex flex-wrap gap-6 justify-between items-center mt-3.5 w-full">
                    <div className="self-stretch my-auto min-w-60 w-[292px]">
                        <FormInput label="Nom" value={formData.lastName} onChange={value => handleInputChange("lastName", value)} required />
                    </div>
                    <div className="self-stretch my-auto min-w-60 w-[292px]">
                        <FormInput label="Prénom" value={formData.firstName} onChange={value => handleInputChange("firstName", value)} required />
                    </div>
                </div>

                <div className="mt-3.5">
                    <FormInput
                        label="Téléphone mobile"
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
                        type="email"
                        icon={<IconMailFilled className="text-textSecondary" size="18" />}
                        value={formData.email}
                        onChange={value => handleInputChange("email", value)}
                        required
                    />
                </div>

                <div className="mt-3.5">
                    <FormInput
                        label="Confirmation Email"
                        type="email"
                        icon={<IconMailOpenedFilled className="text-textSecondary" size="18" />}
                        value={formData.confirmEmail}
                        onChange={value => handleInputChange("confirmEmail", value)}
                        required
                    />
                </div>

                <div className="mt-3.5">
                    <FormButton type="submit">Continuer</FormButton>
                </div>
            </div>
        </form>
    );
};

export default PersonalInfoForm;
