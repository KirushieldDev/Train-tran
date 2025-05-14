"use client";

import React from "react";
import {Stepper, Step, StepLabel} from "@mui/material";
import {useRouter} from "next/navigation";
import {Ticket} from "@traintran/context/CartContext";

interface StepConfig {
    label: string;
    page: string; // nom de la route (sans slash ni params)
}

const steps: StepConfig[] = [
    {label: "Choisir la meilleure date au meilleur prix", page: "calendrier"},
    {label: "Nombre de passagers", page: "passagers"},
    {label: "Les options disponibles", page: "options"},
    {label: "Votre panier", page: "panier"},
    {label: "Procéder au paiement", page: "paiement"},
    {label: "Confirmation du paiement", page: "confirmation"},
];

interface ReservationStepperProps {
    ticket: Ticket | null;
    page: string;
}

function getStepIndex(page: string): number {
    const idx = steps.findIndex(s => s.page === page);
    return idx >= 0 ? idx : 0;
}

export default function ReservationStepper(props: ReservationStepperProps) {
    const {ticket, page} = props;
    const router = useRouter();
    const activeStep = getStepIndex(page);

    const handleStepClick = (step: StepConfig, index: number) => {
        if (index === 0 && ticket) {
            // page calendrier : on reconstruit les params
            const params = new URLSearchParams({
                departure: ticket.outbound.departureStation,
                arrival: ticket.outbound.arrivalStation,
                departure_date: ticket.outbound.departureTime.split("T")[0],
            });
            if (ticket.inbound) {
                params.set("return_date", ticket.inbound.departureTime.split("T")[0]);
            }
            router.push(`/calendrier?${params.toString()}`);
        } else {
            // pour les autres étapes on part du nom de page
            router.push(`/${step.page}`);
        }
    };

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
            }}>
            {steps.map((step, index) => (
                <Step
                    key={step.label}
                    completed={index < activeStep || activeStep === steps.length - 1}
                    disabled={activeStep === steps.length - 1}
                    className="py-4">
                    <StepLabel
                        optional={index === steps.length - 1 && activeStep < steps.length - 1 ? <></> : undefined}
                        onClick={
                            index < activeStep && activeStep < steps.length - 1
                                ? () => {
                                      handleStepClick(step, index);
                                  }
                                : undefined
                        }
                        sx={{cursor: index < activeStep ? "pointer" : "default"}}>
                        {step.label}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    );
}
