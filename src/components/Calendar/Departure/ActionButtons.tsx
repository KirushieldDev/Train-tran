import React from "react";
import Button from "@traintran/components/common/Button";

interface ActionButtonsProps {
    onCancel: () => void;
    onContinue: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({onCancel, onContinue}) => {
    return (
        <div className="flex flex-wrap gap-2.5 justify-center mt-8 mb-10 w-full text-base text-center max-md:max-w-full">
            <Button onClick={onCancel} variant="outline" size="lg">
                Annuler
            </Button>
            <Button onClick={onContinue} variant="secondary" size="lg">
                Continuer la commande
            </Button>
        </div>
    );
};
