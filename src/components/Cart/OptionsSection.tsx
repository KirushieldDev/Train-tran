import React from "react";
import {IconLuggage, IconToolsKitchen2} from "@tabler/icons-react";

export const OptionsSection: React.FC = () => {
    return (
        <section className="p-6 bg-white rounded-lg shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
            <h2 className="mb-4 text-lg text-gray-700">Options sélectionnées</h2>
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <IconLuggage className="text-primary" size="22" />
                        <div className="text-base text-gray-700">Bagage supplémentaire</div>
                    </div>
                    <div className="text-base text-gray-800">+ 15 €</div>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <IconToolsKitchen2 className="text-primary" size="22" />
                        <div className="text-base text-gray-700">Repas à bord</div>
                    </div>
                    <div className="text-base text-gray-800">+ 10 €</div>
                </div>
            </div>
        </section>
    );
};
