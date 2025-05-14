import React, {useState} from "react";

interface SessionExpiredModalProps {
    isOpen: boolean; // Prop pour contrôler l'ouverture/fermeture de la modal
    onClose: () => void; // Fonction de rappel pour fermer la modal
}

const SessionExpiredModal: React.FC<SessionExpiredModalProps> = ({isOpen, onClose}) => {
    // Ne pas afficher la modal si isOpen est false
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-bold mb-4">Session expirée</h2>
                <p className="mb-4">Votre session a expiré. Veuillez vous reconnecter pour continuer.</p>
                <button onClick={onClose} className="bg-primary text-white font-bold py-2 px-4 rounded">
                    Fermer
                </button>
            </div>
        </div>
    );
};

export default SessionExpiredModal;
