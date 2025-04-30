import * as React from "react";

interface ActionButtonsProps {
    onCancel: () => void;
    onContinue: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({onCancel, onContinue}) => {
    return (
        <div className="flex flex-wrap gap-2.5 justify-center mt-8 mb-10 w-full text-base text-center max-md:max-w-full">
            <button onClick={onCancel} className="gap-2.5 self-stretch py-2.5 h-full text-gray-600 whitespace-nowrap bg-gray-100 rounded-lg w-[200px]">
                Annuler
            </button>
            <button onClick={onContinue} className="gap-2.5 self-stretch py-3 my-auto font-semibold text-white bg-emerald-600 rounded-lg w-[200px]">
                Continuer la commande
            </button>
        </div>
    );
};
