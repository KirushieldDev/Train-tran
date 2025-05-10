"use client";

import React from "react";
import { Stepper, Step, StepLabel } from "@mui/material";

interface ReservationStepperProps {
    activeStep: number;
}

const steps = [
    "Choisir la meilleure date au meilleur prix",
    "Nombre de passagers",
    "Les options disponibles",
    "Votre panier",
    "Procéder au paiement",
    "Confirmation du paiement",
];

export default function ReservationStepper({ activeStep }: ReservationStepperProps) {
    return (
        <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
                padding: "16px",
                ".MuiStepConnector-line": {
                    borderColor: "var(--color-primary-dark)",
                },
                ".Mui-active .MuiStepIcon-root": {
                    color: "var(--color-primary)",
                },
                ".Mui-completed .MuiStepIcon-root": {
                    color: "var(--color-primary-dark)",
                },
                ".MuiStepLabel-label": {
                    color: "var(--color-textSecondary)",
                    "&.Mui-active": {
                        color: "var(--color-textPrimary)",
                    },
                    "&.Mui-completed": {
                        color: "var(--color-textPrimary)",
                    },
                },
            }}
        >
            {steps.map((label, idx) => (
                <Step key={label} completed={idx < activeStep} className="py-4">
                    <StepLabel
                        optional={idx === steps.length - 1 && activeStep < steps.length - 1 ? <></> : undefined}
                        onClick={idx < activeStep ? () => { /* naviguer à l’étape idx */ } : undefined}
                        sx={{
                            cursor: idx < activeStep ? "pointer" : "default",
                        }}
                    >
                        {label}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}
